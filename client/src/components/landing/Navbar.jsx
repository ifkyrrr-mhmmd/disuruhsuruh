import React from 'react';
import { Link } from 'react-router-dom';
import { RiArrowRightUpLine } from 'react-icons/ri';

export default function Navbar() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <div
        className="pointer-events-auto bg-white/90 backdrop-blur-xl border border-stone-200/80 shadow-md shadow-stone-900/5 rounded-full px-5 sm:px-6 py-2.5 flex items-center justify-between gap-6 max-w-2xl sm:max-w-3xl w-full transition-all"
      >
        {/* Brand */}
        <Link to="/" className="flex items-baseline shrink-0">
          <span className="text-base sm:text-lg font-extrabold text-stone-900 tracking-tight leading-none">
            disuruh
          </span>
          <span className="text-base sm:text-lg font-extrabold text-brand-600 tracking-tight leading-none">
            suruh
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-stone-600">
          <a
            href="#layanan"
            className="px-2.5 py-1 rounded-full hover:text-stone-900 hover:bg-stone-100/70 transition"
          >
            Layanan
          </a>
          <a
            href="#alur"
            className="px-2.5 py-1 rounded-full hover:text-stone-900 hover:bg-stone-100/70 transition"
          >
            Cara Pesan
          </a>
          <a
            href="#faq"
            className="px-2.5 py-1 rounded-full hover:text-stone-900 hover:bg-stone-100/70 transition"
          >
            FAQ
          </a>
        </nav>

        {/* CTA Button Pesan */}
        <Link
          to="/order"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 active:scale-95 px-4 py-2 rounded-full transition shadow-xs"
        >
          <span>Pesan</span>
          <RiArrowRightUpLine className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
}
