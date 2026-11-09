import React, { useState, useMemo, useEffect } from 'react';
import api from '../../lib/api';
import { formatRupiah } from '../../lib/utils';
import {
  X,
  Package,
  ShoppingBag,
  Sparkles,
  Wrench,
  CheckCircle2,
  Copy,
  Send,
  AlertCircle,
  Loader2,
  RotateCcw,
} from 'lucide-react';

export default function ManualOrderModal({ isOpen, onClose, onSuccess }) {
  const [serviceType, setServiceType] = useState('antar_barang');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [distanceKm, setDistanceKm] = useState(3.0);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  // Dynamic fields
  const [itemWeightKg, setItemWeightKg] = useState(2);
  const [itemNotes, setItemNotes] = useState('');

  const [shoppingList, setShoppingList] = useState('');
  const [estimatedItemsCost, setEstimatedItemsCost] = useState(0);
  const [isTraditionalMarket, setIsTraditionalMarket] = useState(true);

  const [propertyType, setPropertyType] = useState('kos');
  const [durationHours, setDurationHours] = useState(2);
  const [cleaningIntensity, setCleaningIntensity] = useState('standar');
  const [cleanerGender, setCleanerGender] = useState('bebas');

  // Custom Service & Price Override
  const [customServiceNotes, setCustomServiceNotes] = useState('');
  const [customFinalPrice, setCustomFinalPrice] = useState('');
  const [isPriceOverridden, setIsPriceOverridden] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [createdResult, setCreatedResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Live estimate calculation for the 3 OG services
  const systemRecommendedPrice = useMemo(() => {
    const dist = Math.max(0, Number(distanceKm) || 0);

    if (serviceType === 'antar_barang') {
      const base = 8000;
      const extraKm = dist > 2 ? Math.round((dist - 2) * 3000) : 0;
      let weightFee = 0;
      if (itemWeightKg > 10) weightFee = 6000;
      else if (itemWeightKg > 5) weightFee = 3000;
      return base + extraKm + weightFee;
    }

    if (serviceType === 'titip_beli') {
      const base = 10000;
      const extraKm = dist > 2 ? Math.round((dist - 2) * 3000) : 0;
      const marketFee = isTraditionalMarket ? 3000 : 0;
      const goods = Math.max(0, Number(estimatedItemsCost) || 0);
      return base + extraKm + marketFee + goods;
    }

    if (serviceType === 'bersih_rumah') {
      const transport = 15000;
      const hours = Math.max(1, Number(durationHours) || 2);
      const intensityFee = cleaningIntensity === 'deep_clean' ? 25000 : (cleaningIntensity === 'standar' ? 10000 : 0);
      return transport + (hours * 30000) + intensityFee;
    }

    return 0;
  }, [
    serviceType,
    distanceKm,
    itemWeightKg,
    estimatedItemsCost,
    isTraditionalMarket,
    durationHours,
    cleaningIntensity,
  ]);

  // Sync customFinalPrice with system recommendation if admin has not manually edited it
  useEffect(() => {
    if (serviceType !== 'layanan_lainnya' && !isPriceOverridden) {
      setCustomFinalPrice(String(systemRecommendedPrice));
    }
  }, [serviceType, systemRecommendedPrice, isPriceOverridden]);

  // Reset form to blank state
  const resetForm = () => {
    setServiceType('antar_barang');
    setCustomerName('');
    setCustomerPhone('');
    setPickupAddress('');
    setDropoffAddress('');
    setDistanceKm(3.0);
    setPaymentMethod('COD');
    setItemWeightKg(2);
    setItemNotes('');
    setShoppingList('');
    setEstimatedItemsCost(0);
    setIsTraditionalMarket(true);
    setPropertyType('kos');
    setDurationHours(2);
    setCleaningIntensity('standar');
    setCleanerGender('bebas');
    setCustomServiceNotes('');
    setCustomFinalPrice('11000');
    setIsPriceOverridden(false);
    setErrorMessage(null);
    setCreatedResult(null);
    setCopied(false);
  };

  // Reset every time modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFinish = () => {
    resetForm();
    onSuccess();
  };

  const handleServiceTabChange = (sId) => {
    setServiceType(sId);
    setIsPriceOverridden(false);
    if (sId === 'layanan_lainnya') {
      setCustomFinalPrice('');
    }
  };

  const activeFinalPrice = Number(customFinalPrice) || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Nama pemesan wajib diisi');
      return;
    }

    const cleanPhone = customerPhone.trim();
    if (!/^(\+62|62|0)8[1-9][0-9]{7,11}$/.test(cleanPhone)) {
      setErrorMessage('Nomor WhatsApp tidak valid (contoh: 085244112233)');
      return;
    }

    if (!dropoffAddress.trim()) {
      setErrorMessage('Alamat tujuan / lokasi pengerjaan wajib diisi');
      return;
    }

    if (serviceType === 'titip_beli' && !shoppingList.trim()) {
      setErrorMessage('Daftar barang belanjaan wajib diisi');
      return;
    }

    if (serviceType === 'layanan_lainnya') {
      if (!customServiceNotes.trim()) {
        setErrorMessage('Detail tugas layanan lainnya wajib diisi');
        return;
      }
      if (!customFinalPrice || Number(customFinalPrice) <= 0) {
        setErrorMessage('Tarif kesepakatan wajib diisi oleh admin');
        return;
      }
    }

    try {
      setIsSubmitting(true);

      const dynamicPayload = {};
      if (serviceType === 'antar_barang') {
        dynamicPayload.item_weight_kg = itemWeightKg;
        dynamicPayload.item_notes = itemNotes.trim();
      } else if (serviceType === 'titip_beli') {
        dynamicPayload.shopping_list = shoppingList.trim();
        dynamicPayload.estimated_items_cost = Number(estimatedItemsCost) || 0;
        dynamicPayload.is_traditional_market = isTraditionalMarket;
      } else if (serviceType === 'bersih_rumah') {
        dynamicPayload.property_type = propertyType;
        dynamicPayload.duration_hours = Number(durationHours) || 2;
        dynamicPayload.cleaning_intensity = cleaningIntensity;
        dynamicPayload.cleaner_gender_preference = cleanerGender;
      } else if (serviceType === 'layanan_lainnya') {
        dynamicPayload.custom_service_notes = customServiceNotes.trim();
      }

      const payload = {
        service_type: serviceType,
        customer_name: customerName.trim(),
        customer_phone: cleanPhone,
        pickup_address: pickupAddress.trim() || null,
        dropoff_address: dropoffAddress.trim(),
        distance_km: Number(distanceKm) || 0,
        payment_method: paymentMethod,
        initial_status: 'CONFIRMED',
        custom_final_price: activeFinalPrice,
        dynamic_payload: dynamicPayload,
      };

      const res = await api.post('/admin/orders', payload);
      if (res.data?.data) {
        setCreatedResult(res.data.data);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Gagal menyimpan pesanan manual');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyWA = () => {
    if (!createdResult?.wa_template) return;
    navigator.clipboard.writeText(createdResult.wa_template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-stone-200/90 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden my-auto max-h-[92vh] flex flex-col font-sans">
        
        {/* Header Modal */}
        <div className="bg-stone-50 px-5 py-3.5 border-b border-stone-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-stone-900">
              Input Pesanan Manual
            </h3>
            <p className="text-[11px] text-stone-500">
              Catat pesanan manual untuk menerbitkan resi dan rekap transaksi digital.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {createdResult ? (
            /* Tampilan Sukses & Salin Pesan */
            <div className="space-y-4 animate-step-in">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-emerald-900">
                    Pesanan Berhasil Dicatat & Terbit Resi!
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Kode Resi Pelacakan: <span className="font-mono font-extrabold">{createdResult.nano_id}</span>
                  </p>
                  <p className="text-xs text-stone-600 mt-1">
                    Total Tarif: <span className="font-extrabold text-stone-900">{formatRupiah(createdResult.final_price)}</span> ({createdResult.payment_method === 'QRIS_DIGITAL' ? 'QRIS' : 'COD'})
                  </p>
                </div>
              </div>

              {/* Template Pesan Box */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  Draf Pesan Siap Kirim ke Pelanggan:
                </label>
                <div className="relative">
                  <textarea
                    rows={7}
                    readOnly
                    value={createdResult.wa_template}
                    className="w-full text-xs font-mono bg-stone-50 border border-stone-200 rounded-xl p-3 text-stone-800 leading-relaxed focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCopyWA}
                    className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition"
                  >
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>{copied ? 'Tersalin!' : 'Salin Pesan'}</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                <a
                  href={`https://wa.me/${createdResult.customer_phone.replace(/^0/, '62')}?text=${encodeURIComponent(createdResult.wa_template)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Langsung ke WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleFinish}
                  className="w-full sm:w-auto bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs py-3 px-5 rounded-xl transition"
                >
                  Selesai & Tutup
                </button>
              </div>
            </div>
          ) : (
            /* Formulir Input 1 Layar */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Pilih Kategori Layanan (4 Segments) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  1. Kategori Layanan:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'antar_barang', label: 'Kurir Barang', icon: Package },
                    { id: 'titip_beli', label: 'Titip Beli Pasar', icon: ShoppingBag },
                    { id: 'bersih_rumah', label: 'Bersih-bersih', icon: Sparkles },
                    { id: 'layanan_lainnya', label: 'Layanan Lainnya', icon: Wrench },
                  ].map((s) => {
                    const Icon = s.icon;
                    const isSelected = serviceType === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handleServiceTabChange(s.id)}
                        className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                          isSelected
                            ? 'bg-orange-50 border-brand-600 text-brand-700 shadow-xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Data Pelanggan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nama Pemesan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rina Anggraini"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Nomor WhatsApp:
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 085244112233"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* 3. Alamat Jemput & Antar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {serviceType !== 'bersih_rumah' ? (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {serviceType === 'titip_beli'
                        ? 'Lokasi Toko / Pasar Belanja:'
                        : serviceType === 'layanan_lainnya'
                        ? 'Alamat Asal / Penjemputan (Opsional):'
                        : 'Alamat Penjemputan Barang:'}
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Pasar Segiri / Mall Lembuswana"
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Basecamp Penugasan Mitra:
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Basecamp disuruhsuruh (Samarinda)"
                      className="w-full text-xs bg-stone-100 border border-stone-200 text-stone-500 rounded-xl p-2.5 cursor-not-allowed"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {serviceType === 'bersih_rumah'
                      ? 'Alamat Lokasi yang Dibersihkan:'
                      : serviceType === 'layanan_lainnya'
                      ? 'Alamat Tujuan / Lokasi Pengerjaan:'
                      : 'Alamat Tujuan Pengantaran:'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Jl. Pramuka 5 no 12 / Gedung Bioskop SCP"
                    value={dropoffAddress}
                    onChange={(e) => setDropoffAddress(e.target.value)}
                    className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                  />
                </div>
              </div>

              {/* 4 & 5. Detail Layanan & Parameter Khusus */}
              {serviceType === 'antar_barang' && (
                <div className="space-y-3">
                  {/* Grid 2 Kolom Simetris: Jarak & Berat */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Estimasi Jarak:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Rute jalan raya
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="25"
                          required
                          value={distanceKm}
                          onChange={(e) => setDistanceKm(Math.max(0.1, Number(e.target.value) || 0))}
                          className="w-16 text-center font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                        />
                        <span className="text-xs font-semibold text-stone-600">km</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Berat Paket:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Maksimal 20 kg
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          required
                          value={itemWeightKg}
                          onChange={(e) => setItemWeightKg(Number(e.target.value))}
                          className="w-16 text-center font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                        />
                        <span className="text-xs font-semibold text-stone-600">kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Catatan untuk Kurir */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Catatan Kurir (Opsional):
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Titip di satpam depan / hati-hati barang pecah belah"
                      value={itemNotes}
                      onChange={(e) => setItemNotes(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>
              )}

              {serviceType === 'titip_beli' && (
                <div className="space-y-3">
                  {/* Grid 2 Kolom Simetris: Jarak & Uang Talangan */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Estimasi Jarak:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Rute jalan raya
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="25"
                          required
                          value={distanceKm}
                          onChange={(e) => setDistanceKm(Math.max(0.1, Number(e.target.value) || 0))}
                          className="w-16 text-center font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                        />
                        <span className="text-xs font-semibold text-stone-600">km</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Uang Talangan:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Estimasi belanja
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-stone-500">Rp</span>
                        <input
                          type="number"
                          min="0"
                          step="5000"
                          placeholder="50000"
                          value={estimatedItemsCost || ''}
                          onChange={(e) => setEstimatedItemsCost(Number(e.target.value))}
                          className="w-24 text-right font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Daftar Belanjaan */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Daftar Belanjaan:
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Contoh: Bawang merah 1/2 kg, Ayam potong 1 ekor, Bayam 2 ikat"
                      value={shoppingList}
                      onChange={(e) => setShoppingList(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-brand-600"
                    />
                  </div>

                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-700 cursor-pointer bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                    <input
                      type="checkbox"
                      checked={isTraditionalMarket}
                      onChange={(e) => setIsTraditionalMarket(e.target.checked)}
                      className="w-4 h-4 accent-orange-600 rounded"
                    />
                    <span>Belanja di Pasar Tradisional (Segiri/Pagi) (+Rp3.000)</span>
                  </label>
                </div>
              )}

              {serviceType === 'bersih_rumah' && (
                <div className="space-y-3">
                  {/* Grid 2 Kolom Simetris: Jarak & Durasi */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Jarak Tempuh:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Basecamp ke lokasi
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          step="0.1"
                          min="0.5"
                          max="25"
                          required
                          value={distanceKm}
                          onChange={(e) => setDistanceKm(Math.max(0.1, Number(e.target.value) || 0))}
                          className="w-16 text-center font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                        />
                        <span className="text-xs font-semibold text-stone-600">km</span>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-stone-800 block">
                          Durasi Waktu:
                        </span>
                        <span className="text-[11px] text-stone-500 block">
                          Rp30.000 / jam
                        </span>
                      </div>
                      <select
                        value={durationHours}
                        onChange={(e) => setDurationHours(Number(e.target.value))}
                        className="text-xs font-bold bg-white border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:border-brand-600"
                      >
                        <option value={1}>1 Jam</option>
                        <option value={2}>2 Jam</option>
                        <option value={3}>3 Jam</option>
                        <option value={4}>4 Jam</option>
                      </select>
                    </div>
                  </div>

                  {/* Properti & Mitra */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Tipe Properti:</label>
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                      >
                        <option value="kos">Kosan</option>
                        <option value="rumah">Rumah</option>
                        <option value="kantor">Kantor</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">Preferensi Mitra:</label>
                      <select
                        value={cleanerGender}
                        onChange={(e) => setCleanerGender(e.target.value)}
                        className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-900 focus:outline-none focus:border-brand-600"
                      >
                        <option value="bebas">Bebas</option>
                        <option value="wanita">Khusus Wanita</option>
                        <option value="pria">Pria</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Khusus Layanan Lainnya: Deskripsi Tugas Bebas */}
              {serviceType === 'layanan_lainnya' && (
                <div className="space-y-3">
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/90 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">
                        Estimasi Jarak Tempuh:
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        Perjalanan kurir menuju lokasi
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        max="25"
                        required
                        value={distanceKm}
                        onChange={(e) => setDistanceKm(Math.max(0.1, Number(e.target.value) || 0))}
                        className="w-16 text-center font-bold text-stone-900 text-xs bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                      />
                      <span className="text-xs font-semibold text-stone-600">km</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Detail Tugas / Mau Disuruh Apa:
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Jelaskan instruksi tugas khusus, contoh:&#10;- Tolong antrekan tiket bioskop film jam 19.00&#10;- Tolong jagain stan pameran selama 2 jam"
                      value={customServiceNotes}
                      onChange={(e) => setCustomServiceNotes(e.target.value)}
                      className="w-full text-xs bg-white border border-stone-300 rounded-xl p-2.5 text-stone-800 focus:outline-none focus:border-brand-600"
                    />
                  </div>
                </div>
              )}

              {/* 6. Penentuan Tarif (Fleksibel & Bisa Disesuaikan Admin) */}
              <div className="p-3.5 bg-orange-50/60 rounded-xl border border-orange-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    {serviceType === 'layanan_lainnya'
                      ? 'Tarif Kesepakatan (Manual oleh Admin):'
                      : 'Tarif Final yang Ditagihkan:'}
                  </span>
                  {serviceType !== 'layanan_lainnya' && (
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                      <span>Rekomendasi Sistem:</span>
                      <span className="font-bold text-stone-700">{formatRupiah(systemRecommendedPrice)}</span>
                      {isPriceOverridden && (
                        <button
                          type="button"
                          onClick={() => {
                            setCustomFinalPrice(String(systemRecommendedPrice));
                            setIsPriceOverridden(false);
                          }}
                          className="inline-flex items-center gap-0.5 text-brand-600 hover:text-brand-700 underline ml-1"
                          title="Reset ke harga rekomendasi sistem"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-stone-500">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    min="5000"
                    required
                    placeholder={serviceType === 'layanan_lainnya' ? 'Contoh: 35000' : String(systemRecommendedPrice)}
                    value={customFinalPrice}
                    onChange={(e) => {
                      setCustomFinalPrice(e.target.value);
                      setIsPriceOverridden(true);
                    }}
                    className="flex-1 text-sm font-black text-brand-700 bg-white border border-stone-300 rounded-lg p-2 focus:outline-none focus:border-brand-600"
                  />
                </div>
                <span className="text-[10px] text-stone-500 block">
                  {serviceType === 'layanan_lainnya'
                    ? 'Tentukan tarif kesepakatan langsung sesuai tingkat kesulitan tugas.'
                    : 'Admin dapat mengubah nominal harga final jika ada kesepakatan khusus / kondisi jalan.'}
                </span>
              </div>

              {/* 7. Metode Pembayaran (COD atau QRIS) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Metode Pembayaran:</label>
                <div className="flex gap-2">
                  {['COD', 'QRIS_DIGITAL'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPaymentMethod(m)}
                      className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold transition ${
                        paymentMethod === m
                          ? 'bg-orange-50 border-brand-600 text-brand-700'
                          : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      {m === 'COD' ? 'Tunai (COD)' : 'QRIS'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-500 block">Total Ditagihkan:</span>
                  <span className="text-base sm:text-lg font-black text-brand-700">
                    {formatRupiah(activeFinalPrice)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 rounded-xl transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyimpan...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Simpan & Buat Pesanan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
