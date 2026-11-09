import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../lib/api';
import { BASECAMP_SAMARINDA } from '../utils/geo';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'antar_barang';

  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState(initialService);

  // Default coordinate: Samarinda (-0.502179, 117.153709)
  const [locations, setLocations] = useState({
    pickupAddress: '',
    pickupCoords: null,
    dropoffAddress: '',
    dropoffCoords: null,
    distanceKm: 0,
    routeCoords: [],
  });

  const [dynamicPayload, setDynamicPayload] = useState({
    // Antar Barang
    item_weight_kg: 2,
    item_notes: '',
    // Titip Beli
    shopping_list: '',
    estimated_items_cost: 0,
    out_of_stock_preference: 'call_customer',
    is_traditional_market: false,
    additional_stores_count: 0,
    // Bersih-bersih
    property_type: 'kos',
    cleaning_intensity: 'standar',
    duration_hours: 2,
    cleaner_gender_preference: 'wanita',
    cleaning_areas: ['kamar_tidur', 'kamar_mandi'],
    equipment_preference: 'mitra_bawa',
    cleaning_notes: '',
  });

  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_phone: '',
    payment_method: 'COD',
  });

  const [pricing, setPricing] = useState({
    base_fare: 0,
    distance_fare: 0,
    variable_fare: 0,
    total_estimated_price: null,
    predicted_duration_minutes: null,
    breakdown: [],
    loading: true,
    error: null,
  });

  // Sinkronisasi jika query param berubah
  useEffect(() => {
    const qService = searchParams.get('service');
    if (qService && ['antar_barang', 'titip_beli', 'bersih_rumah'].includes(qService)) {
      setServiceType(qService);
    }
  }, [searchParams]);

  // Kunci otomatis titik keberangkatan ke Kantor disuruhsuruh jika layanan bersih-bersih dipilih
  useEffect(() => {
    if (serviceType === 'bersih_rumah') {
      setLocations((prev) => ({
        ...prev,
        pickupAddress: BASECAMP_SAMARINDA.address,
        pickupCoords: { lat: BASECAMP_SAMARINDA.lat, lng: BASECAMP_SAMARINDA.lng },
      }));
    }
  }, [serviceType]);

  // Helper untuk membersihkan dynamic payload sesuai jenis layanan
  const getSanitizedPayload = (type, raw) => {
    if (type === 'antar_barang') {
      return {
        item_weight_kg: Number(raw.item_weight_kg) || 2,
        item_notes: raw.item_notes ? String(raw.item_notes).trim() : '',
      };
    }
    if (type === 'titip_beli') {
      return {
        shopping_list: raw.shopping_list ? String(raw.shopping_list).trim() : '',
        estimated_items_cost: Number(raw.estimated_items_cost) || 0,
        out_of_stock_preference: raw.out_of_stock_preference || 'call_customer',
        is_traditional_market: Boolean(raw.is_traditional_market),
        additional_stores_count: Number(raw.additional_stores_count) || 0,
      };
    }
    if (type === 'bersih_rumah') {
      return {
        property_type: raw.property_type || 'kos',
        cleaning_intensity: raw.cleaning_intensity || 'standar',
        duration_hours: Number(raw.duration_hours) || 2,
        cleaner_gender_preference: raw.cleaner_gender_preference || 'bebas',
        cleaning_areas: Array.isArray(raw.cleaning_areas) ? raw.cleaning_areas : [],
        equipment_preference: raw.equipment_preference || 'mitra_bawa',
        cleaning_notes: raw.cleaning_notes ? String(raw.cleaning_notes).trim() : '',
      };
    }
    return raw;
  };

  // Kalkulasi pricing otomatis saat parameter kunci berubah
  const refreshPricing = async () => {
    try {
      setPricing((prev) => ({ ...prev, loading: true, error: null }));
      const cleanPayload = getSanitizedPayload(serviceType, dynamicPayload);
      const res = await api.post('/pricing/estimate', {
        service_type: serviceType,
        distance_km: locations.distanceKm,
        ...(locations.pickupCoords ? { pickup_coords: locations.pickupCoords } : {}),
        ...(locations.dropoffCoords ? { dropoff_coords: locations.dropoffCoords } : {}),
        distance_is_fallback: Boolean(locations.routeIsFallback),
        dynamic_payload: cleanPayload,
      });

      if (res.data?.data) {
        setPricing({
          ...res.data.data,
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      console.warn('[PRICING ESTIMATE ERROR]', err.message);
      setPricing((prev) => ({ ...prev, loading: false, error: err.message }));
    }
  };

  useEffect(() => {
    refreshPricing();
  }, [serviceType, locations.distanceKm, dynamicPayload]);

  const value = {
    step,
    setStep,
    serviceType,
    setServiceType,
    locations,
    setLocations,
    dynamicPayload,
    setDynamicPayload,
    customerInfo,
    setCustomerInfo,
    pricing,
    refreshPricing,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder must be used within an OrderProvider');
  return ctx;
};

export default { OrderProvider, useOrder };
