import React, { useState } from 'react';
import api from '../../lib/api';
import { formatRupiah, createWaLink } from '../../lib/utils';
import { X, Bike, Banknote, MessageCircle, AlertCircle, Loader2, MapPin, Package, Navigation, Clock } from 'lucide-react';

export default function AssignMitraDialog({ order, onClose, onSuccess }) {
  const [mitraName, setMitraName] = useState(order?.assigned_mitra_name || '');
  const [mitraPhone, setMitraPhone] = useState(order?.assigned_mitra_phone || '');
  const [finalPrice, setFinalPrice] = useState(order?.final_price || order?.initial_estimated_price || 0);
  const [overrideReason, setOverrideReason] = useState(order?.price_override_reason || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const initialPrice = Number(order?.initial_estimated_price) || 0;
  const isOverridden = Number(finalPrice) !== initialPrice;

  // WhatsApp Quick Ping Link with valid international Indonesian format (62...)
  const waQuickPing = createWaLink(
    order.customer_phone,
    `Halo ${order.customer_name}, kami dari tim admin disuruhsuruh Samarinda. Mau konfirmasi pesanan [${order.nano_id}] Anda ke ${order.dropoff_address}. Kurir kami akan segera meluncur.`
  );

  const handleApprove = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.patch(`/admin/orders/${order.id}/approve`, {
        final_price: Number(finalPrice),
        price_override_reason: isOverridden ? overrideReason : 'Disetujui admin',
        assigned_mitra_name: mitraName.trim(),
        assigned_mitra_phone: mitraPhone.trim(),
      });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Gagal menyetujui pesanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Penugasan Mitra & Approval Harga
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Resi: {order.nano_id} • {order.service_type.replace('_', ' ')}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup dialog penugasan"
            className="p-1.5 text-slate-400 hover:text-charcoal-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* WhatsApp Quick Ping */}
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
          <div className="text-xs text-emerald-900">
            <span className="font-bold block">Hubungi Pemesan via WhatsApp:</span>
            <span>Verifikasi nomor pemesan sebelum kurir berangkat</span>
          </div>
          <a
            href={waQuickPing}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-lg shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>Chat WA</span>
          </a>
        </div>

        {/* Ringkasan Pesanan untuk Evaluasi Harga */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Ringkasan Pesanan & Rute
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {order.distance_km ? `${order.distance_km} km` : '-'}
              {order.predicted_duration_minutes ? ` (estimasi ${order.predicted_duration_minutes} menit)` : ''}
            </span>
          </div>

          {/* Rute A -> B */}
          <div className="space-y-1.5">
            {order.pickup_address && (
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  A
                </span>
                <span className="text-slate-700 line-clamp-1">{order.pickup_address}</span>
              </div>
            )}
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                B
              </span>
              <span className="text-slate-700 line-clamp-1">{order.dropoff_address}</span>
            </div>
          </div>

          {/* Rincian Muatan / Layanan */}
          {order.dynamic_payload && (
            <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              {order.service_type === 'antar_barang' && (
                <>
                  <p>
                    <strong>Berat:</strong> {order.dynamic_payload.item_weight_kg || 2} kg
                    {order.dynamic_payload.item_notes ? ` | Catatan: ${order.dynamic_payload.item_notes}` : ''}
                  </p>
                </>
              )}
              {order.service_type === 'titip_beli' && (
                <>
                  {order.dynamic_payload.shopping_list && (
                    <p className="line-clamp-2">
                      <strong>Belanja:</strong> {order.dynamic_payload.shopping_list}
                    </p>
                  )}
                  <p>
                    <strong>Talangan:</strong> {formatRupiah(order.dynamic_payload.estimated_items_cost || 0)}
                    {order.dynamic_payload.is_traditional_market ? ' (Pasar Tradisional)' : ''}
                  </p>
                </>
              )}
              {order.service_type === 'bersih_rumah' && (
                <>
                  <p>
                    <strong>Layanan:</strong> Bersih-bersih {order.dynamic_payload.property_type || 'kos'} ({order.dynamic_payload.duration_hours || 2} Jam, paket {order.dynamic_payload.cleaning_intensity || 'standar'})
                  </p>
                  <p>
                    <strong>Mitra:</strong> Gender {order.dynamic_payload.cleaner_gender_preference || 'bebas'}
                    {order.dynamic_payload.cleaning_notes ? ` | Catatan: ${order.dynamic_payload.cleaning_notes}` : ''}
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <form onSubmit={handleApprove} className="space-y-4">
          {/* Mitra Info */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Pilih / Input Mitra Kurir Bertugas:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nama Mitra Kurir:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={mitraName}
                  onChange={(e) => setMitraName(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Nomor WhatsApp Mitra:
                </label>
                <input
                  type="text"
                  placeholder="085233112233"
                  value={mitraPhone}
                  onChange={(e) => setMitraPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm border border-slate-300 rounded-xl p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Price Override (Admin Wewenang) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Koreksi Harga (Admin Price Override)
              </span>
              <span className="text-[11px] text-slate-500">
                Awal: <strong className="text-slate-800">{formatRupiah(initialPrice)}</strong>
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Harga Final yang Dikenakan ke Pelanggan (Rp):
              </label>
              <input
                type="number"
                step="1000"
                value={finalPrice}
                onChange={(e) => setFinalPrice(e.target.value)}
                className="w-full text-sm font-bold border border-slate-300 rounded-xl p-2.5 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {isOverridden && (
              <div>
                <label className="block text-[11px] font-semibold text-brand-700 mb-1">
                  Alasan Koreksi Tarif (Misal: Tangga Lantai 3 / Paket Berat):
                </label>
                <input
                  type="text"
                  placeholder="Keterangan penambahan biaya..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full text-xs border border-brand-300 rounded-xl p-2.5 bg-white focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
                  required
                />
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow transition active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>Setujui & Terbitkan Tagihan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
