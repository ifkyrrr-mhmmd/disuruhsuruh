process.env.NODE_ENV = 'test';
process.env.PAYMENT_MOCK_ENABLED = 'true';
process.env.MIDTRANS_SERVER_KEY = 'SB-Mid-server-xxxx';
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';
import { generateDynamicQRIS, verifyMidtransSignature } from '../src/adapters/midtrans.adapter.js';
import { insertOrder, findByNanoId } from '../src/models/order.model.js';

test('Midtrans adapter mengenerate QRIS dinamis 15 menit', async () => {
  const mockOrder = {
    nano_id: 'ds_testqris',
    final_price: 25000,
  };

  const qris = await generateDynamicQRIS(mockOrder);
  assert.ok(qris.qris_qr_url);
  assert.equal(qris.is_mock, true);
  assert.ok(qris.payment_expiry_at);

  const expiry = new Date(qris.payment_expiry_at).getTime();
  const now = Date.now();
  // Selisih sekitar 14 - 15 menit (antara 13*60*1000 dan 16*60*1000)
  assert.ok(expiry - now > 13 * 60 * 1000);
});

test('Verifikasi SHA512 signature Midtrans', () => {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const order_id = 'ds_123456';
  const status_code = '200';
  const gross_amount = '25000.00';

  const raw = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const validSignature = crypto.createHash('sha512').update(raw).digest('hex');

  const isValid = verifyMidtransSignature({
    order_id,
    status_code,
    gross_amount,
    signature_key: validSignature,
  });

  assert.equal(isValid, true);

  const isInvalid = verifyMidtransSignature({
    order_id,
    status_code,
    gross_amount,
    signature_key: 'invalidsignature12345',
  });

  assert.equal(isInvalid, false);
});
