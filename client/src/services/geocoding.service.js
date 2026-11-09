/**
 * Geocoding Service untuk Kota Samarinda & Kalimantan Timur (OpenStreetMap Nominatim)
 * Menyediakan reverse geocoding (koordinat -> nama jalan) dan pencarian alamat lokal.
 */

const reverseCache = new Map();
const searchCache = new Map();

// Helper pembersih label alamat dari response Nominatim agar ringkas & natural
function formatCleanAddress(addressObj, fallbackDisplayName) {
  if (!addressObj) return fallbackDisplayName || 'Lokasi Peta Samarinda';

  const parts = [];
  const road = addressObj.road || addressObj.pedestrian || addressObj.street;
  const building = addressObj.amenity || addressObj.building || addressObj.shop || addressObj.commercial;
  const area = addressObj.neighbourhood || addressObj.suburb || addressObj.village || addressObj.city_district;
  const city = addressObj.city || addressObj.county || 'Samarinda';

  if (building) parts.push(building);
  if (road) parts.push(road);
  if (area && area !== road && area !== city) parts.push(area);
  if (city) parts.push(city);

  if (parts.length > 0) {
    return parts.join(', ');
  }

  // Fallback ke string pertama sebelum koma ketiga
  return (fallbackDisplayName || '')
    .split(',')
    .slice(0, 3)
    .map((s) => s.trim())
    .join(', ') || 'Lokasi Peta Samarinda';
}

/**
 * Reverse geocode koordinat lat, lng menjadi nama jalan / tempat di Samarinda
 */
export async function reverseGeocode(lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (reverseCache.has(cacheKey)) {
    return reverseCache.get(cacheKey);
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=18`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'id-ID,id;q=0.9',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const cleanAddress = formatCleanAddress(data.address, data.display_name);

    reverseCache.set(cacheKey, cleanAddress);
    return cleanAddress;
  } catch (err) {
    console.warn('[GEOCODE REVERSE FAIL]', err.message);
    return `Koordinat [${lat.toFixed(4)}, ${lng.toFixed(4)}]`;
  }
}

/**
 * Cari nama jalan / lokasi di Samarinda / Kaltim
 */
export async function searchLocationsInSamarinda(query) {
  const cleanQ = (query || '').trim();
  if (cleanQ.length < 3) return [];

  const cacheKey = cleanQ.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  try {
    // Bounded search sekitar area Samarinda & sekitarnya (Kaltim)
    const searchQuery = cleanQ.toLowerCase().includes('samarinda') ? cleanQ : `${cleanQ}, Samarinda`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      searchQuery
    )}&format=json&addressdetails=1&countrycodes=id&viewbox=117.05,-0.65,117.25,-0.35&limit=6`;

    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'id-ID,id;q=0.9',
      },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const items = await res.json();

    const results = items.map((item) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      return {
        id: item.place_id,
        name: formatCleanAddress(item.address, item.display_name),
        fullAddress: item.display_name,
        lat,
        lng,
      };
    });

    searchCache.set(cacheKey, results);
    return results;
  } catch (err) {
    console.warn('[GEOCODE SEARCH FAIL]', err.message);
    return [];
  }
}

export default {
  reverseGeocode,
  searchLocationsInSamarinda,
};
