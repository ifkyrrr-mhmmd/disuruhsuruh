import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { Package, ShoppingBag, Sparkles, AlertCircle, Info } from 'lucide-react';

export default function DynamicServiceFields() {
  const { serviceType, dynamicPayload, setDynamicPayload } = useOrder();

  const handleChange = (key, value) => {
    setDynamicPayload((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* ANTAR BARANG */}
      {serviceType === 'antar_barang' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Package className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-charcoal-900">
              Rincian Barang yang Diantar
            </h3>
          </div>

          <div>
            <label htmlFor="item-weight" className="block text-xs font-bold text-slate-700 mb-1.5">
              Estimasi Berat Paket: <span className="text-brand-600 font-black">{dynamicPayload.item_weight_kg || 2} kg</span>
            </label>
            <input
              id="item-weight"
              type="range"
              min="1"
              max="20"
              step="1"
              value={dynamicPayload.item_weight_kg || 2}
              onChange={(e) => handleChange('item_weight_kg', Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>1 kg</span>
              <span>5 kg (standar)</span>
              <span>10 kg (+Rp3rb)</span>
              <span>20 kg (+Rp6rb)</span>
            </div>
          </div>

          <div>
            <label htmlFor="item-notes" className="block text-xs font-bold text-slate-700 mb-1">
              Catatan untuk Kurir (Opsional):
            </label>
            <input
              id="item-notes"
              type="text"
              placeholder="Contoh: Titip di satpam / Lantai 2 kamar kos no 4"
              value={dynamicPayload.item_notes || ''}
              onChange={(e) => handleChange('item_notes', e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      )}

      {/* TITIP BELI */}
      {serviceType === 'titip_beli' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-charcoal-900">
              Daftar Titip Belanjaan
            </h3>
          </div>

          <div>
            <label htmlFor="shopping-list" className="block text-xs font-bold text-slate-700 mb-1">
              Daftar Barang Belanja (Wajib Diisi):
            </label>
            <textarea
              id="shopping-list"
              rows={3}
              required
              placeholder="Contoh:&#10;- Telur ayam 1 kg&#10;- Minyak goreng Bimoli 2L&#10;- Sayur bayam 2 ikat"
              value={dynamicPayload.shopping_list || ''}
              onChange={(e) => handleChange('shopping_list', e.target.value)}
              className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="estimated-items-cost" className="block text-xs font-bold text-slate-700 mb-1">
                Estimasi Total Uang Belanja (Rp):
              </label>
              <input
                id="estimated-items-cost"
                type="number"
                min="0"
                step="5000"
                placeholder="50000"
                value={dynamicPayload.estimated_items_cost || ''}
                onChange={(e) =>
                  handleChange('estimated_items_cost', Math.max(0, Number(e.target.value)))
                }
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Dana talangan belanja yang akan ditalangi kurir.
              </span>
            </div>

            <div>
              <label htmlFor="out-of-stock-preference" className="block text-xs font-bold text-slate-700 mb-1">
                Jika Stok di Toko Kosong:
              </label>
              <select
                id="out-of-stock-preference"
                value={dynamicPayload.out_of_stock_preference || 'call_customer'}
                onChange={(e) => handleChange('out_of_stock_preference', e.target.value)}
                className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="call_customer">Telepon/WA saya untuk konfirmasi</option>
                <option value="buy_available">Beli barang yang tersedia saja</option>
                <option value="cancel_order">Batalkan seluruh pesanan</option>
              </select>
            </div>
          </div>

          {/* Pasar Tradisional Checkbox */}
          <label className="flex items-center gap-2.5 p-3 bg-white border border-slate-200 rounded-xl cursor-pointer">
            <input
              type="checkbox"
              checked={!!dynamicPayload.is_traditional_market}
              onChange={(e) => handleChange('is_traditional_market', e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <div className="text-xs">
              <span className="font-bold text-slate-800">
                Belanja di Pasar Tradisional (Pasar Segiri / Pasar Pagi)
              </span>
              <span className="block text-slate-500 text-[11px]">
                Biaya penyesuaian parkir & antre pasar basah (+Rp3.000).
              </span>
            </div>
          </label>
        </div>
      )}

      {/* BERSIH-BERSIH RUMAH & KOS */}
      {serviceType === 'bersih_rumah' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-charcoal-900">
                Rincian Layanan Bersih-bersih
              </h3>
            </div>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded">
              Rp30.000 / Jam
            </span>
          </div>

          {/* Tipe Properti */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Tipe Properti yang Dibersihkan:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'kos', label: 'Kosan', desc: 'Kamar Mahasiswa / Single' },
                { id: 'rumah', label: 'Rumah', desc: 'Kontrakan / Rumah Tinggal' },
                { id: 'kantor', label: 'Kantor / Ruko', desc: 'Ruang Kerja / Usaha' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={dynamicPayload.property_type === p.id}
                  onClick={() => handleChange('property_type', p.id)}
                  className={`p-2.5 text-xs rounded-xl border text-left transition ${
                    dynamicPayload.property_type === p.id
                      ? 'border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-bold">{p.label}</span>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Durasi Pengerjaan */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Estimasi Durasi Pengerjaan:
              </label>
              <span className="text-[11px] text-slate-500">
                Dipilih: <strong className="text-brand-600">{dynamicPayload.duration_hours || 2} Jam</strong>
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { h: 1, label: '1 Jam', desc: 'Pembersihan Cepat', price: 'Rp30rb' },
                { h: 2, label: '2 Jam', desc: 'Kamar + Kamar Mandi', price: 'Rp60rb', popular: true },
                { h: 3, label: '3 Jam', desc: '2–3 Ruangan Lengkap', price: 'Rp90rb' },
                { h: 4, label: '4 Jam', desc: 'Pembersihan Besar / Pindah', price: 'Rp120rb' },
              ].map((item) => (
                <button
                  key={item.h}
                  type="button"
                  aria-pressed={(dynamicPayload.duration_hours || 2) === item.h}
                  onClick={() => handleChange('duration_hours', item.h)}
                  className={`p-2.5 rounded-xl border text-left transition relative ${
                    (dynamicPayload.duration_hours || 2) === item.h
                      ? 'border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.popular && (
                    <span className="absolute -top-2 right-2 text-[9px] font-extrabold bg-brand-600 text-white px-1.5 py-0.2 rounded-full">
                      Rekomendasi
                    </span>
                  )}
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-black">{item.label}</span>
                    <span className="text-[10px] text-brand-700 font-bold">{item.price}</span>
                  </div>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tingkat / Paket Pekerjaan (Intensitas) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Paket Tingkat Kebersihan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'ringan',
                  label: 'Rutin / Ringan',
                  cost: '+Rp0',
                  desc: 'Sapu & pel lantai, lap debu meja/permukaan datar, buang sampah.',
                },
                {
                  id: 'standar',
                  label: 'Standar Menyeluruh',
                  cost: '+Rp10.000',
                  desc: 'Sapu, pel, bersihkan perabot, lap jendela/kaca, rapikan kamar tidur.',
                },
                {
                  id: 'deep_clean',
                  label: 'Deep Clean',
                  cost: '+Rp25.000',
                  desc: 'Sikat kerak membandel kamar mandi/WC, kerak dapur, pasca pindahan.',
                },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={dynamicPayload.cleaning_intensity === c.id}
                  onClick={() => handleChange('cleaning_intensity', c.id)}
                  className={`p-2.5 rounded-xl text-left border transition ${
                    dynamicPayload.cleaning_intensity === c.id
                      ? 'border-brand-600 bg-brand-50/90 text-brand-950 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold">{c.label}</span>
                    <span className="text-[10px] font-extrabold text-brand-600 bg-white/80 px-1.5 py-0.5 rounded border border-brand-200">
                      {c.cost}
                    </span>
                  </div>
                  <span className="block text-[11px] text-slate-500 font-normal leading-relaxed">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Fokus Area Ruangan (Checklist) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fokus Area yang Ingin Dibersihkan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'kamar_tidur', label: 'Kamar Tidur' },
                { id: 'kamar_mandi', label: 'Kamar Mandi / WC' },
                { id: 'dapur', label: 'Dapur / Pantry' },
                { id: 'ruang_tamu', label: 'Ruang Tamu / Teras' },
              ].map((area) => {
                const currentAreas = Array.isArray(dynamicPayload.cleaning_areas)
                  ? dynamicPayload.cleaning_areas
                  : ['kamar_tidur', 'kamar_mandi'];
                const isChecked = currentAreas.includes(area.id);
                return (
                  <label
                    key={area.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs cursor-pointer transition select-none ${
                      isChecked
                        ? 'bg-brand-50/70 border-brand-300 text-brand-950 font-bold'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...currentAreas, area.id]
                          : currentAreas.filter((x) => x !== area.id);
                        handleChange('cleaning_areas', next);
                      }}
                      className="w-3.5 h-3.5 accent-brand-600 rounded"
                    />
                    <span>{area.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Preferensi Gender Mitra (Sesuai PRD US-07 untuk Kos Putri) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Preferensi Gender Mitra Kebersihan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'wanita',
                  label: 'Mitra Wanita',
                  desc: 'Sangat disarankan untuk kenyamanan kos mahasiswi / kos putri.',
                },
                {
                  id: 'pria',
                  label: 'Mitra Pria',
                  desc: 'Cocok bila butuh angkat / geser perabot dan furnitur berat.',
                },
                {
                  id: 'bebas',
                  label: 'Bebas (Siapa Saja)',
                  desc: 'Mitra terdekat yang siap datang paling cepat ke lokasi.',
                },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  aria-pressed={dynamicPayload.cleaner_gender_preference === g.id}
                  onClick={() => handleChange('cleaner_gender_preference', g.id)}
                  className={`p-2.5 text-xs rounded-xl border text-left transition ${
                    dynamicPayload.cleaner_gender_preference === g.id
                      ? 'border-brand-600 bg-brand-50 text-brand-950 font-bold shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="block font-bold">{g.label}</span>
                  <span className="block text-[10px] text-slate-500 font-normal mt-0.5">{g.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ketersediaan Alat & Catatan Khusus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label htmlFor="equipment-preference" className="block text-xs font-bold text-slate-700 mb-1">
                Peralatan Kebersihan:
              </label>
              <select
                id="equipment-preference"
                value={dynamicPayload.equipment_preference || 'mitra_bawa'}
                onChange={(e) => handleChange('equipment_preference', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
              >
                <option value="mitra_bawa">Mitra membawa alat standar (sapu, pel, cairan, sikat)</option>
                <option value="pemilik_sedia">Peralatan kebersihan disediakan oleh pemilik</option>
              </select>
            </div>

            <div>
              <label htmlFor="cleaning-notes" className="block text-xs font-bold text-slate-700 mb-1">
                Instruksi Khusus untuk Mitra (Opsional):
              </label>
              <input
                id="cleaning-notes"
                type="text"
                placeholder="Contoh: Fokus sikat kerak lantai kamar mandi"
                value={dynamicPayload.cleaning_notes || ''}
                onChange={(e) => handleChange('cleaning_notes', e.target.value)}
                className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2.5 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
