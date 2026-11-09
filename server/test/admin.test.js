process.env.REFUND_ENCRYPTION_KEY = 'a'.repeat(64);
import test from 'node:test';
import assert from 'node:assert/strict';
import { insertOrder, findById } from '../src/models/order.model.js';
import { createRefundRecord, markRefundCompleted, findRefundById, createRefundRequest, completeRefundRequest } from '../src/models/refund.model.js';

test('Alur Refund 100% dan verifikasi penyelesaian transfer', async () => {
  const order = await insertOrder({
    nano_id: 'ds_refundtest',
    service_type: 'titip_beli',
    customer_name: 'Dewi Lestari',
    customer_phone: '081234567899',
    dropoff_address: 'Jl. Juanda Samarinda',
    distance_km: 2,
    initial_estimated_price: 35000,
    final_price: 35000,
  });

  const refund = await createRefundRecord({
    order_id: order.id,
    bank_name: 'BCA',
    account_number: '1234567890',
    account_holder_name: 'Dewi Lestari',
    refund_amount: 35000,
    reason: 'Toko tutup mendadak',
  });

  assert.equal(refund.is_completed, false);
  assert.equal(refund.refund_amount, 35000);
  assert.equal(refund.account_number, '1234567890');
  const fetched = await findRefundById(refund.id);
  assert.equal(fetched.account_holder_name, 'Dewi Lestari');

  const completed = await markRefundCompleted(refund.id, 'Kak Gani', 'https://receipt.jpg');
  assert.equal(completed.is_completed, true);
  assert.equal(completed.processed_by, 'Kak Gani');
});


test('Pengajuan refund dan penyelesaian memperbarui status order secara konsisten', async () => {
  const order = await insertOrder({
    nano_id: 'ds_refundatomic',
    service_type: 'titip_beli',
    customer_name: 'Dewi Lestari',
    customer_phone: '081234567899',
    dropoff_address: 'Jl. Juanda Samarinda',
    distance_km: 2,
    initial_estimated_price: 35000,
    final_price: 35000,
    status: 'CONFIRMED',
    payment_status: 'PAID',
  });

  const refund = await createRefundRequest({
    order_id: order.id,
    bank_name: 'BCA',
    account_number: '1234567890',
    account_holder_name: 'Dewi Lestari',
    refund_amount: 35000,
    reason: 'Stok barang kosong',
  });
  assert.equal((await findById(order.id)).status, 'REFUND_REQUESTED');

  await assert.rejects(() => createRefundRequest({
    order_id: order.id,
    bank_name: 'BCA',
    account_number: '1234567890',
    account_holder_name: 'Dewi Lestari',
    refund_amount: 35000,
    reason: 'Duplikat',
  }), /sudah tercatat|tidak lagi memenuhi syarat/);

  const completed = await completeRefundRequest(refund.id, 'Admin', 'https://example.com/receipt');
  const updatedOrder = await findById(order.id);
  assert.equal(completed.is_completed, true);
  assert.equal(updatedOrder.status, 'REFUNDED');
  assert.equal(updatedOrder.payment_status, 'REFUNDED');
});

test('Pesanan COD saat diubah status menjadi COMPLETED otomatis memperbarui payment_status ke PAID', async () => {
  const { updateStatus } = await import('../src/controllers/admin.controller.js');

  const order = await insertOrder({
    nano_id: 'ds_codcomplete',
    service_type: 'antar_barang',
    customer_name: 'Achonk',
    customer_phone: '089516643936',
    dropoff_address: 'Jl. Muso Salim Samarinda',
    distance_km: 1.5,
    initial_estimated_price: 8000,
    final_price: 8000,
    payment_method: 'COD',
    payment_status: 'UNPAID',
    status: 'IN_PROGRESS',
    assigned_mitra_name: 'Ale Kurir',
    assigned_mitra_phone: '089211115137',
  });

  const req = {
    params: { id: order.id },
    body: { status: 'COMPLETED' },
  };
  let responseData = null;
  const res = {
    status: (code) => ({
      json: (data) => {
        responseData = data;
        return data;
      },
    }),
  };

  await updateStatus(req, res, (err) => { if (err) throw err; });

  assert.equal(responseData?.status, 'success');
  assert.equal(responseData?.data?.status, 'COMPLETED');
  assert.equal(responseData?.data?.payment_status, 'PAID');

  const inDb = await findById(order.id);
  assert.equal(inDb.status, 'COMPLETED');
  assert.equal(inDb.payment_status, 'PAID');
});
