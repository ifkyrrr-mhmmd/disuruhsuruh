import React, { useState, useEffect } from 'react';
import { formatRupiah } from '../../lib/utils';
import api from '../../lib/api';
import { QrCode, Clock, Copy, Check, AlertCircle, Loader2, Download, ExternalLink } from 'lucide-react';
import ModernAlertDialog from '../ui/ModernAlertDialog';

export default function QRISContainer({ nanoId, qrisUrl, finalPrice, expiryAt, onPaymentSuccess }) {
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [qrImageFailed, setQrImageFailed] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isQrStringCopied, setIsQrStringCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simError, setSimError] = useState(null);
  const showPaymentMock = import.meta.env.DEV && import.meta.env.VITE_ENABLE_PAYMENT_MOCK === 'true';

  const qrImageUrl = qrisUrl || (nanoId ? `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=https://simulator.sandbox.midtrans.com/qris/${nanoId}` : '');
  const rawQrPayload = qrisUrl || `https://simulator.sandbox.midtrans.com/qris/${nanoId || ''}`;

  useEffect(() => {
    if (!expiryAt) return;

    const targetTime = new Date(expiryAt).getTime();
    if (!Number.isFinite(targetTime)) return undefined;
    setTimeLeftSeconds(Math.max(0, Math.floor((targetTime - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((targetTime - Date.now()) / 1000));
      setTimeLeftSeconds(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryAt]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const hasExpiry = Boolean(expiryAt);
  const isExpired = hasExpiry && timeLeftSeconds <= 0;

  const copyAmount = () => {
    navigator.clipboard.writeText(String(finalPrice));
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const copyQrCode = () => {
    navigator.clipboard.writeText(rawQrPayload);
    setIsQrStringCopied(true);
    setTimeout(() => setIsQrStringCopied(false), 2000);
  };

  const downloadQrImage = async () => {
    if (!qrImageUrl) return;
    try {
      setIsDownloading(true);
      const res = await fetch(qrImageUrl);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `QRIS-disuruhsuruh-${nanoId || 'tagihan'}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch {
      // Fallback direct open jika blob gagal
      window.open(qrImageUrl, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSimulatePayment = async () => {
    try {
      setSimulating(true);
      await api.post('/payments/notification', {
        order_id: nanoId,
        transaction_status: 'settlement',
        gross_amount: String(finalPrice),
        is_test_mock: true,
      });
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
    } catch (err) {
      setSimError(err.message || 'Gagal memproses simulasi pembayaran sandbox.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-brand-500 shadow-md p-5 sm:p-6 text-center space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-brand-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
            Pembayaran QRIS
          </span>
        </div>
        
        {/* Countdown Badge */}
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
            isExpired
              ? 'bg-red-100 text-red-700'
              : timeLeftSeconds < 180
              ? 'bg-amber-100 text-amber-800'
              : 'bg-brand-50 text-brand-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>
            {!hasExpiry ? 'Menunggu aktivasi' : isExpired
              ? 'Kadaluarsa'
              : `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`}
          </span>
        </div>
      </div>

      {/* Bill Amount */}
      <div className="py-2">
        <span className="text-xs text-slate-500 font-medium block">
          Nominal Pembayaran Terkunci:
        </span>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-3xl font-black text-charcoal-900 tracking-tight">
            {formatRupiah(finalPrice)}
          </span>
          <button
            type="button"
            onClick={copyAmount}
            className="p-1.5 text-slate-400 hover:text-charcoal-900 rounded-lg hover:bg-slate-100 transition"
            title="Salin Angka Tagihan"
            aria-label="Salin nominal pembayaran"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col items-center justify-center py-2">
        <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-inner max-w-[220px]">
          {(qrisUrl || (showPaymentMock && nanoId)) && !qrImageFailed ? (
            <img
              src={qrImageUrl}
              alt="QRIS disuruhsuruh"
              className="w-full h-auto aspect-square object-contain rounded-lg shadow-sm"
              onError={() => setQrImageFailed(true)}
            />
          ) : (
            <div className="w-48 h-48 bg-slate-50 rounded-lg flex flex-col items-center justify-center p-4 text-slate-600 text-xs" role="status">
              <QrCode className="w-12 h-12 stroke-1 mb-2 text-slate-400" />
              <span className="font-semibold">QRIS belum tersedia</span>
              <span className="mt-1 text-center text-[11px] text-slate-400">Hubungi admin jika kode pembayaran tidak muncul.</span>
            </div>
          )}
        </div>

        {/* Action Buttons: Unduh Gambar & Salin Kode */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={downloadQrImage}
            disabled={isDownloading || !qrImageUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Mengunduh...' : 'Unduh Gambar QR'}</span>
          </button>

          <button
            type="button"
            onClick={copyQrCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-xs transition"
          >
            {isQrStringCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isQrStringCopied ? 'Kode Tersalin!' : 'Salin Kode QRIS'}</span>
          </button>
        </div>

        {showPaymentMock ? (
          <div className="space-y-1.5 mt-3">
            <span className="text-[10px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold inline-block">
              Mode Sandbox (Uji Coba Pembayaran)
            </span>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
              Aplikasi perbankan asli (SeaBank, BCA, GoPay) menolak scan QR sandbox karena belum terkoneksi ke BI-Switching resmi. Gunakan simulator resmi Midtrans atau tombol uji coba otomatis di bawah.
            </p>
            <a
              href="https://simulator.sandbox.midtrans.com/qris/index"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 underline underline-offset-2"
            >
              <span>Buka Simulator QRIS Midtrans</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500 mt-2 block font-medium">
            Gunakan aplikasi bank atau dompet digital yang mendukung QRIS.
          </span>
        )}
      </div>

      {/* Sandbox Payment Simulation Button */}
      {showPaymentMock && <div className="pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleSimulatePayment}
          disabled={simulating || isExpired || !hasExpiry}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50"
        >
          {simulating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memproses Simulasi Pembayaran...</span>
            </>
          ) : (
            <span>Simulasi Pembayaran Lunas (1-Click Sandbox Test)</span>
          )}
        </button>
        <span className="text-[10px] text-slate-400 mt-1 block">
          Klik tombol di atas untuk menguji deteksi pembayaran otomatis tanpa memotong uang asli.
        </span>
      </div>}

      {isExpired && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center gap-2 text-xs text-red-700 font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>Batas waktu pembayaran telah habis. Silakan hubungi admin via WhatsApp untuk perpanjangan.</span>
        </div>
      )}

      {/* Modern Alert Dialog for Sandbox Errors */}
      <ModernAlertDialog
        isOpen={!!simError}
        title="Kendala Pembayaran"
        message={simError}
        variant="error"
        onClose={() => setSimError(null)}
      />
    </div>
  );
}
