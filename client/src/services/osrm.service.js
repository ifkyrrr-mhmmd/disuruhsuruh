import axios from 'axios';
import api from '../lib/api';
import { haversineDistance } from '../utils/geo';

const PUBLIC_ROUTING_ENDPOINTS = [
  'https://routing.openstreetmap.de/routed-car/route/v1/driving',
  'https://router.project-osrm.org/route/v1/driving',
];

/**
 * Service pemanggil API rute OSRM publik dengan multi-mirror failover & backend proxy
 */
export async function getRouteDetails(pickup, dropoff) {
  if (!pickup || !dropoff) {
    return {
      distanceKm: 0,
      durationMinutes: 0,
      coordinates: [],
      isFallback: false,
    };
  }

  const pLng = pickup.lng;
  const pLat = pickup.lat;
  const dLng = dropoff.lng;
  const dLat = dropoff.lat;

  // 1. Coba mirror OSRM publik (OpenStreetMap Germany & Project-OSRM)
  for (const base of PUBLIC_ROUTING_ENDPOINTS) {
    try {
      const url = `${base}/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;
      const response = await axios.get(url, { timeout: 4500 });

      if (response.data?.routes?.[0]) {
        const route = response.data.routes[0];
        const rawDistance = route.distance / 1000;
        const distanceKm = Math.round(rawDistance * 10) / 10;
        const durationMinutes = Math.round(route.duration / 60);

        // Ubah [lng, lat] OSRM menjadi [lat, lng] Leaflet
        const coordinates = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        return {
          distanceKm: Math.max(0.5, distanceKm),
          durationMinutes: Math.max(5, durationMinutes),
          coordinates,
          isFallback: false,
        };
      }
    } catch {
      // Coba mirror berikutnya
    }
  }

  // 2. Coba backend server proxy bila akses browser ke mirror OSRM publik terblokir/timeout
  try {
    const res = await api.get('/pricing/route', {
      params: { pLng, pLat, dLng, dLat },
      timeout: 5000,
    });
    if (res.data?.data && Array.isArray(res.data.data.coordinates) && !res.data.data.isFallback) {
      return res.data.data;
    }
  } catch {
    // Lanjut ke fallback heuristik
  }

  // 3. Heuristic Fallback jika semua mirror OSRM & backend proxy tidak merespon:
  // Jarak lurus bumi * faktor belokan jalan raya Samarinda (1.35x)
  const straightDist = haversineDistance(pLat, pLng, dLat, dLng);
  const estimatedRoadDist = Math.round(straightDist * 1.35 * 10) / 10;
  const estimatedMin = Math.round(estimatedRoadDist * 2.4 + 10);

  return {
    distanceKm: Math.max(1.0, estimatedRoadDist),
    durationMinutes: Math.max(10, estimatedMin),
    coordinates: [
      [pLat, pLng],
      [dLat, dLng],
    ],
    isFallback: true,
  };
}

export default { getRouteDetails };
