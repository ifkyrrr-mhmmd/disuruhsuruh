import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightLine, RiEBike2Fill } from 'react-icons/ri';

export default function StickyBottomBar() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-4 py-2.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider font-sans">
            Tarif Resmi Samarinda
          </span>
          <span className="text-base font-black text-stone-900 leading-none font-sans">
            Mulai Rp8.000
          </span>
        </div>

        <Link
          to="/order"
          className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow transition active:scale-[0.98]"
        >
          <RiEBike2Fill className="w-4 h-4" />
          <span>Pesan Sekarang</span>
          <RiArrowRightLine className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
