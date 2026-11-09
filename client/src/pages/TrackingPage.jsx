import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { formatRupiah } from '../lib/utils';
import StatusStepper from '../components/tracking/StatusStepper';
import QRISContainer from '../components/tracking/QRISContainer';
import WhatsAppSmartButton from '../components/tracking/WhatsAppSmartButton';
import RefundClaimModal from '../components/tracking/RefundClaimModal';
import ModernConfirmDialog from '../components/ui/ModernConfirmDialog';
import ModernAlertDialog from '../components/ui/ModernAlertDialog';
import {
  ArrowLeft,
  Copy,
  Check,
  Bike,
  MapPin,
  Clock,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// Web Audio API Synthesizer for instant notification chime ("Ting!")
function playChimeSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.15); // A6 note

    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch (e) {
    // Audio context may be restricted by autoplay policy
  }
}

export default function TrackingPage() {
  const { nanoId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [actionError, setActionError] = useState(null);
  const previousStatusRef = useRef(null);

  const fetchOrder = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);
      const res = await api.get(`/orders/${nanoId}`);
      if (res.data?.data) {
        const fresh = res.data.data;
        // Deteksi perubahan status -> mainkan suara Ting!
        if (
          previousStatusRef.current &&
          previousStatusRef.current !== fresh.status
        ) {
          playChimeSound();
        }
        previousStatusRef.current = fresh.status;
        setOrder(fresh);
        setError(null);
      }
    } catch (err) {
      setError(err.message || 'Gagal memuat status pesanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Polling setiap 6 detik
    const timer = setInterval(() => {
      fetchOrder();
    }, 6000);
    return () => clearInterval(timer);
  }, [nanoId]);

  const handleCancelOrder = async () => {
    try {
      await api.patch(`/orders/${nanoId}/cancel`);
      setShowCancelConfirm(false);
      await fetchOrder();
    } catch (err) {
      setShowCancelConfirm(false);
      setActionError(err.message || 'Pesanan gagal dibatalkan.');
    }
  };

  const copyResi = () => {
    navigator.clipboard.writeText(nanoId);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-bold mt-3">
          Memuat data resi pelacakan {nanoId}...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-charcoal-900">Pesanan Tidak Ditemukan</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Nomor resi "{nanoId}" tidak tercatat di sistem kami atau terjadi kesalahan jaringan.
        </p>
        <Link
          to="/"
          className="text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2.5 rounded-xl"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal-900 pb-20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-charcoal-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Beranda</span>
          </Link>
          <button
            onClick={() => fetchOrder(true)}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-charcoal-900 bg-slate-100 px-2.5 py-1.5 rounded-lg transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {/* Resi Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Nomor Resi Pelacakan
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black text-brand-600 tracking-tight font-mono">
                {order.nano_id}
              </span>
              <button
                type="button"
                onClick={copyResi}
                aria-label="Salin nomor resi"
                className="p-1.5 text-slate-400 hover:text-charcoal-900 rounded-lg hover:bg-slate-100 transition"
                title="Salin Resi"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:items-end">
            <span className="text-[11px] text-slate-400 font-medium">Pemesan:</span>
            <span className="text-xs font-bold text-charcoal-900">
              {order.customer_name} ({order.customer_phone_masked})
            </span>
          </div>
        </div>

        {/* Status Stepper Card */}
        <StatusStepper
          status={order.status}
          paymentMethod={order.payment_method}
        />

        {/* Dynamic QRIS Box (If awaiting payment) */}
        {order.status === 'AWAITING_PAYMENT' && (
          <QRISContainer
            nanoId={order.nano_id}
            qrisUrl={order.qris_qr_url}
            finalPrice={order.final_price}
            expiryAt={order.payment_expiry_at}
            onPaymentSuccess={() => fetchOrder()}
          />
        )}

        {/* Assigned Courier / Mitra Card */}
        {order.assigned_mitra && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Mitra Kurir Bertugas
                </span>
                <span className="text-sm font-extrabold text-emerald-950">
                  {order.assigned_mitra.name}
                </span>
                <span className="text-xs text-emerald-800 block">
                  Kontak: {order.assigned_mitra.phone}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary Details Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
            Rincian Pengantaran
          </h3>

          <div className="space-y-2">
            {order.pickup_address && (
              <div className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  A
                </span>
                <div>
                  <span className="text-slate-400 block text-[10px]">Titik Jemput/Toko:</span>
                  <span className="font-semibold text-slate-800">{order.pickup_address}</span>
                </div>
              </div>
            )}

            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                B
              </span>
              <div>
                <span className="text-slate-400 block text-[10px]">Titik Pengantaran:</span>
                <span className="font-semibold text-slate-800">{order.dropoff_address}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-slate-600">
            <span>Metode Pembayaran:</span>
            <span className="font-bold text-charcoal-900">{order.payment_method}</span>
          </div>

          <div className="flex justify-between items-center text-slate-600">
            <span>Status Pembayaran:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                order.payment_status === 'PAID'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.payment_status === 'REFUNDED'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {order.payment_status}
            </span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-slate-100">
            <span className="font-bold text-slate-800">Total Tagihan Final:</span>
            <span className="text-lg font-black text-brand-600">
              {formatRupiah(order.final_price)}
            </span>
          </div>
        </div>

        {order.status === 'PENDING_REVIEW' && (
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="w-full py-3 rounded-xl border border-red-200 bg-white text-red-700 hover:bg-red-50 font-bold text-xs transition active:scale-95"
          >
            Batalkan Pesanan
          </button>
        )}

        {/* WhatsApp Smart Link Assistance */}
        <WhatsAppSmartButton
          nanoId={order.nano_id}
          smartLink={order.whatsapp_smart_link}
        />

        {/* Refund is available only for eligible paid Titip Beli orders. */}
        <div className="flex gap-2 pt-1">

          {order.service_type === 'titip_beli' && order.payment_status === 'PAID' && ['CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS'].includes(order.status) && (
            <button
              type="button"
              onClick={() => setShowRefundModal(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs shadow-sm transition"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Ajukan Refund (Jika Barang Tidak Tersedia)</span>
            </button>
          )}
        </div>
      </main>

      {/* Refund Claim Modal */}
      {showRefundModal && (
        <RefundClaimModal
          nanoId={order.nano_id}
          finalPrice={order.final_price}
          onClose={() => setShowRefundModal(false)}
          onSuccess={() => {
            setShowRefundModal(false);
            fetchOrder();
          }}
        />
      )}

      {/* Modern Cancel Order Confirmation */}
      <ModernConfirmDialog
        isOpen={showCancelConfirm}
        title="Batalkan Pesanan Ini?"
        message="Pembatalan mandiri hanya dapat dilakukan saat pesanan masih berstatus Menunggu Konfirmasi Admin."
        confirmLabel="Ya, Batalkan"
        cancelLabel="Kembali"
        variant="danger"
        onConfirm={handleCancelOrder}
        onCancel={() => setShowCancelConfirm(false)}
      />

      {/* Action Error Alert */}
      <ModernAlertDialog
        isOpen={!!actionError}
        title="Pemberitahuan"
        message={actionError}
        variant="error"
        onClose={() => setActionError(null)}
      />
    </div>
  );
}
