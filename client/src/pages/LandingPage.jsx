import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import ServicesSection from '../components/landing/ServicesSection';
import StickyBottomBar from '../components/landing/StickyBottomBar';
import { Link } from 'react-router-dom';
import {
  RiMapPin2Line,
  RiCalculatorLine,
  RiEBike2Line,
  RiArrowRightLine,
  RiArrowDownSLine,
  RiWhatsappLine,
} from 'react-icons/ri';

export default function LandingPage() {
  const steps = [
    {
      num: '1',
      title: 'Tandai Titik di Peta',
      desc: 'Tentukan lokasi penjemputan dan pengantaran. Jarak rute jalan raya dihitung otomatis dan presisi.',
      icon: RiMapPin2Line,
    },
    {
      num: '2',
      title: 'Cek Rincian Biaya Pasti',
      desc: 'Tarif dasar, biaya jarak, dan opsi talangan dijabarkan transparan sebelum Anda membuat pesanan.',
      icon: RiCalculatorLine,
    },
    {
      num: '3',
      title: 'Kurir Menuju Lokasi',
      desc: 'Mitra kurir terdekat ditugaskan. Anda dapat melacak status pesanan secara langsung lewat nomor resi.',
      icon: RiEBike2Line,
    },
  ];

  const faqs = [
    {
      q: 'Bagaimana jika barang belanjaan di toko atau pasar ternyata habis?',
      a: 'Uang belanja Anda dijamin kembali 100% utuh tanpa potongan. Anda juga bisa memilih agar admin menghubungi Anda via WhatsApp jika ingin mencari barang pengganti.',
    },
    {
      q: 'Apakah wajib mendaftar akun atau mengunduh aplikasi?',
      a: 'Tidak perlu. Anda bisa langsung memesan lewat web browser ini. Setiap pesanan langsung mendapatkan kode resi unik untuk pelacakan.',
    },
    {
      q: 'Berapa radius jangkauan wilayah yang dilayani?',
      a: 'Kami melayani hingga radius 25 km dari pusat Kota Samarinda, mencakup Samarinda Ulu, Samarinda Ilir, Sungai Pinang, Samarinda Seberang, Loa Bakung, hingga Sambutan.',
    },
    {
      q: 'Metode pembayaran apa saja yang tersedia?',
      a: 'Pembayaran bisa tunai (COD) untuk total di bawah Rp50.000, atau menggunakan QRIS Dinamis untuk pembayaran non-tunai (BCA, Mandiri, DANA, GoPay, ShopeePay).',
    },
  ];

  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-cream text-stone-900 pb-20 md:pb-0 font-sans selection:bg-orange-100 selection:text-orange-900">
      <Navbar />

      <HeroSection />

      <ServicesSection />

      {/* Alur Pemesanan Bersih */}
      <section className="py-16 md:py-20 bg-white border-b border-stone-200/80 scroll-mt-24" id="alur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="max-w-xl mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Cara Pesan
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
              Alur Cepat Tanpa Ribet
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Selesai dalam hitungan menit, langsung dari browser tanpa perlu download aplikasi.
            </p>
          </div>

          <div className="relative">
            {/* Garis penghubung horizontal tipis di desktop */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-px bg-stone-200/90 -translate-y-1/2 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {steps.map((st) => {
                const Icon = st.icon;
                return (
                  <div
                    key={st.num}
                    className="bg-stone-50/90 rounded-2xl p-6 border border-stone-200/90 flex flex-col justify-between hover:border-orange-200 hover:-translate-y-0.5 hover:shadow-md duration-200 transition"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center font-bold">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-2xl font-black text-stone-300">
                          0{st.num}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 tracking-tight">
                        {st.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 px-7 py-3.5 rounded-xl shadow-sm transition active:scale-[0.98]"
            >
              <span>Mulai Buat Pesanan</span>
              <RiArrowRightLine className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Pertanyaan yang Sering Diajukan (FAQ) - Grid 12 Kolom */}
      <section className="py-16 md:py-24 bg-cream border-b border-stone-200/80 scroll-mt-24" id="faq">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Kolom Kiri: Judul FAQ & Kartu Bantuan WhatsApp */}
            <div className="md:col-span-4 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                  FAQ
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
                  Pertanyaan yang Sering Diajukan
                </h2>
                <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                  Informasi transparan seputar cara pesan, argo jarak, dan garansi belanja.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-stone-900">
                  Punya rute khusus atau barang unik?
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Admin kami siap merespons cepat untuk konsultasi dan bantuan penugasan kurir.
                </p>
                <a
                  href="https://wa.me/6285332455999?text=Halo%20Admin%20disuruhsuruh,%20saya%20mau%20tanya%20layanan"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition"
                >
                  <RiWhatsappLine className="w-4 h-4 text-emerald-600" />
                  <span>Tanya Admin via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Kolom Kanan: Daftar Akordion FAQ */}
            <div className="md:col-span-8 space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-sm transition"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-stone-900 hover:text-brand-600 transition"
                    >
                      <span>{faq.q}</span>
                      <RiArrowDownSLine
                        className={`w-5 h-5 text-stone-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand-600' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* Footer Bersih, Terang & Ramah */}
      <footer className="bg-white text-stone-600 pt-12 pb-8 border-t border-stone-200/80 overflow-hidden relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-stone-200">
            
            <div className="md:col-span-6 space-y-2.5">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-stone-900 tracking-tight">
                  disuruh<span className="text-brand-600">suruh</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-stone-400">
                  Samarinda
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
                Layanan antar barang, jastip belanja pasar, dan bersih rumah berbasis hitungan tarif transparan di Kota Samarinda, Kalimantan Timur.
              </p>
              {/* Jam Operasional Bersih & Terang */}
              <p className="text-xs text-stone-500 font-medium">
                Jam Layanan: 07.30 - 22.00 WITA Setiap Hari
              </p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                Layanan
              </span>
              <ul className="text-xs space-y-2">
                <li>
                  <Link to="/order?service=antar_barang" className="hover:text-brand-600 transition">
                    Kurir Antar Barang
                  </Link>
                </li>
                <li>
                  <Link to="/order?service=titip_beli" className="hover:text-brand-600 transition">
                    Jastip Belanja Pasar
                  </Link>
                </li>
                <li>
                  <Link to="/order?service=bersih_rumah" className="hover:text-brand-600 transition">
                    Jasa Bersih Rumah & Kos
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-900 block">
                Bantuan & Kontak
              </span>
              <p className="text-xs text-stone-500">
                Punya pertanyaan rute atau butuh bantuan admin?
              </p>
              <a
                href="https://wa.me/6285332455999?text=Halo%20Admin%20disuruhsuruh"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-2 rounded-xl transition"
              >
                <RiWhatsappLine className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp: 0853-3245-5999</span>
              </a>
            </div>

          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
            <p>© {new Date().getFullYear()} disuruhsuruh Samarinda. Hak cipta dilindungi.</p>
            <p className="text-[11px]">Tarif Rute Terbuka OSRM • Pembayaran Aman QRIS</p>
          </div>

          {/* Watermark Tipografi Raksasa Transparan Halus */}
          <div className="text-[12vw] font-black text-stone-900/[0.03] leading-none text-center select-none pointer-events-none tracking-tighter mt-4 -mb-4">
            disuruhsuruh
          </div>
        </div>
      </footer>

      {/* Floating Action Bar untuk Mobile */}
      <StickyBottomBar />
    </div>
  );
}
