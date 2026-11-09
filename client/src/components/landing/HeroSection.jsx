import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";

export default function HeroSection() {
  const [trackId, setTrackId] = useState("");
  const [focused, setFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  // Hanya 3 state: 'idle' | 'open' | 'closing' (Tanpa 'entering -> active' agar 0% kedipan di akhir)
  const [animPhase, setAnimPhase] = useState("idle");
  const timerRef = useRef(null);
  const navigate = useNavigate();

  const shouldBeOpen = isHovered || focused || trackId.trim().length > 0;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (shouldBeOpen) {
      setAnimPhase("open");
    } else {
      if (animPhase === "open") {
        setAnimPhase("closing");
        timerRef.current = setTimeout(() => {
          setAnimPhase("idle");
        }, 780);
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [shouldBeOpen, animPhase]);

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      navigate(`/track/${trackId.trim()}`);
    }
  };

  const isOpen = animPhase === "open";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-4">
      {/* ── Ambient Gradient Blob (Pink + Kuning) dengan Efek Airbrush / Noise Spray di Ujungnya ── */}
      <svg
        aria-hidden="true"
        className="absolute pointer-events-none select-none z-0"
        style={{
          width: "90vw",
          maxWidth: "1280px",
          height: "65vh",
          maxHeight: "560px",
          left: "50%",
          top: "43%",
          transform: "translate(-49%, -50%)",
          overflow: "visible",
        }}
        viewBox="0 0 920 440"
      >
        <defs>
          <filter
            id="airbrushSpray"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            {/* 1. Fractal noise untuk partikel butiran */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.38"
              numOctaves="3"
              result="grain"
            />

            {/* 2. Hamburkan tepi warna menjadi partikel butiran airbrush spray */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="grain"
              scale="150"
              xChannelSelector="R"
              yChannelSelector="G"
              result="scattered"
            />

            {/* 3. Komposisi butiran menyatu ke dalam warna */}
            <feComposite
              in="scattered"
              in2="grain"
              operator="arithmetic"
              k1="0.45"
              k2="0.65"
              k3="0"
              k4="0"
            />
          </filter>

          {/* Gradien Pink di bagian atas */}
          <radialGradient id="pinkSpray" cx="48%" cy="42%" r="65%">
            <stop offset="0%" stopColor="#EA0BA0" stopOpacity="0.26" />
            <stop offset="60%" stopColor="#EA0BA0" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#EA0BA0" stopOpacity="0" />
          </radialGradient>

          {/* Gradien Kuning-Hijau di bagian bawah */}
          <radialGradient id="yellowSpray" cx="44%" cy="58%" r="65%">
            <stop offset="0%" stopColor="#B8BB11" stopOpacity="0.30" />
            <stop offset="60%" stopColor="#B8BB11" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#B8BB11" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#airbrushSpray)">
          {/* Elips Pink dinaikkan ke atas-kiri agar menutupi kata 'Jangan' */}
          <ellipse
            cx="450"
            cy="190"
            rx="420"
            ry="160"
            fill="url(#pinkSpray)"
            filter="blur(6px)"
          />
          {/* Elips Kuning-Hijau menaungi baris bawah 'Suruh kita aja.' */}
          <ellipse
            cx="400"
            cy="240"
            rx="430"
            ry="170"
            fill="url(#yellowSpray)"
            filter="blur(8px)"
          />
        </g>
      </svg>

      {/* ── Konten Tengah ── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl mx-auto pt-32 pb-12">
        {/* Tagline italic */}
        <p className="text-brand-600 font-extrabold italic uppercase tracking-widest mb-3 text-sm sm:text-base">
          Apa Aja, Suruh Aja.
        </p>

        {/* Headline utama */}
        <h1
          className="font-extrabold tracking-tight text-stone-900 leading-[1.05]"
          style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
        >
          Jangan ribet sendiri.
        </h1>
        <h2
          className="font-extrabold tracking-tight text-brand-600 leading-[1.05]"
          style={{ fontSize: "clamp(36px, 6vw, 80px)", marginTop: "-0.03em" }}
        >
          Suruh kita aja.
        </h2>

        {/* Subtext wilayah */}
        <p className="font-bold text-stone-400 tracking-[0.45em] uppercase mt-4 text-xs sm:text-sm">
          Se- Samarinda
        </p>

        {/* ── Search / Lacak Bar dengan Efek Two-Way Mozzarella Melt (Putih + Oranye) ── */}
        <div className="w-full flex justify-center mt-28 px-4 select-none">
          <form
            onSubmit={handleTrack}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="relative inline-flex items-center justify-center flex-nowrap py-3 px-2"
          >
            {/* 1. KAPSUL INPUT PUTIH UTAMA (Tajam, Bersih, z-20) */}
            <div
              className="flex items-center gap-3 bg-white rounded-full px-5 h-[50px] border transition-colors duration-300 w-[280px] xs:w-[320px] sm:w-[380px] relative z-20 shrink-0"
              style={{
                borderColor: focused ? "#EA580C" : "#E2E8F0",
                boxShadow: focused
                  ? "0 4px 20px rgba(234, 88, 12, 0.12)"
                  : "0 2px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <RiSearchLine
                className="w-4 h-4 shrink-0 transition-colors duration-200"
                style={{ color: focused ? "#EA580C" : "#94A3B8" }}
              />
              <input
                type="text"
                placeholder="Masukkan No. Pesanan"
                value={trackId}
                onChange={(e) => setTrackId(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                className="hero-search-input flex-1 bg-transparent text-stone-800 placeholder:text-stone-400 text-xs sm:text-sm font-semibold outline-none border-none ring-0 focus:ring-0 focus:outline-none"
              />
            </div>

            {/* 2. ZONA EKSPANSI TOMBOL & JEMBATAN LELEHAN DUA WARNA */}
            <div
              className="group relative flex items-center shrink-0 z-10"
              style={{
                width: isOpen ? "92px" : "0px",
                marginLeft: isOpen ? "14px" : "0px",
                visibility: animPhase === "idle" ? "hidden" : "visible",
                pointerEvents: isOpen ? "auto" : "none",
                transition: isOpen
                  ? "width 850ms cubic-bezier(0.16, 1, 0.3, 1), margin-left 850ms cubic-bezier(0.16, 1, 0.3, 1)"
                  : "width 760ms cubic-bezier(0.4, 0, 0.2, 1), margin-left 760ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {/* ── PANGGUNG GOOEY FILTER (Filter TIDAK PERNAH dimatikan saat open agar 0% flicker) ── */}
              <div
                className="absolute pointer-events-none flex items-center"
                style={{
                  left: "-72px",
                  right: "-18px",
                  top: "-16px",
                  bottom: "-16px",
                  filter: "url(#gooey-mozza)",
                  willChange: "transform",
                }}
              >
                {/* A. Jangkar Putih di Ujung Kanan Input */}
                <div
                  className={`absolute left-[14px] w-[58px] h-[48px] bg-white rounded-full ${
                    animPhase === "open"
                      ? "mozza-anchor-enter"
                      : animPhase === "closing"
                      ? "mozza-anchor-exit"
                      : "opacity-0"
                  }`}
                />

                {/* B. Tetesan Mozzarella PUTIH */}
                <div
                  className={`absolute left-[46px] w-[34px] h-[34px] bg-[#FFFDFB] rounded-full ${
                    animPhase === "open"
                      ? "mozza-white-enter"
                      : animPhase === "closing"
                      ? "mozza-white-exit"
                      : "opacity-0 scale-0"
                  }`}
                />

                {/* C. Tetesan Mozzarella ORANYE */}
                <div
                  className={`absolute left-[72px] w-[34px] h-[34px] bg-brand-600 rounded-full ${
                    animPhase === "open"
                      ? "mozza-orange-enter"
                      : animPhase === "closing"
                      ? "mozza-orange-exit"
                      : "opacity-0 scale-0"
                  }`}
                />

                {/* D. Badan Utama Tombol Oranye (Tetap menjadi visual utama tombol tanpa pernah ditukar) */}
                <div
                  className={`absolute left-[72px] w-[92px] h-[46px] bg-brand-600 group-hover:bg-brand-700 transition-colors duration-150 rounded-full ${
                    animPhase === "open"
                      ? "mozza-btn-enter"
                      : animPhase === "closing"
                      ? "mozza-btn-exit"
                      : "opacity-0"
                  }`}
                />
              </div>

              {/* 3. TOMBOL INTERAKTIF & TEKS TAJAM "Lacak" (Selalu bg-transparent agar tidak pernah ngedip) */}
              <button
                type="submit"
                tabIndex={isOpen ? 0 : -1}
                className={`relative z-20 w-[92px] h-[46px] rounded-full bg-transparent text-white font-bold text-xs sm:text-sm select-none cursor-pointer flex items-center justify-center active:scale-95 transition-transform duration-150 ${
                  animPhase === "open"
                    ? "mozza-btn-enter"
                    : animPhase === "closing"
                    ? "mozza-btn-exit"
                    : "opacity-0"
                }`}
              >
                Lacak
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
