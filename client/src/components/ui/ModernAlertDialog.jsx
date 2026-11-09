import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

export default function ModernAlertDialog({
  isOpen,
  title = 'Pemberitahuan',
  message,
  buttonLabel = 'Mengerti',
  variant = 'error', // 'error' | 'success' | 'info'
  onClose,
}) {
  if (!isOpen) return null;

  const isError = variant === 'error';
  const isSuccess = variant === 'success';

  return (
    <div className="fixed inset-0 z-50 bg-charcoal-950/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              isError
                ? 'bg-red-50 text-red-600 ring-8 ring-red-50/50'
                : isSuccess
                ? 'bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50'
                : 'bg-brand-50 text-brand-600 ring-8 ring-brand-50/50'
            }`}
          >
            {isError ? (
              <AlertCircle className="w-6 h-6 stroke-[2.2]" />
            ) : isSuccess ? (
              <CheckCircle className="w-6 h-6 stroke-[2.2]" />
            ) : (
              <Info className="w-6 h-6 stroke-[2.2]" />
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

        {/* Action Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-charcoal-900 hover:bg-black rounded-xl transition shadow-sm active:scale-95"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
