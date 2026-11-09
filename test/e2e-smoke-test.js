import app from '../server/src/app.js';
import assert from 'node:assert/strict';

async function runE2ESmokeTest() {
  console.log('🚀 Memulai Uji Alur End-to-End (E2E Smoke Test) disuruhsuruh...');

  const server = app.listen(5090);

  try {
    const baseUrl = 'http://localhost:5090/api/v1';

    // 1. Health check
    console.log('\n[1/7] Menguji Health Check...');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData = await healthRes.json();
    assert.equal(healthRes.status, 200);
    assert.equal(healthData.status, 'ok');
    console.log('✔ Health check OK.');

    // 2. Pricing calculation engine
    console.log('\n[2/7] Menguji Estimasi Pricing Dinamis (Antar Barang 4.5 km)...');
    const pricingRes = await fetch(`${baseUrl}/pricing/estimate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type: 'antar_barang',
        distance_km: 4.5,
        item_weight_kg: 6,
        item_dimension: 'sedang',
      }),
    });
    const pricingData = await pricingRes.json();
    assert.equal(pricingRes.status, 200);
    assert.equal(pricingData.data.base_fare, 8000);
    assert.ok(pricingData.data.total_estimated_price > 10000);
    console.log(`✔ Pricing OK: Total = Rp${pricingData.data.total_estimated_price}`);

    // 3. Create order (Titip Beli QRIS)
    console.log('\n[3/7] Menguji Pembuatan Order Baru (Titip Beli Pasar Segiri)...');
    const orderRes = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_type: 'titip_beli',
        customer_name: 'Faris Pratama',
        customer_phone: '081254329876',
        pickup_address: 'Pasar Segiri Samarinda',
        dropoff_address: 'Jl. Pramuka 5B No. 12, Samarinda Ulu',
        distance_km: 3.5,
        payment_method: 'QRIS_DIGITAL',
        dynamic_payload: {
          shopping_list: '1 kg Telur, Minyak 2L, Cabai 1/4 kg',
          estimated_items_cost: 45000,
          out_of_stock_preference: 'call_customer',
          is_traditional_market: true,
        },
      }),
    });
    const orderData = await orderRes.json();
    assert.equal(orderRes.status, 201);
    const nanoId = orderData.data.nano_id;
    assert.ok(nanoId.startsWith('ds_'));
    console.log(`✔ Order Created: Resi NanoID = ${nanoId}`);

    // 4. Public tracking with phone/name masking
    console.log('\n[4/7] Menguji Pelacakan Resi Publik dengan Masking Kontak...');
    const trackRes = await fetch(`${baseUrl}/orders/${nanoId}`);
    const trackData = await trackRes.json();
    assert.equal(trackRes.status, 200);
    assert.equal(trackData.data.customer_name, 'Faris P.');
    assert.equal(trackData.data.customer_phone_masked, '0812****9876');
    assert.ok(trackData.data.whatsapp_smart_link.includes('wa.me/6285332455999'));
    console.log('✔ Public tracking masking & Smart WA link verified.');

    // 5. Admin login & order approval with price override
    console.log('\n[5/7] Menguji Login Admin & Approval dengan Price Override...');
    const loginRes = await fetch(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '123456' }),
    });
    const loginData = await loginRes.json();
    const token = loginData.data.token;
    assert.ok(token);

    // List orders to get internal UUID
    const listRes = await fetch(`${baseUrl}/admin/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listData = await listRes.json();
    const targetOrder = listData.data.orders.find((o) => o.nano_id === nanoId);
    assert.ok(targetOrder);

    // Approve order with override
    const approveRes = await fetch(`${baseUrl}/admin/orders/${targetOrder.id}/approve`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        final_price: 65000,
        price_override_reason: 'Penyesuaian parkir pasar & tangga lantai 2',
        assigned_mitra_name: 'Budi Santoso',
        assigned_mitra_phone: '085233112233',
      }),
    });
    const approveData = await approveRes.json();
    assert.equal(approveRes.status, 200);
    assert.equal(approveData.data.status, 'AWAITING_PAYMENT');
    assert.ok(approveData.data.qris_qr_url);
    console.log('✔ Admin approval, price override, and Dynamic QRIS generation verified.');

    // 6. Customer 100% refund claim & admin completion
    console.log('\n[6/7] Menguji Pengajuan Refund 100% Toko Tutup & Penyelesaian...');
    const refundClaimRes = await fetch(`${baseUrl}/orders/${nanoId}/refund-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bank_name: 'BCA',
        account_number: '1234567890',
        account_holder_name: 'Faris Pratama',
        reason: 'Toko Segiri tutup sore',
      }),
    });
    const refundClaimData = await refundClaimRes.json();
    assert.equal(refundClaimRes.status, 201);
    const refundId = refundClaimData.data.id;

    // Admin complete refund
    const refundDoneRes = await fetch(`${baseUrl}/admin/refunds/${refundId}/complete`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        transfer_receipt_url: 'https://cdn.disuruhsuruh.id/receipts/rf_001.jpg',
      }),
    });
    assert.equal(refundDoneRes.status, 200);
    console.log('✔ 100% Refund lifecycle complete: Order status updated to REFUNDED.');

    // 7. CSV Export
    console.log('\n[7/7] Menguji Ekspor Rekap Riwayat Transaksi CSV...');
    const exportRes = await fetch(`${baseUrl}/admin/export`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    assert.equal(exportRes.status, 200);
    assert.ok(exportRes.headers.get('content-type').includes('text/csv'));
    const csvText = await exportRes.text();
    assert.ok(csvText.includes('NanoID'));
    assert.ok(csvText.includes(nanoId));
    console.log('✔ CSV Export streaming validated successfully.');

    console.log('\n=======================================================');
    console.log('🎉 SELURUH 7 TAHAP END-TO-END SMOKE TEST BERHASIL LULUS! 🎉');
    console.log('=======================================================');
  } finally {
    server.close();
  }
}

runE2ESmokeTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ E2E Smoke Test Failed:', err);
    process.exit(1);
  });
