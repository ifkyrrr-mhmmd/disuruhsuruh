/**
 * Pricing Calculation Engine untuk disuruhsuruh Samarinda
 * Menghitung rincian tarif transparan berdasarkan jarak, kategori layanan, dan variabel dinamis.
 */

export const calculatePricing = ({
  service_type,
  distance_km = 0,
  dynamic_payload = {},
}) => {
  const dist = Math.max(0, Number(distance_km) || 0);
  const payload = dynamic_payload || {};
  const breakdown = [];

  let base_fare = 0;
  let distance_fare = 0;
  let variable_fare = 0;
  let predicted_duration_minutes = 20;

  switch (service_type) {
    case 'antar_barang': {
      base_fare = 8000;
      breakdown.push({ label: 'Tarif Dasar Kurir (0 - 2 km)', amount: base_fare });

      if (dist > 2) {
        const extraKm = Math.ceil((dist - 2) * 10) / 10;
        distance_fare = Math.round(extraKm * 3000);
        breakdown.push({
          label: `Jarak Tambahan (${extraKm} km x Rp3.000)`,
          amount: distance_fare,
        });
      }

      // Handling bobot
      const weight = Number(payload.item_weight_kg) || 0;
      if (weight > 10) {
        variable_fare += 6000;
        breakdown.push({ label: 'Handling Beban Berat (> 10 kg)', amount: 6000 });
      } else if (weight > 5) {
        variable_fare += 3000;
        breakdown.push({ label: 'Handling Beban Sedang (5 - 10 kg)', amount: 3000 });
      }

      // Estimasi waktu: 2.4 menit/km + 10 menit penjemputan/serah terima
      predicted_duration_minutes = Math.max(15, Math.round(dist * 2.4 + 10));
      break;
    }

    case 'titip_beli': {
      base_fare = 10000;
      breakdown.push({ label: 'Jasa Belanja Dasar Toko (0 - 2 km)', amount: base_fare });

      if (dist > 2) {
        const extraKm = Math.ceil((dist - 2) * 10) / 10;
        distance_fare = Math.round(extraKm * 3000);
        breakdown.push({
          label: `Jarak Pengantaran (${extraKm} km x Rp3.000)`,
          amount: distance_fare,
        });
      }

      // Toko tambahan
      const extraStores = Math.max(0, Number(payload.additional_stores_count) || 0);
      if (extraStores > 0) {
        const extraStoreFare = extraStores * 5000;
        variable_fare += extraStoreFare;
        breakdown.push({
          label: `Toko Tambahan (${extraStores} toko x Rp5.000)`,
          amount: extraStoreFare,
        });
      }

      // Pasar tradisional (antre/parkir pasar basah Segiri/Pagi)
      if (payload.is_traditional_market) {
        variable_fare += 3000;
        breakdown.push({ label: 'Area Pasar Tradisional (Parkir & Antre)', amount: 3000 });
      }

      // Uang talangan barang belanjaan
      const itemsCost = Math.max(0, Number(payload.estimated_items_cost) || 0);
      if (itemsCost > 0) {
        variable_fare += itemsCost;
        breakdown.push({ label: 'Estimasi Biaya Talangan Belanja', amount: itemsCost });
      }

      // Estimasi waktu: 2.4 menit/km + 20 menit belanja/antre
      predicted_duration_minutes = Math.max(25, Math.round(dist * 2.4 + 20));
      break;
    }

    case 'bersih_rumah': {
      base_fare = 15000;
      breakdown.push({ label: 'Transport Mitra dari Kantor disuruhsuruh', amount: base_fare });

      const hours = Math.max(1, Number(payload.duration_hours) || 2);
      distance_fare = hours * 30000;
      breakdown.push({
        label: `Biaya Jasa Kebersihan (${hours} jam x Rp30.000)`,
        amount: distance_fare,
      });

      // Tingkat kekotoran / paket
      const intensity = payload.cleaning_intensity;
      if (intensity === 'deep_clean') {
        variable_fare += 25000;
        breakdown.push({ label: 'Paket Deep Clean (Kerak Kamar Mandi/Dapur)', amount: 25000 });
      } else if (intensity === 'standar') {
        variable_fare += 10000;
        breakdown.push({ label: 'Pembersihan Standar Menyeluruh', amount: 10000 });
      } else {
        breakdown.push({ label: 'Paket Pembersihan Rutin Ringan', amount: 0 });
      }

      predicted_duration_minutes = hours * 60;
      break;
    }

    case 'layanan_lainnya': {
      base_fare = Number(payload.custom_price) || 0;
      distance_fare = 0;
      variable_fare = 0;
      predicted_duration_minutes = 30;
      breakdown.push({
        label: 'Tarif Layanan Khusus (Kesepakatan)',
        amount: base_fare,
      });
      break;
    }

    default:
      throw new Error(`SERVICE_NOT_SUPPORTED: Layanan '${service_type}' tidak dikenali`);
  }

  const total_estimated_price = base_fare + distance_fare + variable_fare;

  return {
    service_type,
    distance_km: dist,
    base_fare,
    distance_fare,
    variable_fare,
    total_estimated_price,
    predicted_duration_minutes,
    pricing_mode: 'deterministic',
    breakdown,
  };
};

export default { calculatePricing };
