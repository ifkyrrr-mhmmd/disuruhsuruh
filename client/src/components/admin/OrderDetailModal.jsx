import React, { useState } from 'react';
import { formatRupiah, createWaLink } from '../../lib/utils';
import { X, ExternalLink, Copy, Check, MessageCircle, MapPin, Calendar, Clock, DollarSign, Package } from 'lucide-react';

export default function OrderDetailModal({ order, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!order) return null;

  const handleCopyTrackLink = () => {
    const fullUrl = `${window.location.origin}/track/${order.nano_id}`;
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customerWaLink = createWaLink(
    order.customer_phone,
    `Halo ${order.customer_name}, kami dari tim admin disuruhsuruh Samarinda terkait pesanan [${order.nano_id}].`
  );

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-charcoal-900">
              Rincian Lengkap Pesanan
            </h3>
            <span className="text-xs font-mono font-bold text-brand-600">
              {order.nano_id}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup rincian pesanan"
            className="p-1.5 text-slate-400 hover:text-charcoal-900 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Layanan</span>
            <span className="font-bold text-slate-800 capitalize">{order.service_type.replace('_', ' ')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Waktu Pesan</span>
            <span className="font-medium text-slate-800">{new Date(order.created_at).toLocaleString('id-ID')}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Pelanggan</span>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="font-bold text-slate-800">{order.customer_name} ({order.customer_phone})</span>
              <a
                href={customerWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-lg transition"
                title="Chat WA Pelanggan"
              >
                <MessageCircle className="w-3 h-3 fill-current" />
                <span>Chat WA</span>
              </a>
            </div>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Metode / Status Bayar</span>
            <span className="font-bold text-slate-800">{order.payment_method} ({order.payment_status})</span>
          </div>
        </div>

        {/* Addresses */}
        <div className="space-y-2 text-xs">
          {order.pickup_address && (
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                A
              </span>
              <div>
                <span className="text-slate-400 block text-[10px]">Titik Jemput:</span>
                <span className="text-slate-800 font-medium">{order.pickup_address}</span>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              B
            </span>
            <div>
              <span className="text-slate-400 block text-[10px]">Titik Antar:</span>
              <span className="text-slate-800 font-medium">{order.dropoff_address}</span>
            </div>
          </div>
        </div>

        {/* Dynamic Payload Content scoped strictly to service_type */}
        {order.dynamic_payload && Object.keys(order.dynamic_payload).length > 0 && (
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5">
            <span className="text-slate-500 font-bold block text-[10px] uppercase tracking-wider">
              Variabel Khusus ({order.service_type.replace('_', ' ')}):
            </span>

            {order.service_type === 'antar_barang' && (
              <>
                <p>
                  <strong>Berat Paket:</strong> {order.dynamic_payload.item_weight_kg || 2} kg
                </p>
                {order.dynamic_payload.item_notes && (
                  <p>
                    <strong>Catatan Kurir:</strong> {order.dynamic_payload.item_notes}
                  </p>
                )}
              </>
            )}

            {order.service_type === 'titip_beli' && (
              <>
                {order.dynamic_payload.shopping_list && (
                  <div>
                    <strong className="block mb-0.5">Daftar Belanja:</strong>
                    <div className="bg-white p-2 rounded border border-slate-200 whitespace-pre-line text-slate-700">
                      {order.dynamic_payload.shopping_list}
                    </div>
                  </div>
                )}
                <p>
                  <strong>Estimasi Uang Belanja:</strong> {formatRupiah(order.dynamic_payload.estimated_items_cost || 0)}
                </p>
                {order.dynamic_payload.out_of_stock_preference && (
                  <p>
                    <strong>Preferensi Stok Habis:</strong>{' '}
                    {order.dynamic_payload.out_of_stock_preference === 'call_customer'
                      ? 'Telepon/WA konfirmasi'
                      : order.dynamic_payload.out_of_stock_preference === 'buy_available'
                      ? 'Beli yang tersedia saja'
                      : 'Batalkan seluruh pesanan'}
                  </p>
                )}
                {order.dynamic_payload.is_traditional_market && (
                  <p>
                    <strong>Lokasi Belanja:</strong> Pasar Tradisional (Pasar Segiri/Pagi)
                  </p>
                )}
                {order.dynamic_payload.additional_stores_count > 0 && (
                  <p>
                    <strong>Toko Tambahan:</strong> +{order.dynamic_payload.additional_stores_count} Toko
                  </p>
                )}
              </>
            )}

            {order.service_type === 'bersih_rumah' && (
              <>
                <p>
                  <strong>Tipe Properti:</strong>{' '}
                  {order.dynamic_payload.property_type === 'kos'
                    ? 'Kosan Mahasiswa / Kamar'
                    : order.dynamic_payload.property_type === 'rumah'
                    ? 'Rumah Kontrakan / Tinggal'
                    : 'Kantor / Ruko'}
                </p>
                <p>
                  <strong>Durasi Pengerjaan:</strong> {order.dynamic_payload.duration_hours || 2} Jam
                </p>
                <p>
                  <strong>Paket Kebersihan:</strong>{' '}
                  {order.dynamic_payload.cleaning_intensity === 'deep_clean'
                    ? 'Deep Clean (Kerak Kamar Mandi/WC & Dapur)'
                    : order.dynamic_payload.cleaning_intensity === 'standar'
                    ? 'Standar Menyeluruh'
                    : 'Rutin / Ringan'}
                </p>
                {Array.isArray(order.dynamic_payload.cleaning_areas) && order.dynamic_payload.cleaning_areas.length > 0 && (
                  <p>
                    <strong>Fokus Area:</strong>{' '}
                    {order.dynamic_payload.cleaning_areas
                      .map((a) =>
                        a === 'kamar_tidur'
                          ? 'Kamar Tidur'
                          : a === 'kamar_mandi'
                          ? 'Kamar Mandi / WC'
                          : a === 'dapur'
                          ? 'Dapur'
                          : 'Ruang Tamu / Teras'
                      )
                      .join(', ')}
                  </p>
                )}
                {order.dynamic_payload.cleaner_gender_preference && (
                  <p>
                    <strong>Preferensi Gender Mitra:</strong>{' '}
                    {order.dynamic_payload.cleaner_gender_preference === 'wanita'
                      ? 'Mitra Wanita (Kos Putri)'
                      : order.dynamic_payload.cleaner_gender_preference === 'pria'
                      ? 'Mitra Pria'
                      : 'Bebas'}
                  </p>
                )}
                <p>
                  <strong>Peralatan:</strong>{' '}
                  {order.dynamic_payload.equipment_preference === 'pemilik_sedia'
                    ? 'Disediakan Pemilik Rumah'
                    : 'Mitra Membawa Peralatan Standar'}
                </p>
                {order.dynamic_payload.cleaning_notes && (
                  <p>
                    <strong>Instruksi Khusus:</strong> {order.dynamic_payload.cleaning_notes}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* Pricing Info */}
        <div className="p-3.5 bg-brand-50/60 border border-brand-200 rounded-xl flex justify-between items-center text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Harga Awal: {formatRupiah(order.initial_estimated_price)}</span>
            <span className="font-extrabold text-charcoal-900 text-sm">
              Harga Final: {formatRupiah(order.final_price)}
            </span>
          </div>
          {order.price_override_reason && (
            <span className="text-[11px] font-semibold text-brand-800 bg-brand-100 px-2 py-1 rounded">
              Override: {order.price_override_reason}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={customerWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2.5 rounded-xl transition shadow-sm active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat WA Pelanggan</span>
            </a>

            <button
              type="button"
              onClick={handleCopyTrackLink}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3.5 py-2.5 rounded-xl transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                  <span className="text-emerald-700">Link Tersalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Link Tracking</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold px-5 py-2.5 bg-charcoal-900 hover:bg-black text-white rounded-xl transition shadow-sm active:scale-95 text-center"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
