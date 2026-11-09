import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import { formatRupiah } from '../../lib/utils';
import OrderTable from '../../components/admin/OrderTable';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import AssignMitraDialog from '../../components/admin/AssignMitraDialog';
import ManualOrderModal from '../../components/admin/ManualOrderModal';
import ModernConfirmDialog from '../../components/ui/ModernConfirmDialog';
import ModernAlertDialog from '../../components/ui/ModernAlertDialog';
import {
  Download,
  RefreshCw,
  LogOut,
  Bell,
  Clock,
  Bike,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Plus,
} from 'lucide-react';

function playAlertSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (e) {}
}

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    awaiting_payment: 0,
    active: 0,
    completed: 0,
    refund_requested: 0,
    revenue_idr: 0,
  });
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [selectedAssignOrder, setSelectedAssignOrder] = useState(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const [alertModal, setAlertModal] = useState(null);
  const previousOrderCountRef = useRef(0);
  const navigate = useNavigate();

  // Guard: check if admin token exists
  useEffect(() => {
    const token = localStorage.getItem('disuruhsuruh_admin_token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const fetchData = async (isManual = false) => {
    try {
      if (isManual) setLoading(true);

      const [ordersRes, statsRes] = await Promise.all([
        api.get('/admin/orders'),
        api.get('/admin/stats'),
      ]);

      const fetchedOrders = ordersRes.data?.data?.orders || [];
      const fetchedStats = statsRes.data?.data || stats;

      // Deteksi pesanan baru -> bunyikan chime alert!
      if (
        previousOrderCountRef.current > 0 &&
        fetchedOrders.length > previousOrderCountRef.current
      ) {
        playAlertSound();
      }
      previousOrderCountRef.current = fetchedOrders.length;

      setOrders(fetchedOrders);
      setStats(fetchedStats);
    } catch (err) {
      if (err.message?.includes('Akses ditolak') || err.message?.includes('kadaluarsa')) {
        localStorage.removeItem('disuruhsuruh_admin_token');
        navigate('/admin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 7000); // Polling otomatis setiap 7 detik
    return () => clearInterval(interval);
  }, []);

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/admin/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `disuruhsuruh-rekap-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setAlertModal({
        title: 'Gagal Unduh Rekap CSV',
        message: err.message || 'Terjadi gangguan saat mengunduh data pesanan.',
        variant: 'error',
      });
    }
  };

  const handleCompleteOrder = (order) => {
    const nextStatus = order.status === 'MITRA_ASSIGNED' || order.status === 'PAYMENT_CONFIRMED'
      ? (order.status === 'PAYMENT_CONFIRMED' ? 'MITRA_ASSIGNED' : 'IN_PROGRESS')
      : 'COMPLETED';
    const actionLabel = nextStatus === 'IN_PROGRESS'
      ? 'memulai pengerjaan'
      : nextStatus === 'MITRA_ASSIGNED'
      ? 'menugaskan mitra kurir'
      : 'menyelesaikan pesanan';
    const confirmButtonText = nextStatus === 'IN_PROGRESS'
      ? 'Mulai Pengerjaan'
      : nextStatus === 'COMPLETED'
      ? 'Selesaikan Pesanan'
      : 'Lanjutkan';

    setConfirmModal({
      title: 'Konfirmasi Perubahan Status',
      message: `Konfirmasi untuk ${actionLabel} pada pesanan resi ${order.nano_id}?`,
      confirmLabel: confirmButtonText,
      variant: 'brand',
      onConfirm: async () => {
        try {
          await api.patch(`/admin/orders/${order.id}/status`, {
            status: nextStatus,
          });
          setConfirmModal(null);
          fetchData();
        } catch (err) {
          setConfirmModal(null);
          setAlertModal({
            title: 'Gagal Memperbarui Status',
            message: err.message || 'Terjadi kendala saat mengubah status pesanan.',
            variant: 'error',
          });
        }
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('disuruhsuruh_admin_token');
    navigate('/admin');
  };

  // Filter tab
  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'PENDING') return o.status === 'PENDING_REVIEW';
    if (activeTab === 'AWAITING_PAYMENT') return o.status === 'AWAITING_PAYMENT';
    if (activeTab === 'ACTIVE')
      return ['CONFIRMED', 'PAYMENT_CONFIRMED', 'MITRA_ASSIGNED', 'IN_PROGRESS'].includes(o.status);
    if (activeTab === 'COMPLETED') return o.status === 'COMPLETED';
    if (activeTab === 'REFUND') return o.status === 'REFUND_REQUESTED' || o.status === 'REFUNDED';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-100 text-charcoal-900 pb-20 font-sans">
      {/* Top Admin Navbar */}
      <header className="sticky top-0 z-30 bg-charcoal-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-black text-xl text-brand-500">
              disuruh<span className="text-white">suruh</span>
            </span>
            <span className="text-[11px] bg-charcoal-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowManualModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-xl shadow transition active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Pesanan Manual</span>
            </button>

            <button
              onClick={() => fetchData(true)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-charcoal-800 hover:bg-charcoal-700 px-3 py-2 rounded-xl transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 text-xs font-semibold bg-charcoal-800 hover:bg-charcoal-700 px-3 py-2 rounded-xl border border-charcoal-700 transition"
              title="Ekspor Rekap CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Ekspor CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-charcoal-800 transition"
              title="Keluar"
              aria-label="Keluar dari dashboard admin"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 pt-6 space-y-6">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Pending Review
              </span>
              <span className="text-xl font-black text-charcoal-900">
                {stats.pending}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Menunggu QRIS
              </span>
              <span className="text-xl font-black text-charcoal-900">
                {stats.awaiting_payment}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Sedang Jalan
              </span>
              <span className="text-xl font-black text-charcoal-900">
                {stats.active}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Selesai
              </span>
              <span className="text-xl font-black text-charcoal-900">
                {stats.completed}
              </span>
            </div>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Pembayaran Terverifikasi
              </span>
              <span className="text-lg font-black text-brand-600 truncate">
                {formatRupiah(stats.revenue_idr)}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-bold">
          {[
            { id: 'ALL', label: `Semua (${orders.length})` },
            { id: 'PENDING', label: `Pending Review (${stats.pending})` },
            { id: 'AWAITING_PAYMENT', label: `Menunggu QRIS (${stats.awaiting_payment})` },
            { id: 'ACTIVE', label: `Aktif Dikerjakan (${stats.active})` },
            { id: 'COMPLETED', label: `Selesai (${stats.completed})` },
            { id: 'REFUND', label: `Refund (${stats.refund_requested})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3.5 rounded-xl border whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <OrderTable
          orders={filteredOrders}
          onViewDetail={(order) => setSelectedDetailOrder(order)}
          onAssignMitra={(order) => setSelectedAssignOrder(order)}
          onCompleteOrder={handleCompleteOrder}
        />
      </main>

      {/* Modals */}
      {selectedDetailOrder && (
        <OrderDetailModal
          order={selectedDetailOrder}
          onClose={() => setSelectedDetailOrder(null)}
        />
      )}

      {selectedAssignOrder && (
        <AssignMitraDialog
          order={selectedAssignOrder}
          onClose={() => setSelectedAssignOrder(null)}
          onSuccess={() => {
            setSelectedAssignOrder(null);
            fetchData();
          }}
        />
      )}

      {/* Modern Pop-up / Dialogs */}
      <ManualOrderModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSuccess={() => {
          setShowManualModal(false);
          fetchData(true);
        }}
      />

      <ModernConfirmDialog
        isOpen={!!confirmModal}
        title={confirmModal?.title}
        message={confirmModal?.message}
        confirmLabel={confirmModal?.confirmLabel}
        cancelLabel={confirmModal?.cancelLabel || 'Batal'}
        variant={confirmModal?.variant || 'brand'}
        onConfirm={confirmModal?.onConfirm}
        onCancel={() => setConfirmModal(null)}
      />

      <ModernAlertDialog
        isOpen={!!alertModal}
        title={alertModal?.title}
        message={alertModal?.message}
        variant={alertModal?.variant || 'error'}
        onClose={() => setAlertModal(null)}
      />
    </div>
  );
}
