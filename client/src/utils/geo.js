/**
 * Utilitas geospasial Kota Samarinda & kalkulator Geofencing 25 km
 */

export const SAMARINDA_CENTER = {
  lat: -0.502179,
  lng: 117.153709,
};

export const BASECAMP_SAMARINDA = {
  name: 'Kantor disuruhsuruh Samarinda',
  address: 'Kantor disuruhsuruh, Blok D, Karang Asam Ilir, Sungai Kunjang, Samarinda',
  lat: -0.513781,
  lng: 117.1095202,
};

export const SAMARINDA_PRESETS = [
  { name: 'Mall Lembuswana', lat: -0.4948, lng: 117.1492 },
  { name: 'Pasar Segiri', lat: -0.4902, lng: 117.1422 },
  { name: 'Kampus Unmul Gn. Kelua', lat: -0.4721, lng: 117.1611 },
  { name: 'Big Mall Samarinda', lat: -0.5218, lng: 117.1219 },
  { name: 'Samarinda Seberang (Bung Tomo)', lat: -0.5312, lng: 117.1405 },
  { name: 'Palaran', lat: -0.5601, lng: 117.1722 },
];

/**
 * Menghitung jarak garis lurus bumi (Haversine formula) dalam kilometer
 */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius bumi dalam km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Validasi radius operasional geofencing Samarinda (Maks. 25 km)
 */
export function isInsideSamarindaGeofence(lat, lng, maxRadiusKm = 25) {
  const distFromCenter = haversineDistance(
    SAMARINDA_CENTER.lat,
    SAMARINDA_CENTER.lng,
    lat,
    lng
  );
  return {
    isInside: distFromCenter <= maxRadiusKm,
    distanceFromCenterKm: Math.round(distFromCenter * 10) / 10,
  };
}

export default {
  SAMARINDA_CENTER,
  BASECAMP_SAMARINDA,
  SAMARINDA_PRESETS,
  haversineDistance,
  isInsideSamarindaGeofence,
};
