import React from 'react';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

export default function ModernConfirmDialog({
  isOpen,
  title = 'Konfirmasi Tindakan',
  message,
  confirmLabel = 'Lanjutkan',
  cancelLabel = 'Batal',
  variant = 'brand', // 'brand' | 'danger' | 'info'
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isInfo = variant === 'info';

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp text-center">
        {/* Icon Header */}
        <div className="flex justify-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isDanger
                ? 'bg-red-50 text-red-600 ring-8 ring-red-50/50'
                : isInfo
                ? 'bg-blue-50 text-blue-600 ring-8 ring-blue-50/50'
                : 'bg-brand-50 text-brand-600 ring-8 ring-brand-50/50'
            }`}
          >
            {isDanger ? (
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            ) : isInfo ? (
              <Info className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <CheckCircle2 className="w-6 h-6 stroke-[2.2]" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h3 className="text-base font-extrabold text-charcoal-900 tracking-tight">
            {title}
          </h3>
          {message && (
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 py-2.5 px-4 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition disabled:opacity-50"
            >
              {cancelLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl text-white transition shadow-sm disabled:opacity-50 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 active:scale-95'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-95'
            }`}
          >
            {isLoading ? 'Memproses...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
