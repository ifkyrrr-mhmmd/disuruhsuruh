import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import { useOrder } from '../../context/OrderContext';
import {
  SAMARINDA_CENTER,
  BASECAMP_SAMARINDA,
  SAMARINDA_PRESETS,
  isInsideSamarindaGeofence,
} from '../../utils/geo';
import { getRouteDetails } from '../../services/osrm.service';
import { reverseGeocode, searchLocationsInSamarinda } from '../../services/geocoding.service';
import { AlertTriangle, Search, Loader2, MapPin, X, Navigation } from 'lucide-react';

// Custom Marker Icons
const createColorIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="background-color: ${color}; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; border: 2.5px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);">
        ${label}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const iconA = createColorIcon('#047857', 'A'); // Green for Pickup / Toko / Basecamp
const iconB = createColorIcon('#EA580C', 'B'); // Sunset Orange for Destination / Rumah

// Map Event Listener for Click Placement
function MapClickHandler({ onSetPin }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onSetPin(lat, lng);
    },
  });
  return null;
}

// Auto Fit Viewport when Pins change
function BoundsAdjuster({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (
      coords &&
      coords.length >= 2 &&
      coords.every((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]))
    ) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [coords, map]);
  return null;
}

// Smooth fly to searched / selected position
function MapFlyController({ targetCoords }) {
  const map = useMap();
  useEffect(() => {
    if (targetCoords && Number.isFinite(targetCoords.lat) && Number.isFinite(targetCoords.lng)) {
      map.flyTo([targetCoords.lat, targetCoords.lng], 15, { duration: 1 });
    }
  }, [targetCoords, map]);
  return null;
}

// Controller for Ctrl + Scroll Zoom Mechanic (Gesture Handling)
function MapScrollZoomController({ onShowHint }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 1 : -1;
        map.setZoom(map.getZoom() + delta);
      } else {
        onShowHint();
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [map, onShowHint]);

  return null;
}

export default function LeafletMap() {
  const { serviceType, locations, setLocations, setStep } = useOrder();
  const [activePinTarget, setActivePinTarget] = useState(
    serviceType === 'bersih_rumah' ? 'dropoff' : 'pickup'
  );
  const [geofenceWarning, setGeofenceWarning] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isRouteFallback, setIsRouteFallback] = useState(false);
  const [flyCoords, setFlyCoords] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [showCtrlHint, setShowCtrlHint] = useState(false);
  const hintTimeoutRef = useRef(null);

  const triggerCtrlHint = () => {
    setShowCtrlHint(true);
    if (hintTimeoutRef.current) clearTimeout(hintTimeoutRef.current);
    hintTimeoutRef.current = setTimeout(() => {
      setShowCtrlHint(false);
    }, 1400);
  };

  // Search autocomplete states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  const boundsCoords = useMemo(
    () =>
      locations.pickupCoords && locations.dropoffCoords
        ? [
            [locations.pickupCoords.lat, locations.pickupCoords.lng],
            [locations.dropoffCoords.lat, locations.dropoffCoords.lng],
          ]
        : [],
    [locations.pickupCoords, locations.dropoffCoords]
  );

  const isCleaningService = serviceType === 'bersih_rumah';

  // Inisialisasi posisi awal jika belum ada
  useEffect(() => {
    if (isCleaningService) {
      // Pin A dikunci di Basecamp Samarinda
      setLocations((prev) => ({
        ...prev,
        pickupAddress: BASECAMP_SAMARINDA.address,
        pickupCoords: { lat: BASECAMP_SAMARINDA.lat, lng: BASECAMP_SAMARINDA.lng },
      }));
    }
  }, [isCleaningService]);

  // Hitung rute otomatis saat titik berubah
  useEffect(() => {
    let isCancelled = false;

    async function calculate() {
      if (!locations.pickupCoords || !locations.dropoffCoords) {
        setIsRouteFallback(false);
        setIsCalculatingRoute(false);
        return;
      }

      setIsCalculatingRoute(true);
      const res = await getRouteDetails(locations.pickupCoords, locations.dropoffCoords);

      if (!isCancelled) {
        setLocations((prev) => ({
          ...prev,
          distanceKm: res.distanceKm,
          routeCoords: res.coordinates,
          routeIsFallback: res.isFallback,
        }));
        setIsRouteFallback(res.isFallback);
        setIsCalculatingRoute(false);
      }
    }

    calculate();
    return () => {
      isCancelled = true;
    };
  }, [locations.pickupCoords, locations.dropoffCoords]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search query
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 3) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchLocationsInSamarinda(q);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchDropdown(true);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMapClick = async (lat, lng, presetName = null) => {
    const check = isInsideSamarindaGeofence(lat, lng);
    if (!check.isInside) {
      setGeofenceWarning(
        `Lokasi berada di luar radius operasional Samarinda (${check.distanceFromCenterKm} km dari pusat kota, maksimal 25 km).`
      );
      return;
    }
    setGeofenceWarning(null);

    const isPickup = activePinTarget === 'pickup' && !isCleaningService;
    const targetKey = isPickup ? 'pickup' : 'dropoff';
    const coordsKey = `${targetKey}Coords`;
    const addressKey = `${targetKey}Address`;

    // Pasang titik koordinat dulu
    setLocations((prev) => ({
      ...prev,
      [coordsKey]: { lat, lng },
      [addressKey]: presetName || prev[addressKey] || 'Mencari nama jalan...',
      routeCoords: [],
      distanceKm: 0,
      routeIsFallback: false,
    }));

    // Auto-switch pin target for convenience
    if (isPickup) {
      setActivePinTarget('dropoff');
    }

    // Jika belum ada nama lokasi preset, lakukan reverse geocoding untuk nama jalan nyata
    if (!presetName) {
      setIsGeocoding(true);
      const realAddress = await reverseGeocode(lat, lng);
      setIsGeocoding(false);
      if (realAddress) {
        setLocations((prev) => ({
          ...prev,
          [addressKey]: realAddress,
        }));
      }
    }
  };

  const applyPreset = (preset) => {
    setFlyCoords({ lat: preset.lat, lng: preset.lng });
    handleMapClick(preset.lat, preset.lng, preset.name);
  };

  const handleSelectSearchResult = (item) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    setFlyCoords({ lat: item.lat, lng: item.lng });
    handleMapClick(item.lat, item.lng, item.name);
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="text-left">
        <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
          Tentukan Lokasi di Peta
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isCleaningService
            ? 'Mitra kami akan berangkat dari Basecamp. Silakan tandai lokasi rumah/kos Anda (Pin B).'
            : 'Pilih pin target lalu klik di peta atau cari nama jalan di Samarinda.'}
        </p>
      </div>

      {/* Target Selector Buttons */}
      {!isCleaningService ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActivePinTarget('pickup')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
              activePinTarget === 'pickup'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white text-emerald-700 flex items-center justify-center text-[10px] font-black">
              A
            </span>
            <span>Atur Titik Jemput</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePinTarget('dropoff')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition ${
              activePinTarget === 'dropoff'
                ? 'bg-brand-600 text-white border-brand-700 shadow'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white text-brand-600 flex items-center justify-center text-[10px] font-black">
              B
            </span>
            <span>Atur Titik Antar</span>
          </button>
        </div>
      ) : (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2.5 text-xs text-purple-900">
          <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px] font-black shrink-0">
            B
          </span>
          <span>
            <strong>Layanan Bersih-bersih:</strong> Cukup klik 1 titik lokasi rumah/kos Anda di peta. Mitra kami berangkat langsung dari <strong>Kantor disuruhsuruh Samarinda</strong> (Pin A terkunci).
          </span>
        </div>
      )}

      {/* Samarinda Address Search Box */}
      <div ref={searchContainerRef} className="relative z-30">
        <div className="relative">
          <input
            type="text"
            placeholder={
              isCleaningService
                ? 'Cari nama jalan / tempat rumah atau kos di Samarinda...'
                : `Cari nama jalan / tempat di Samarinda untuk Titik ${
                    activePinTarget === 'pickup' ? 'A (Jemput)' : 'B (Antar)'
                  }...`
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setShowSearchDropdown(true)}
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl py-2.5 pl-9 pr-9 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-400 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-brand-600 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
          ) : searchQuery ? (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-charcoal-900"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : null}
        </div>

        {/* Autocomplete Suggestions Dropdown */}
        {showSearchDropdown && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
            {searchResults.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => handleSelectSearchResult(item)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-brand-50 flex items-start gap-2.5 text-xs transition"
              >
                <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-charcoal-900 truncate">{item.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.fullAddress}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Samarinda Location Quick Presets */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Preset Lokasi Populer Samarinda:
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {SAMARINDA_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="whitespace-nowrap text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 shrink-0 transition"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Geofence Alert Warning */}
      {geofenceWarning && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{geofenceWarning}</span>
        </div>
      )}

      {/* The Leaflet Map Canvas */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[320px] sm:h-[400px]">
        {/* Active Pin Target Floating Hint */}
        <div className="absolute top-3 left-3 z-[1000] bg-charcoal-900/90 text-white backdrop-blur px-3 py-1.5 rounded-xl shadow text-[11px] font-bold flex items-center gap-2 pointer-events-none">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              activePinTarget === 'pickup' && !isCleaningService ? 'bg-emerald-400' : 'bg-brand-400'
            } animate-ping`}
          />
          <span>
            {activePinTarget === 'pickup' && !isCleaningService
              ? 'Klik peta untuk pasang Pin A (Jemput)'
              : 'Klik peta untuk pasang Pin B (Antar)'}
          </span>
        </div>

        <MapContainer
          center={[SAMARINDA_CENTER.lat, SAMARINDA_CENTER.lng]}
          zoom={13}
          scrollWheelZoom={false}
          className="w-full h-full pin-drop-mode"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onSetPin={handleMapClick} />

          {/* Marker A: Pickup */}
          {locations.pickupCoords && (
            <Marker
              position={[locations.pickupCoords.lat, locations.pickupCoords.lng]}
              icon={iconA}
            />
          )}

          {/* Marker B: Dropoff */}
          {locations.dropoffCoords && (
            <Marker
              position={[locations.dropoffCoords.lat, locations.dropoffCoords.lng]}
              icon={iconB}
            />
          )}

          {/* Blue Polyline Route */}
          {locations.routeCoords && locations.routeCoords.length > 0 && (
            <Polyline
              positions={locations.routeCoords}
              color="#2563EB"
              weight={5}
              opacity={0.8}
            />
          )}

          <BoundsAdjuster coords={boundsCoords} />
          <MapFlyController targetCoords={flyCoords} />
          <MapScrollZoomController onShowHint={triggerCtrlHint} />
        </MapContainer>

        {/* Overlay Guide for Ctrl + Scroll */}
        {showCtrlHint && (
          <div className="absolute inset-0 z-[1002] bg-black/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none transition-all duration-150 animate-fadeIn">
            <div className="bg-charcoal-900/95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700">
              <kbd className="bg-slate-700 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-600 shadow-sm text-brand-400">
                Ctrl
              </kbd>
              <span>+ Scroll mouse untuk memperbesar / memperkecil peta</span>
            </div>
          </div>
        )}

        {/* Floating Route Info Badge */}
        <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur shadow-md border border-slate-200 rounded-xl px-3.5 py-2 text-xs flex items-center gap-3">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">
              Jarak Rute
            </span>
            <span className="font-extrabold text-charcoal-900 text-sm">
              {isCalculatingRoute
                ? 'Menghitung...'
                : locations.pickupCoords && locations.dropoffCoords
                ? `${locations.distanceKm} km`
                : 'Pilih titik peta'}
            </span>
          </div>
          {isRouteFallback && (
            <span
              className="text-[10px] text-amber-700"
              title="Layanan rute tidak tersedia, jarak menggunakan estimasi garis lurus"
            >
              Estimasi
            </span>
          )}
          <div className="w-px h-6 bg-slate-200"></div>
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">
              Operasional
            </span>
            <span className="font-bold text-emerald-700">Radius &le; 25 km</span>
          </div>
        </div>
      </div>

      {/* Address Form Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="pickup-address" className="block text-xs font-bold text-slate-700">
              {isCleaningService ? 'Asal Keberangkatan Mitra (Titik A):' : 'Alamat Penjemputan / Toko (Titik A):'}
            </label>
            {isCleaningService && (
              <span className="text-[10px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded">
                Terkunci (Kantor Pusat)
              </span>
            )}
          </div>
          <input
            id="pickup-address"
            type="text"
            readOnly={isCleaningService}
            disabled={isCleaningService}
            placeholder="Contoh: Jl. M. Yamin No. 10 / Mall Lembuswana"
            value={isCleaningService ? BASECAMP_SAMARINDA.address : locations.pickupAddress}
            onChange={(e) =>
              !isCleaningService &&
              setLocations((prev) => ({
                ...prev,
                pickupAddress: e.target.value,
                pickupCoords: null,
                routeCoords: [],
                distanceKm: 0,
                routeIsFallback: false,
              }))
            }
            className={`w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 ${
              isCleaningService ? 'bg-slate-100 text-slate-600 font-medium cursor-not-allowed select-none' : 'bg-white'
            }`}
          />
        </div>

        <div>
          <label htmlFor="dropoff-address" className="block text-xs font-bold text-slate-700 mb-1">
            {isCleaningService ? 'Alamat Rumah / Kos yang Dibersihkan (Titik B):' : 'Alamat Tujuan Pengantaran (Titik B):'}
          </label>
          <input
            id="dropoff-address"
            type="text"
            placeholder={
              isCleaningService
                ? 'Contoh: Jl. Pramuka 5B No. 12, Kos Melati Kamar 4'
                : 'Contoh: Jl. Pramuka 5B No. 12, Kos Melati'
            }
            value={locations.dropoffAddress}
            onChange={(e) =>
              setLocations((prev) => ({
                ...prev,
                dropoffAddress: e.target.value,
                dropoffCoords: null,
                routeCoords: [],
                distanceKm: 0,
                routeIsFallback: false,
              }))
            }
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Klik langsung pada peta, pilih preset populer, atau cari nama jalan di atas untuk mengisi titik dan nama jalan otomatis.
      </p>

      {/* Navigation Buttons */}
      <div className="pt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setStep(1);
          }}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-charcoal-900 bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-xl transition"
        >
          &larr; Ganti Layanan
        </button>

        <button
          type="button"
          onClick={() => {
            if (!locations.pickupCoords || !locations.dropoffCoords) {
              setGeofenceWarning('Pilih kembali titik penjemputan dan tujuan pada peta agar alamat dan koordinat sesuai.');
              return;
            }
            if (!locations.pickupAddress.trim() || !locations.dropoffAddress.trim()) {
              setLocations((prev) => ({
                ...prev,
                pickupAddress: prev.pickupAddress || 'Lokasi sesuai titik peta',
                dropoffAddress: prev.dropoffAddress || 'Lokasi sesuai titik peta',
              }));
            }
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            setStep(3);
          }}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow transition active:scale-95"
        >
          <span>Lanjut ke Rincian & Konfirmasi</span>
          <span>&rarr;</span>
        </button>
      </div>
    </div>
  );
}
