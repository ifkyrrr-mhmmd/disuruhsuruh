import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { OrderProvider, useOrder } from '../context/OrderContext';
import ServiceSelector from '../components/order/ServiceSelector';
import LeafletMap from '../components/map/LeafletMap';
import DynamicServiceFields from '../components/order/DynamicServiceFields';
import PriceBreakdownCard from '../components/order/PriceBreakdownCard';
import CustomerContactForm from '../components/order/CustomerContactForm';
import { ArrowLeft, Check, MapPin, Calculator, ShieldCheck } from 'lucide-react';

function OrderWizardContent() {
  const { step, setStep, serviceType, pricing } = useOrder();
  const prevStepRef = React.useRef(step);
  const isForward = step >= prevStepRef.current;

  React.useEffect(() => {
    prevStepRef.current = step;
  }, [step]);

  // Reset scroll ke puncak halaman setiap kali step berganti atau halaman dibuka
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [step]);

  const steps = [
    { num: 1, title: 'Layanan' },
    { num: 2, title: 'Lokasi & Peta' },
    { num: 3, title: 'Rincian & Bayar' },
  ];

  const sliderTransition = isForward
    ? 'right 0.35s cubic-bezier(0.1, 0.85, 0.25, 1), left 0.48s cubic-bezier(0.34, 1.25, 0.64, 1)'
    : 'left 0.35s cubic-bezier(0.1, 0.85, 0.25, 1), right 0.48s cubic-bezier(0.34, 1.25, 0.64, 1)';

  return (
    <div className="min-h-screen bg-slate-50 text-charcoal-900 pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-charcoal-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Formulir Pesanan
            </span>
          </div>
        </div>
      </header>

      {/* Stepper Progress Bar with Gooey Liquid Slider */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sticky top-14 z-20">
        <div className="max-w-xl mx-auto flex items-center justify-between relative">
          {/* 1. Base Inactive Connector Line (center horizontal circle at 48px left & right) */}
          <div className="absolute left-12 right-12 top-4 -translate-y-1/2 h-0.5 bg-slate-200 z-0">
            <div
              className="h-full bg-brand-600 transition-all duration-400"
              style={{
                width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
              }}
            />
          </div>

          {/* 2. Gooey Liquid Canvas Layer (pure orange shapes filtered by #goo) */}
          <div
            className="absolute inset-x-0 top-0 h-8 pointer-events-none z-10"
            style={{ filter: 'url(#goo)' }}
          >
            {/* Step 1 Anchor (always orange) */}
            <div
              className="absolute top-0 w-8 h-8 rounded-full bg-brand-600"
              style={{ left: '32px' }}
            />
            {/* Step 2 Anchor */}
            <div
              className="absolute top-0 w-8 h-8 rounded-full bg-brand-600 transition-all duration-300"
              style={{
                left: 'calc(50% - 16px)',
                opacity: step >= 2 ? 1 : 0,
                transform: step >= 2 ? 'scale(1)' : 'scale(0.5)',
              }}
            />
            {/* Step 3 Anchor */}
            <div
              className="absolute top-0 w-8 h-8 rounded-full bg-brand-600 transition-all duration-300"
              style={{
                left: 'calc(100% - 64px)',
                opacity: step >= 3 ? 1 : 0,
                transform: step >= 3 ? 'scale(1)' : 'scale(0.5)',
              }}
            />
            {/* Dynamic Liquid Slider Drop (stretches & slides between steps) */}
            <div
              className="absolute top-0 h-8 rounded-full bg-brand-600"
              style={{
                left: step === 1 ? '32px' : step === 2 ? 'calc(50% - 16px)' : 'calc(100% - 64px)',
                right: step === 1 ? 'calc(100% - 64px)' : step === 2 ? 'calc(50% - 16px)' : '32px',
                transition: sliderTransition,
              }}
            />
          </div>

          {/* 3. Foreground Step Buttons (sharp text & icons on top) */}
          {steps.map((st) => {
            const isCompleted = step > st.num;
            const isCurrent = step === st.num;

            return (
              <button
                type="button"
                key={st.num}
                disabled={st.num >= step}
                aria-current={isCurrent ? 'step' : undefined}
                onClick={() => st.num < step && setStep(st.num)}
                className="w-24 relative z-20 flex flex-col items-center select-none bg-transparent group cursor-pointer disabled:cursor-default"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                    step >= st.num
                      ? 'text-white bg-transparent'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 transition-colors duration-300 ${
                    isCurrent || isCompleted ? 'text-charcoal-900' : 'text-slate-400'
                  }`}
                >
                  {st.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Wizard Container */}
      <main className="max-w-3xl mx-auto px-4 pt-6">
        <div key={step} className="wizard-step-enter bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          {step === 1 && <ServiceSelector />}
          {step === 2 && <LeafletMap />}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-left">
                <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
                  Rincian Pesanan & Pembayaran
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Lengkapi rincian pesanan Anda dan periksa transparansi harga sebelum konfirmasi.
                </p>
              </div>

              {/* Dynamic inputs per service */}
              <DynamicServiceFields />

              {/* Real-time open price breakdown */}
              <PriceBreakdownCard />

              {/* Customer WhatsApp and Payment method */}
              <CustomerContactForm />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OrderPage() {
  return (
    <OrderProvider>
      <OrderWizardContent />
    </OrderProvider>
  );
}
