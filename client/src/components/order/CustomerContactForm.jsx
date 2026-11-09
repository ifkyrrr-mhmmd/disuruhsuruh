import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import api from '../../lib/api';
import { formatRupiah } from '../../lib/utils';
import { QrCode, Banknote, AlertCircle, Loader2, Send } from 'lucide-react';

export default function CustomerContactForm() {
  const {
    serviceType,
    locations,
    dynamicPayload,
    customerInfo,
    setCustomerInfo,
    pricing,
    setStep,
  } = useOrder();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const isCodExceeded = pricing.total_estimated_price > 50000;

  // Auto switch to QRIS if COD exceeded
  const currentPayment = isCodExceeded ? 'QRIS_DIGITAL' : customerInfo.payment_method;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerInfo.customer_name?.trim()) {
      setErrorMessage('Nama lengkap wajib diisi');
      return;
    }

    const cleanPhone = customerInfo.customer_phone?.trim() || '';
    if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleanPhone)) {
      setErrorMessage('Nomor WhatsApp tidak valid (harus diawali 08 atau +628)');
      return;
    }

    if (serviceType === 'titip_beli' && !dynamicPayload.shopping_list?.trim()) {
      setErrorMessage('Daftar barang belanjaan wajib diisi');
      return;
    }

    if (!locations.dropoffAddress?.trim()) {
      setErrorMessage('Alamat tujuan pengantaran belum diisi');
      return;
    }

    try {
      setIsSubmitting(true);

      // Sanitize dynamic_payload based on active service_type
      let cleanDynamicPayload = {};
      if (serviceType === 'antar_barang') {
        cleanDynamicPayload = {
          item_weight_kg: Number(dynamicPayload.item_weight_kg) || 2,
          item_notes: dynamicPayload.item_notes ? String(dynamicPayload.item_notes).trim() : '',
        };
      } else if (serviceType === 'titip_beli') {
        cleanDynamicPayload = {
          shopping_list: dynamicPayload.shopping_list ? String(dynamicPayload.shopping_list).trim() : '',
          estimated_items_cost: Number(dynamicPayload.estimated_items_cost) || 0,
          out_of_stock_preference: dynamicPayload.out_of_stock_preference || 'call_customer',
          is_traditional_market: Boolean(dynamicPayload.is_traditional_market),
          additional_stores_count: Number(dynamicPayload.additional_stores_count) || 0,
        };
      } else if (serviceType === 'bersih_rumah') {
        cleanDynamicPayload = {
          property_type: dynamicPayload.property_type || 'kos',
          cleaning_intensity: dynamicPayload.cleaning_intensity || 'standar',
          duration_hours: Number(dynamicPayload.duration_hours) || 2,
          cleaner_gender_preference: dynamicPayload.cleaner_gender_preference || 'bebas',
          cleaning_areas: Array.isArray(dynamicPayload.cleaning_areas) ? dynamicPayload.cleaning_areas : [],
          equipment_preference: dynamicPayload.equipment_preference || 'mitra_bawa',
          cleaning_notes: dynamicPayload.cleaning_notes ? String(dynamicPayload.cleaning_notes).trim() : '',
        };
      }

      const payload = {
        service_type: serviceType,
        customer_name: customerInfo.customer_name.trim(),
        customer_phone: cleanPhone,
        pickup_address: locations.pickupAddress || null,
        dropoff_address: locations.dropoffAddress.trim(),
        pickup_coords: locations.pickupCoords,
        dropoff_coords: locations.dropoffCoords,
        distance_km: locations.distanceKm,
        payment_method: currentPayment,
        dynamic_payload: cleanDynamicPayload,
      };

      const res = await api.post('/orders', payload);
      if (res.data?.data?.nano_id) {
        navigate(`/track/${res.data.data.nano_id}`);
      }
    } catch (err) {
      console.error('[SUBMIT ORDER ERROR]', err);
      setErrorMessage(err.message || 'Gagal mengirim pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Contact Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-bold text-charcoal-900 pb-2 border-b border-slate-200">
          Data Pemesan (Tanpa Perlu Buat Akun)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="customer-name" className="block text-xs font-bold text-slate-700 mb-1">
              Nama Lengkap:
            </label>
            <input
              id="customer-name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              value={customerInfo.customer_name}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, customer_name: e.target.value }))
              }
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              required
            />
          </div>

          <div>
            <label htmlFor="customer-phone" className="block text-xs font-bold text-slate-700 mb-1">
              Nomor WhatsApp Aktif:
            </label>
            <input
              id="customer-phone"
              type="tel"
              placeholder="081234567890"
              value={customerInfo.customer_phone}
              onChange={(e) =>
                setCustomerInfo((prev) => ({ ...prev, customer_phone: e.target.value }))
              }
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
              required
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Kurir & admin akan mengabari status melalui WhatsApp ini.
            </span>
          </div>
        </div>
      </div>

      {/* Payment Selection Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
        <h3 className="text-sm font-bold text-charcoal-900 pb-2 border-b border-slate-200">
          Pilihan Metode Pembayaran
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* COD Option */}
          <button
            type="button"
            disabled={isCodExceeded}
            aria-pressed={currentPayment === 'COD'}
            onClick={() => setCustomerInfo((prev) => ({ ...prev, payment_method: 'COD' }))}
            className={`w-full text-left p-3.5 rounded-xl border-2 flex items-start gap-3 transition ${
              isCodExceeded
                ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200'
                : currentPayment === 'COD'
                ? 'cursor-pointer border-brand-600 bg-brand-50/70 shadow-sm'
                : 'cursor-pointer border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <Banknote className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-charcoal-900 block">
                COD (Tunai saat Tiba)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                Bayar langsung ke kurir (Maksimal Rp50.000).
              </span>
              {isCodExceeded && (
                <span className="text-[10px] font-bold text-red-600 block mt-1">
                  Tagihan di atas Rp50rb wajib QRIS
                </span>
              )}
            </div>
          </button>

          {/* QRIS Option */}
          <button
            type="button"
            aria-pressed={currentPayment === 'QRIS_DIGITAL'}
            onClick={() => setCustomerInfo((prev) => ({ ...prev, payment_method: 'QRIS_DIGITAL' }))}
            className={`w-full text-left cursor-pointer p-3.5 rounded-xl border-2 flex items-start gap-3 transition ${
              currentPayment === 'QRIS_DIGITAL'
                ? 'border-brand-600 bg-brand-50/70 shadow-sm'
                : 'border-slate-200 bg-white hover:bg-slate-50'
            }`}
          >
            <QrCode className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="text-xs font-bold text-charcoal-900 block">
                QRIS Digital (Otomatis)
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                BCA, Mandiri, BRI, GoPay, OVO, ShopeePay, DANA.
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-charcoal-900 bg-slate-100 hover:bg-slate-200 px-5 py-3 rounded-xl transition"
        >
          &larr; Ubah Lokasi Peta
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm px-7 py-3.5 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Pesanan...</span>
            </>
          ) : (
            <>
              <span>Konfirmasi & Buat Pesanan</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
