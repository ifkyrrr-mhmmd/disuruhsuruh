import { customAlphabet } from 'nanoid';
import { calculatePricing } from '../services/pricing.service.js';
import { predictOrderWithFallback } from '../adapters/aiProxy.adapter.js';
import { insertOrder, findByNanoId, updateOrder, cancelPendingOrder, expireUnpaidOrder } from '../models/order.model.js';
import { maskPhone, maskName } from '../utils/masking.js';
import { isInsideSamarindaGeofence } from '../utils/geo.js';
import { resolveRouteDistance } from '../services/route.service.js';

// NanoID generator: 8 alphanumeric lowercase & numbers prefixed with 'ds_'
const generateNanoId = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 8);

export const createOrder = async (req, res, next) => {
  try {
    const {
      service_type,
      customer_name,
      customer_phone,
      pickup_address,
      dropoff_address,
      pickup_coords,
      dropoff_coords,
      pickup_lat,
      pickup_lng,
      dropoff_lat,
      dropoff_lng,
      distance_km = 0,
      payment_method = 'COD',
      dynamic_payload = {},
    } = req.body;

    // Normalisasi koordinat
    if (service_type === 'titip_beli' && !String(dynamic_payload?.shopping_list || '').trim()) {
      return res.status(400).json({ status: 'fail', message: 'Daftar barang belanjaan wajib diisi.' });
    }
    if (service_type === 'bersih_rumah' && (!dynamic_payload?.duration_hours || !dynamic_payload?.cleaning_intensity)) {
      return res.status(400).json({ status: 'fail', message: 'Durasi dan tingkat pekerjaan wajib dipilih untuk layanan Bersih-bersih.' });
    }

    const pLat = pickup_coords?.lat ?? pickup_lat ?? null;
    const pLng = pickup_coords?.lng ?? pickup_lng ?? null;
    const dLat = dropoff_coords?.lat ?? dropoff_lat ?? null;
    const dLng = dropoff_coords?.lng ?? dropoff_lng ?? null;

    // Lokasi wajib memiliki koordinat valid agar alamat, radius, dan harga tidak bisa dipisahkan.
    const coordinates = [pLat, pLng, dLat, dLng].map(Number);
    if (coordinates.some((value) => !Number.isFinite(value))) {
      return res.status(400).json({ status: 'fail', message: 'Tentukan titik penjemputan dan tujuan pada peta terlebih dahulu.' });
    }
    const [pickupLat, pickupLng, dropoffLat, dropoffLng] = coordinates;
    for (const [label, lat, lng] of [['Penjemputan', pickupLat, pickupLng], ['Tujuan', dropoffLat, dropoffLng]]) {
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180 || !isInsideSamarindaGeofence(lat, lng).isInside) {
        return res.status(400).json({ status: 'fail', message: `Lokasi ${label.toLowerCase()} berada di luar radius operasional Samarinda (maksimal 25 km).` });
      }
    }

    // Jarak dihitung ulang oleh server. Nilai distance_km dari browser tidak dipercaya untuk harga.
    const route = await resolveRouteDistance({ lat: pickupLat, lng: pickupLng }, { lat: dropoffLat, lng: dropoffLng });
    const trustedDistanceKm = route.distanceKm;
    if (trustedDistanceKm > 50) {
      return res.status(400).json({ status: 'fail', message: 'Jarak rute melebihi batas operasional 50 km.' });
    }

    // 1. Kalkulasi rincian harga via Pricing Engine
    const calculation = calculatePricing({
      service_type,
      distance_km: trustedDistanceKm,
      dynamic_payload,
    });

    const estimatedTotal = calculation.total_estimated_price;

    // 2. Rule Bisnis: Plafon COD Maksimal Rp50.000 (US-08 & PRD Section 1)
    if (payment_method === 'COD' && estimatedTotal > 50000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Pesanan dengan metode COD dibatasi maksimal Rp50.000. Untuk nominal di atas Rp50.000, silakan gunakan metode QRIS Digital.',
      });
    }

    // 3. Simpan order terlebih dahulu agar log inferensi dapat terhubung ke UUID order.
    const nanoId = `ds_${generateNanoId()}`;
    const newOrder = await insertOrder({
      nano_id: nanoId,
      service_type,
      customer_name,
      customer_phone,
      pickup_address: pickup_address || null,
      dropoff_address,
      pickup_lat: pickupLat,
      pickup_lng: pickupLng,
      dropoff_lat: dropoffLat,
      dropoff_lng: dropoffLng,
      distance_km: trustedDistanceKm,
      dynamic_payload,
      initial_estimated_price: estimatedTotal,
      final_price: estimatedTotal,
      predicted_duration_minutes: calculation.predicted_duration_minutes,
      payment_method,
      payment_status: 'UNPAID',
      status: 'PENDING_REVIEW',
    });

    // AI hanya memperkirakan durasi; harga transaksi tetap berasal dari pricing engine deterministik.
    const aiPrediction = await predictOrderWithFallback({
      service_type,
      distance_km: trustedDistanceKm,
      dynamic_payload,
    }, newOrder.id);
    let orderForResponse = newOrder;
    try {
      const updatedOrder = await updateOrder(newOrder.id, {
        predicted_duration_minutes: aiPrediction.predicted_duration_minutes,
      });
      orderForResponse = updatedOrder || newOrder;
    } catch (updateError) {
      console.error('[ORDER] Prediksi durasi tidak tersimpan; order tetap dibuat dengan estimasi dasar.', updateError.message);
    }

    res.status(201).json({
      status: 'success',
      message: 'Pesanan berhasil dibuat',
      data: {
        nano_id: newOrder.nano_id,
        tracking_url: `/track/${newOrder.nano_id}`,
        status: orderForResponse.status,
        estimated_price: orderForResponse.initial_estimated_price,
        predicted_duration_minutes: orderForResponse.predicted_duration_minutes,
        payment_method: newOrder.payment_method,
        breakdown: calculation.breakdown,
        distance_is_fallback: route.isFallback,
        is_ai_fallback: aiPrediction.is_fallback,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cancelOrderByCustomer = async (req, res, next) => {
  try {
    const { nanoId } = req.params;
    const order = await findByNanoId(nanoId);
    if (!order) return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    const updated = await cancelPendingOrder(nanoId);
    if (!updated) {
      return res.status(409).json({ status: 'fail', message: 'Pesanan hanya dapat dibatalkan mandiri sebelum dikonfirmasi admin.' });
    }
    return res.status(200).json({ status: 'success', message: 'Pesanan berhasil dibatalkan.', data: { nano_id: updated.nano_id, status: updated.status } });
  } catch (error) {
    return next(error);
  }
};

export const getOrderByNanoId = async (req, res, next) => {
  try {
    const { nanoId } = req.params;
    let order = await findByNanoId(nanoId);

    if (!order) {
      return res.status(404).json({
        status: 'fail',
        message: `Pesanan dengan resi ${nanoId} tidak ditemukan`,
      });
    }

    // Expiry is also enforced when the customer opens or refreshes the tracking page.
    if (order.status === 'AWAITING_PAYMENT' && order.payment_status !== 'PAID' && order.payment_expiry_at && new Date(order.payment_expiry_at).getTime() <= Date.now()) {
      const expiredOrder = await expireUnpaidOrder(order.id);
      order = expiredOrder || await findByNanoId(nanoId);
    }

    // Nomor resmi WhatsApp admin disuruhsuruh Samarinda
    const adminWhatsApp = '6285332455999';
    const encodedMsg = encodeURIComponent(
      `Halo Admin disuruhsuruh, saya ingin konfirmasi pesanan saya dengan kode resi [${order.nano_id}].`
    );
    const whatsapp_smart_link = `https://wa.me/${adminWhatsApp}?text=${encodedMsg}`;

    res.status(200).json({
      status: 'success',
      data: {
        nano_id: order.nano_id,
        service_type: order.service_type,
        customer_name: maskName(order.customer_name),
        customer_phone_masked: maskPhone(order.customer_phone),
        pickup_address: order.pickup_address,
        dropoff_address: order.dropoff_address,
        distance_km: Number(order.distance_km),
        status: order.status,
        final_price: Number(order.final_price),
        initial_estimated_price: Number(order.initial_estimated_price),
        predicted_duration_minutes: order.predicted_duration_minutes,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        qris_qr_url: order.qris_qr_url || null,
        payment_expiry_at: order.payment_expiry_at || null,
        assigned_mitra: order.assigned_mitra_name
          ? {
              name: order.assigned_mitra_name,
              phone: maskPhone(order.assigned_mitra_phone),
            }
          : null,
        whatsapp_smart_link,
        created_at: order.created_at,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createOrder,
  cancelOrderByCustomer,
  getOrderByNanoId,
};
