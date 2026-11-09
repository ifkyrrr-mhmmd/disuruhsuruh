import axios from 'axios';
import crypto from 'crypto';

export const generateDynamicQRIS = async (order) => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const mockEnabled = process.env.PAYMENT_MOCK_ENABLED === 'true' && process.env.NODE_ENV !== 'production';
  const isDummyKey = !serverKey || serverKey.includes('xxxx');

  const expiryDate = new Date(Date.now() + 15 * 60 * 1000); // 15 Menit

  if (isDummyKey) {
    if (!mockEnabled) {
      const error = new Error('MIDTRANS_NOT_CONFIGURED: Konfigurasi pembayaran QRIS belum tersedia.');
      error.statusCode = 503;
      throw error;
    }
    return {
      qris_qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://simulator.sandbox.midtrans.com/qris/${order.nano_id}`,
      payment_expiry_at: expiryDate.toISOString(),
      transaction_id: `trx_mock_${order.nano_id}`,
      is_mock: true,
    };
  }

  const authHeader = Buffer.from(`${serverKey}:`).toString('base64');
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true';
  const apiBase = isProduction ? 'https://api.midtrans.com' : 'https://api.sandbox.midtrans.com';
  const payload = {
    payment_type: 'qris',
    transaction_details: {
      order_id: order.nano_id,
      gross_amount: Math.round(Number(order.final_price)),
    },
    qris: {
      acquirer: 'gopay',
    },
    custom_expiry: {
      expiry_duration: 15,
      unit: 'minute',
    },
  };

  try {
    const res = await axios.post(
      `${apiBase}/v2/charge`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Basic ${authHeader}`,
        },
        timeout: 5000,
      }
    );

    const qrAction = res.data.actions?.find((a) => a.name === 'generate-qr-code');
    const qrUrl = qrAction?.url;
    if (!qrUrl) {
      const error = new Error('MIDTRANS_QRIS_ACTION_MISSING: Midtrans tidak mengembalikan URL QRIS.');
      error.statusCode = 502;
      throw error;
    }

    return {
      qris_qr_url: qrUrl,
      payment_expiry_at: expiryDate.toISOString(),
      transaction_id: res.data.transaction_id || `trx_${order.nano_id}`,
      is_mock: false,
    };
  } catch (err) {
    console.error('[MIDTRANS ADAPTER] QRIS charge failed:', err.message);
    throw err;
  }
};

export const verifyMidtransSignature = (notification) => {
  const { order_id, status_code, gross_amount, signature_key } = notification;
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey || !signature_key || !order_id || !status_code || gross_amount === undefined) return false;

  const rawString = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const calculatedHash = crypto.createHash('sha512').update(rawString).digest('hex');

  const expected = Buffer.from(calculatedHash, 'hex');
  const received = Buffer.from(String(signature_key), 'hex');
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
};

export default {
  generateDynamicQRIS,
  verifyMidtransSignature,
};
