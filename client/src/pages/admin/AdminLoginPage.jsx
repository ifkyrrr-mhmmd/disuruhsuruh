import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../lib/api';
import { Lock, ArrowLeft, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post('/admin/login', { pin });
      if (res.data?.data?.token) {
        localStorage.setItem('disuruhsuruh_admin_token', res.data.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.message || 'PIN admin salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-charcoal-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda disuruhsuruh</span>
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center font-bold text-xl mx-auto shadow-md">
          ds
        </div>
        <h2 className="mt-4 text-center text-2xl font-extrabold text-charcoal-900 tracking-tight">
          Portal Operasional Admin
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Khusus Kak Gani & tim admin disuruhsuruh Samarinda
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="admin-pin" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                PIN Akses Admin:
              </label>
              <div className="relative">
                <input
                  id="admin-pin"
                  type="password"
                  placeholder="Masukkan PIN admin"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full text-center tracking-[0.3em] font-mono text-xl py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  autoFocus
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow font-bold text-sm text-white bg-charcoal-900 hover:bg-black focus:outline-none transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <span>Masuk ke Dasbor Operasional</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Koneksi internal terenkripsi JWT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
