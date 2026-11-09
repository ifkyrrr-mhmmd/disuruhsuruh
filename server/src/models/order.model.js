import { query, pool } from '../db/connection.js';
import crypto from 'crypto';

// In-memory fallback cache for development/offline testing
const memoryOrders = new Map();

export const insertOrder = async (orderData) => {
  const id = crypto.randomUUID();
  const fullOrder = {
    id,
    ...orderData,
    status: orderData.status || 'PENDING_REVIEW',
    payment_status: orderData.payment_status || 'UNPAID',
    created_at: new Date(),
    updated_at: new Date(),
  };

  if (!pool) {
    memoryOrders.set(fullOrder.nano_id, fullOrder);
    memoryOrders.set(fullOrder.id, fullOrder);
    return fullOrder;
  }

  const sql = `
    INSERT INTO orders (
      id, nano_id, service_type, customer_name, customer_phone,
      pickup_address, dropoff_address, pickup_lat, pickup_lng, dropoff_lat, dropoff_lng,
      distance_km, dynamic_payload, initial_estimated_price, final_price,
      predicted_duration_minutes, payment_method, payment_status, status
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10, $11,
      $12, $13, $14, $15,
      $16, $17, $18, $19
    ) RETURNING *;
  `;

  const values = [
    id,
    fullOrder.nano_id,
    fullOrder.service_type,
    fullOrder.customer_name,
    fullOrder.customer_phone,
    fullOrder.pickup_address || null,
    fullOrder.dropoff_address,
    fullOrder.pickup_lat || null,
    fullOrder.pickup_lng || null,
    fullOrder.dropoff_lat,
    fullOrder.dropoff_lng,
    fullOrder.distance_km,
    JSON.stringify(fullOrder.dynamic_payload || {}),
    fullOrder.initial_estimated_price,
    fullOrder.final_price,
    fullOrder.predicted_duration_minutes,
    fullOrder.payment_method,
    fullOrder.payment_status,
    fullOrder.status,
  ];

  const res = await query(sql, values);
  const created = res.rows[0];
  memoryOrders.set(created.nano_id, created);
  return created;
};

export const findByNanoId = async (nanoId) => {
  if (!pool) {
    return memoryOrders.get(nanoId) || null;
  }

  const sql = `SELECT * FROM orders WHERE nano_id = $1 LIMIT 1;`;
  const res = await query(sql, [nanoId]);
  if (res.rows.length === 0) {
    return memoryOrders.get(nanoId) || null;
  }
  return res.rows[0];
};

export const findById = async (id) => {
  if (!pool) {
    return memoryOrders.get(id) || null;
  }

  const sql = `SELECT * FROM orders WHERE id = $1 LIMIT 1;`;
  const res = await query(sql, [id]);
  if (res.rows.length === 0) {
    return memoryOrders.get(id) || null;
  }
  return res.rows[0];
};

export const updateOrder = async (id, updateFields) => {
  if (!pool) {
    const existing = memoryOrders.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updateFields, updated_at: new Date() };
    memoryOrders.set(id, updated);
    memoryOrders.set(updated.nano_id, updated);
    return updated;
  }

  const keys = Object.keys(updateFields);
  if (keys.length === 0) return findById(id);

  const setClause = keys.map((key, idx) => `"${key}" = $${idx + 2}`).join(', ');
  const values = [id, ...keys.map((k) => updateFields[k])];

  const sql = `UPDATE orders SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *;`;
  const res = await query(sql, values);
  if (res.rows.length > 0) {
    const updated = res.rows[0];
    memoryOrders.set(id, updated);
    memoryOrders.set(updated.nano_id, updated);
    return updated;
  }
  return null;
};


export const cancelPendingOrder = async (nanoId) => {
  if (!pool) {
    const existing = memoryOrders.get(nanoId);
    if (!existing || existing.status !== 'PENDING_REVIEW') return null;
    return updateOrder(existing.id, { status: 'CANCELLED_BY_USER' });
  }
  const res = await query(
    `UPDATE orders SET status = 'CANCELLED_BY_USER', updated_at = CURRENT_TIMESTAMP
     WHERE nano_id = $1 AND status = 'PENDING_REVIEW' RETURNING *`,
    [nanoId]
  );
  return res.rows[0] || null;
};

export const expireUnpaidOrder = async (id) => {
  if (!pool) {
    const existing = memoryOrders.get(id);
    if (!existing || existing.status !== 'AWAITING_PAYMENT' || existing.payment_status === 'PAID') return null;
    if (!existing.payment_expiry_at || new Date(existing.payment_expiry_at).getTime() > Date.now()) return null;
    return updateOrder(id, { status: 'EXPIRED' });
  }
  const res = await query(
    `UPDATE orders SET status = 'EXPIRED', updated_at = CURRENT_TIMESTAMP
     WHERE id = $1 AND status = 'AWAITING_PAYMENT' AND payment_status = 'UNPAID'
       AND payment_expiry_at IS NOT NULL AND payment_expiry_at <= CURRENT_TIMESTAMP
     RETURNING *`,
    [id]
  );
  return res.rows[0] || null;
};

export const listAllOrders = async ({ status, limit = 50, offset = 0 } = {}) => {
  if (!pool) {
    let list = Array.from(new Set(memoryOrders.values())).filter((o) => o.nano_id);
    if (status) {
      list = list.filter((o) => o.status === status);
    }
    return list.slice(offset, offset + limit);
  }

  let sql = `SELECT * FROM orders`;
  const params = [];
  if (status) {
    params.push(status);
    sql += ` WHERE status = $${params.length}`;
  }
  sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const res = await query(sql, params);
  return res.rows;
};

export default {
  insertOrder,
  findByNanoId,
  findById,
  updateOrder,
  cancelPendingOrder,
  expireUnpaidOrder,
  listAllOrders,
};
