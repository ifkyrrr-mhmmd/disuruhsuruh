const SAMARINDA_CENTER = { lat: -0.502179, lng: 117.153709 };

export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lon2 - lon1);
  const value = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export const isInsideSamarindaGeofence = (lat, lng, maxRadiusKm = 25) => ({
  isInside: haversineDistance(SAMARINDA_CENTER.lat, SAMARINDA_CENTER.lng, lat, lng) <= maxRadiusKm,
});
