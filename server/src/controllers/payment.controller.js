import { verifyMidtransSignature } from '../adapters/midtrans.adapter.js';
import { findByNanoId, updateOrder } from '../models/order.model.js';

export const handleMidtransNotification = async (req, res, next) => {
  try {
    const notification = req.body;
    const { order_id, transaction_status, fraud_status, transaction_id, gross_amount } = notification;
    if (!order_id) return res.status(400).json({ status: 'fail', message: 'Parameter order_id wajib disertakan' });

    const order = await findByNanoId(order_id);
    if (!order) return res.status(404).json({ status: 'fail', message: `Order ${order_id} tidak ditemukan` });
    if (order.payment_method !== 'QRIS_DIGITAL') {
      return res.status(409).json({ status: 'fail', message: 'Notifikasi QRIS tidak cocok dengan metode pembayaran pesanan.' });
    }

    const mockAllowed = process.env.PAYMENT_MOCK_ENABLED === 'true'
      && process.env.NODE_ENV !== 'production'
      && notification.is_test_mock === true;
    if (!mockAllowed && !verifyMidtransSignature(notification)) {
      return res.status(403).json({ status: 'fail', message: 'Signature Midtrans tidak valid' });
    }

    const expectedAmount = Number(order.final_price);
    const notifiedAmount = Number(gross_amount);
    if (!Number.isFinite(notifiedAmount) || Math.round(notifiedAmount) !== Math.round(expectedAmount)) {
      return res.status(409).json({ status: 'fail', message: 'Nominal notifikasi tidak sesuai dengan nominal pesanan.' });
    }

    // Idempotent: notifikasi duplikat tidak boleh mengubah pesanan yang sudah dibayar.
    if (order.payment_status === 'PAID') {
      return res.status(200).json({ status: 'success', message: 'Pembayaran sudah tercatat sebelumnya.', data: { order_id, order_status: order.status, payment_status: order.payment_status } });
    }

    const closedStatuses = ['EXPIRED', 'CANCELLED_BY_USER', 'CANCELLED_BY_ADMIN', 'REFUNDED'];
    if (closedStatuses.includes(order.status)) {
      const isActuallyPaid = (transaction_status === 'capture' && fraud_status === 'accept') || transaction_status === 'settlement';
      if (isActuallyPaid && order.status !== 'REFUNDED') {
        await updateOrder(order.id, {
          payment_status: 'PAID',
          payment_transaction_id: transaction_id || order.payment_transaction_id,
        });
        return res.status(200).json({ status: 'success', message: 'Pembayaran diterima setelah pesanan ditutup. Pesanan tidak dibuka kembali dan perlu verifikasi admin.' });
      }
      return res.status(200).json({ status: 'success', message: 'Notifikasi diabaikan karena pesanan sudah ditutup.' });
    }

    let nextOrderStatus = order.status;
    let nextPaymentStatus = order.payment_status;
    if (transaction_status === 'capture' && fraud_status === 'accept' || transaction_status === 'settlement') {
      nextOrderStatus = order.assigned_mitra_name ? 'MITRA_ASSIGNED' : 'CONFIRMED';
      nextPaymentStatus = 'PAID';
    } else if (transaction_status === 'expire') {
      nextOrderStatus = 'EXPIRED';
      nextPaymentStatus = 'UNPAID';
    } else if (transaction_status === 'cancel' || transaction_status === 'deny') {
      nextOrderStatus = 'CANCELLED_BY_ADMIN';
      nextPaymentStatus = 'UNPAID';
    } else if (transaction_status === 'pending') {
      nextOrderStatus = 'AWAITING_PAYMENT';
      nextPaymentStatus = 'UNPAID';
    } else {
      return res.status(200).json({ status: 'success', message: 'Status notifikasi tidak memerlukan perubahan.' });
    }

    await updateOrder(order.id, {
      status: nextOrderStatus,
      payment_status: nextPaymentStatus,
      payment_transaction_id: transaction_id || order.payment_transaction_id,
    });

    return res.status(200).json({ status: 'success', message: 'Notifikasi pembayaran berhasil diproses', data: { order_id, order_status: nextOrderStatus, payment_status: nextPaymentStatus } });
  } catch (error) {
    return next(error);
  }
};

export default { handleMidtransNotification };
