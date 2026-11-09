import { query, pool } from '../db/connection.js';
import { findById, updateOrder } from './order.model.js';
import crypto from 'crypto';
import { encryptSensitiveField, decryptSensitiveField } from '../utils/fieldEncryption.js';

const memoryRefunds = new Map();

const decryptRefund = (refund) => refund ? ({
  ...refund,
  account_number: decryptSensitiveField(refund.account_number),
  account_holder_name: decryptSensitiveField(refund.account_holder_name),
}) : null;

export const createRefundRecord = async ({
  order_id,
  bank_name,
  account_number,
  account_holder_name,
  refund_amount,
  reason = 'Barang kosong di toko',
}) => {
  const id = crypto.randomUUID();
  const storedRecord = {
    id,
    order_id,
    bank_name,
    account_number: encryptSensitiveField(account_number),
    account_holder_name: encryptSensitiveField(account_holder_name),
    refund_amount: Number(refund_amount),
    reason,
    is_completed: false,
    transfer_receipt_url: null,
    processed_by: null,
    created_at: new Date(),
    completed_at: null,
  };

  if (!pool) {
    memoryRefunds.set(id, storedRecord);
    return decryptRefund(storedRecord);
  }

  const sql = `
    INSERT INTO refunds (
      id, order_id, bank_name, account_number, account_holder_name, refund_amount, reason
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [
    id,
    order_id,
    bank_name,
    storedRecord.account_number,
    storedRecord.account_holder_name,
    refund_amount,
    reason,
  ];

  const res = await query(sql, values);
  const created = res.rows[0];
  memoryRefunds.set(id, created);
  return decryptRefund(created);
};

export const findRefundById = async (id) => {
  if (!pool) return decryptRefund(memoryRefunds.get(id) || null);
  const res = await query('SELECT * FROM refunds WHERE id = $1 LIMIT 1', [id]);
  return decryptRefund(res.rows[0] || memoryRefunds.get(id) || null);
};

export const findRefundByOrderId = async (orderId) => {
  if (!pool) {
    const refund = Array.from(memoryRefunds.values()).find((item) => item.order_id === orderId) || null;
    return decryptRefund(refund);
  }
  const res = await query('SELECT * FROM refunds WHERE order_id = $1 LIMIT 1', [orderId]);
  return decryptRefund(res.rows[0] || null);
};

export const listAllRefunds = async () => {
  if (!pool) return Array.from(memoryRefunds.values()).map(decryptRefund);
  const res = await query('SELECT * FROM refunds ORDER BY created_at DESC');
  return res.rows.map(decryptRefund);
};


export const createRefundRequest = async ({ order_id, bank_name, account_number, account_holder_name, refund_amount, reason }) => {
  const encryptedAccount = encryptSensitiveField(account_number);
  const encryptedHolder = encryptSensitiveField(account_holder_name);

  if (!pool) {
    const order = await findById(order_id);
    if (!order || order.service_type !== 'titip_beli' || order.payment_status !== 'PAID' || !['CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS'].includes(order.status)) {
      const error = new Error('Pesanan tidak lagi memenuhi syarat pengajuan refund.');
      error.statusCode = 409;
      throw error;
    }
    if (await findRefundByOrderId(order_id)) {
      const error = new Error('Pengajuan refund untuk pesanan ini sudah tercatat.');
      error.statusCode = 409;
      throw error;
    }
    const refund = await createRefundRecord({ order_id, bank_name, account_number, account_holder_name, refund_amount, reason });
    const updatedOrder = await updateOrder(order_id, { status: 'REFUND_REQUESTED' });
    if (!updatedOrder) {
      const error = new Error('Status pesanan gagal diperbarui untuk pengajuan refund.');
      error.statusCode = 409;
      throw error;
    }
    return refund;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const orderResult = await client.query(
      `UPDATE orders SET status = 'REFUND_REQUESTED', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND service_type = 'titip_beli' AND payment_status = 'PAID'
         AND status IN ('CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS')
       RETURNING id`,
      [order_id]
    );
    if (!orderResult.rows[0]) {
      const error = new Error('Pesanan tidak lagi memenuhi syarat pengajuan refund.');
      error.statusCode = 409;
      throw error;
    }
    const id = crypto.randomUUID();
    const insertResult = await client.query(
      `INSERT INTO refunds (id, order_id, bank_name, account_number, account_holder_name, refund_amount, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, order_id, bank_name, encryptedAccount, encryptedHolder, refund_amount, reason]
    );
    await client.query('COMMIT');
    return decryptRefund(insertResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    if (error.code === '23505') {
      error.statusCode = 409;
      error.message = 'Pengajuan refund untuk pesanan ini sudah tercatat.';
    }
    throw error;
  } finally {
    client.release();
  }
};

export const completeRefundRequest = async (id, processedBy, receiptUrl = null) => {
  if (!pool) {
    const existing = await findRefundById(id);
    if (!existing || existing.is_completed) return null;
    const updated = await markRefundCompleted(id, processedBy, receiptUrl);
    if (!updated) return null;
    await updateOrder(existing.order_id, { status: 'REFUNDED', payment_status: 'REFUNDED' });
    return updated;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const refundResult = await client.query(
      `UPDATE refunds SET is_completed = TRUE, processed_by = $2, transfer_receipt_url = $3, completed_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND is_completed = FALSE RETURNING *`,
      [id, processedBy, receiptUrl]
    );
    if (!refundResult.rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    const refund = refundResult.rows[0];
    const orderResult = await client.query(
      `UPDATE orders SET status = 'REFUNDED', payment_status = 'REFUNDED', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 RETURNING id`,
      [refund.order_id]
    );
    if (!orderResult.rows[0]) throw new Error('Order untuk refund tidak ditemukan.');
    await client.query('COMMIT');
    return decryptRefund(refund);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const markRefundCompleted = async (id, processedBy, receiptUrl = null) => {
  const completedAt = new Date();
  if (!pool) {
    const existing = memoryRefunds.get(id);
    if (!existing || existing.is_completed) return null;
    const updated = {
      ...existing,
      is_completed: true,
      processed_by: processedBy,
      transfer_receipt_url: receiptUrl,
      completed_at: completedAt,
    };
    memoryRefunds.set(id, updated);
    return decryptRefund(updated);
  }

  const sql = `
    UPDATE refunds
    SET is_completed = TRUE, processed_by = $2, transfer_receipt_url = $3, completed_at = CURRENT_TIMESTAMP
    WHERE id = $1 AND is_completed = FALSE
    RETURNING *;
  `;
  const res = await query(sql, [id, processedBy, receiptUrl]);
  return decryptRefund(res.rows[0] || null);
};

export default {
  createRefundRecord,
  createRefundRequest,
  completeRefundRequest,
  findRefundById,
  findRefundByOrderId,
  listAllRefunds,
  markRefundCompleted,
};
