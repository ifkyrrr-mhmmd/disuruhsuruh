import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePricing } from '../src/services/pricing.service.js';

test('Antar Barang <= 2 km menggunakan tarif dasar Rp8.000', () => {
  const result = calculatePricing({
    service_type: 'antar_barang',
    distance_km: 1.5,
    dynamic_payload: {},
  });

  assert.equal(result.base_fare, 8000);
  assert.equal(result.distance_fare, 0);
  assert.equal(result.variable_fare, 0);
  assert.equal(result.total_estimated_price, 8000);
  assert.ok(result.predicted_duration_minutes >= 10);
});

test('Antar Barang 5 km dengan berat 8 kg', () => {
  const result = calculatePricing({
    service_type: 'antar_barang',
    distance_km: 5.0,
    dynamic_payload: {
      item_weight_kg: 8,
    },
  });

  // Base: 8000
  // Jarak: (5 - 2) * 3000 = 9000
  // Variable: berat 8kg (+3000) = 3000
  // Total: 8000 + 9000 + 3000 = 20000
  assert.equal(result.base_fare, 8000);
  assert.equal(result.distance_fare, 9000);
  assert.equal(result.variable_fare, 3000);
  assert.equal(result.total_estimated_price, 20000);
});

test('Titip Beli 3 km dengan pasar tradisional dan estimasi belanja Rp40.000', () => {
  const result = calculatePricing({
    service_type: 'titip_beli',
    distance_km: 3.0,
    dynamic_payload: {
      is_traditional_market: true,
      estimated_items_cost: 40000,
    },
  });

  // Base: 10000
  // Jarak: (3 - 2) * 3000 = 3000
  // Variable: pasar tradisional (+3000) + belanjaan (+40000) = 43000
  // Total: 10000 + 3000 + 43000 = 56000
  assert.equal(result.base_fare, 10000);
  assert.equal(result.distance_fare, 3000);
  assert.equal(result.variable_fare, 43000);
  assert.equal(result.total_estimated_price, 56000);
});

test('Bersih Rumah 2 jam dengan paket Deep Clean', () => {
  const result = calculatePricing({
    service_type: 'bersih_rumah',
    distance_km: 4.0,
    dynamic_payload: {
      duration_hours: 2,
      cleaning_intensity: 'deep_clean',
    },
  });

  // Base: 15000 (Transport basecamp)
  // Durasi: 2 jam * 30000 = 60000
  // Variable: deep_clean (+25000) = 25000
  // Total: 15000 + 60000 + 25000 = 100000
  assert.equal(result.base_fare, 15000);
  assert.equal(result.distance_fare, 60000);
  assert.equal(result.variable_fare, 25000);
  assert.equal(result.total_estimated_price, 100000);
  assert.equal(result.predicted_duration_minutes, 120);
});


test('Bersih Rumah dengan intensitas standar mengenakan tambahan Rp10.000 sesuai pilihan UI', () => {
  const result = calculatePricing({
    service_type: 'bersih_rumah',
    distance_km: 4,
    dynamic_payload: { duration_hours: 2, cleaning_intensity: 'standar' },
  });
  assert.equal(result.variable_fare, 10000);
  assert.equal(result.total_estimated_price, 85000);
});
