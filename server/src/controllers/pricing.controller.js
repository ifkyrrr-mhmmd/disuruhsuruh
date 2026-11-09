import { calculatePricing } from '../services/pricing.service.js';
import { isInsideSamarindaGeofence } from '../utils/geo.js';
import { fetchRouteGeometry } from '../services/route.service.js';

export const getRouteGeometry = async (req, res, next) => {
  try {
    const { pLng, pLat, dLng, dLat } = req.query;
    if (!pLng || !pLat || !dLng || !dLat) {
      return res.status(400).json({ status: 'fail', message: 'Parameter koordinat tidak lengkap.' });
    }
    const result = await fetchRouteGeometry(
      { lng: Number(pLng), lat: Number(pLat) },
      { lng: Number(dLng), lat: Number(dLat) }
    );
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
};

export const estimatePricing = async (req, res, next) => {
  try {
    const {
      service_type,
      distance_km = 0,
      item_weight_kg,
      item_dimension,
      dynamic_payload = {},
    } = req.body;

    // Merge flattened fields into dynamic_payload if passed at root
    const mergedPayload = {
      ...dynamic_payload,
      ...(item_weight_kg !== undefined && { item_weight_kg }),
      ...(item_dimension !== undefined && { item_dimension }),
    };

    // Estimasi interaktif memakai jarak rute yang sudah dihitung browser agar perubahan input tidak memanggil OSRM berulang.
    // Endpoint pembuatan pesanan menghitung ulang jarak di server sebelum menetapkan harga transaksi.
    const trustedDistance = Number(distance_km) || 0;
    const distanceIsFallback = Boolean(req.body.distance_is_fallback);
    if (req.body.pickup_coords && req.body.dropoff_coords) {
      const points = [req.body.pickup_coords, req.body.dropoff_coords];
      if (points.some((point) => !isInsideSamarindaGeofence(Number(point.lat), Number(point.lng)).isInside)) {
        return res.status(400).json({ status: 'fail', message: 'Lokasi berada di luar radius operasional Samarinda (maksimal 25 km).' });
      }
    }

    const calculation = calculatePricing({
      service_type,
      distance_km: trustedDistance,
      dynamic_payload: mergedPayload,
    });

    res.status(200).json({
      status: 'success',
      data: { ...calculation, distance_is_fallback: distanceIsFallback },
    });
  } catch (error) {
    next(error);
  }
};

export default { estimatePricing, getRouteGeometry };
