import axios from 'axios';

const haversineKm = (a, b) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

const OSRM_ENDPOINTS = [
  'https://routing.openstreetmap.de/routed-car/route/v1/driving',
  'https://router.project-osrm.org/route/v1/driving',
];

/** Server-authoritative route distance; fallback is explicitly marked as an estimate. */
export const resolveRouteDistance = async (pickup, dropoff) => {
  const coordinates = `${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}`;

  for (const base of OSRM_ENDPOINTS) {
    try {
      const response = await axios.get(`${base}/${coordinates}`, {
        params: { overview: 'false' },
        timeout: 4500,
      });
      const route = response.data?.routes?.[0];
      if (route && Number.isFinite(route.distance)) {
        return {
          distanceKm: Math.max(0.5, Math.round((route.distance / 1000) * 10) / 10),
          isFallback: false,
        };
      }
    } catch {
      // Coba mirror berikutnya
    }
  }

  const straightDistance = haversineKm(pickup, dropoff);
  return { distanceKm: Math.max(0.5, Math.round(straightDistance * 1.35 * 10) / 10), isFallback: true };
};

/** Ambil rute lengkap (polyline coordinates) untuk Leaflet dengan multi-mirror failover */
export const fetchRouteGeometry = async (pickup, dropoff) => {
  const coordinates = `${pickup.lng},${pickup.lat};${dropoff.lng},${dropoff.lat}`;

  for (const base of OSRM_ENDPOINTS) {
    try {
      const response = await axios.get(`${base}/${coordinates}`, {
        params: { overview: 'full', geometries: 'geojson' },
        timeout: 5000,
      });
      const route = response.data?.routes?.[0];
      if (route && Number.isFinite(route.distance) && Array.isArray(route.geometry?.coordinates)) {
        const rawDistance = route.distance / 1000;
        const distanceKm = Math.round(rawDistance * 10) / 10;
        const durationMinutes = Math.round(route.duration / 60);
        // Konversi [lng, lat] OSRM ke [lat, lng] Leaflet
        const leafCoords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        return {
          distanceKm: Math.max(0.5, distanceKm),
          durationMinutes: Math.max(5, durationMinutes),
          coordinates: leafCoords,
          isFallback: false,
        };
      }
    } catch {
      // Coba mirror berikutnya
    }
  }

  // Fallback Haversine jika semua mirror OSRM gagal
  const straightDist = haversineKm(pickup, dropoff);
  const estimatedRoadDist = Math.round(straightDist * 1.35 * 10) / 10;
  return {
    distanceKm: Math.max(1.0, estimatedRoadDist),
    durationMinutes: Math.max(10, Math.round(estimatedRoadDist * 2.4 + 10)),
    coordinates: [
      [pickup.lat, pickup.lng],
      [dropoff.lat, dropoff.lng],
    ],
    isFallback: true,
  };
};

export default { resolveRouteDistance, fetchRouteGeometry };
