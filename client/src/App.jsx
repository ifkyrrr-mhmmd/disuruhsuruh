import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import OrderPage from './pages/OrderPage';
import TrackingPage from './pages/TrackingPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Global SVG Gooey Filters for liquid melting effects */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <filter id="goo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="
              1 0 0 0 0  
              0 1 0 0 0  
              0 0 1 0 0  
              0 0 0 24 -9" result="goo" />
          </filter>
          {/* Global SVG Gooey Filters for two-color (White + Orange) liquid mozzarella melting */}
          <filter id="gooey-mozza" x="-35%" y="-45%" width="170%" height="190%" colorInterpolationFilters="sRGB">
            {/* 1. Blur kedua elemen (Putih & Oranye) agar warna dan alpha saling menyatu */}
            <feGaussianBlur in="SourceGraphic" stdDeviation="8.5" result="blur" />
            {/* 2. Threshold kontras tinggi pada Alpha channel agar membentuk jembatan cairan yang tajam */}
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0  
                0 1 0 0 0  
                0 0 1 0 0  
                0 0 0 28 -11"
              result="goo"
            />
            {/* 3. Kontur bayangan tipis agar tarikan cairan warna putih tetap terlihat di atas background putih */}
            <feDropShadow
              in="goo"
              dx="0"
              dy="1"
              stdDeviation="2"
              floodColor="#EA580C"
              floodOpacity="0.12"
              result="gooShadow"
            />
          </filter>
        </defs>
      </svg>
      <div className="min-h-screen bg-charcoal-50 text-charcoal-900 flex flex-col font-sans">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/track/:nanoId" element={<TrackingPage />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}
