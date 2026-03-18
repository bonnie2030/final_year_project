/**
 * The `Payment` component in TypeScript React renders a secure payment page for completing matatu
 * booking payments with features like 256-bit encryption and instant processing.
 */
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import PaymentSimulation from "@/components/PaymentSimulation";
import { CreditCard, Shield, Zap, CheckCircle, BadgeCheck, PhoneCall } from "lucide-react";
import { useLocation } from 'react-router-dom';

export default function Payment() {
  const handleBack = () => {
    if (typeof window !== "undefined") window.history.back();
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const routeId = params.get('routeId') ?? undefined;
  const vehicle =
    params.get('vehicle') ??
    params.get('vehicleNumber') ??
    params.get('vehicle_number') ??
    params.get('registration_number') ??
    params.get('plateNumber') ??
    undefined;
  const routeName = params.get('routeName') ?? undefined;
  const routeFrom = params.get('from') ?? undefined;
  const routeTo = params.get('to') ?? undefined;
  const routeFare = params.get('fare') ? Number(params.get('fare')) : undefined;

  return (
    <>
      <Helmet>
        <title>Secure Payment — MatatuConnect</title>
        <meta name="description" content="Complete your matatu booking payment securely with M-PESA or card. 256-bit encryption, instant processing." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-12 sm:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <CreditCard className="h-8 w-8 sm:h-10 sm:w-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">Secure Payment</h1>
          <p className="text-base sm:text-lg opacity-95 max-w-xl mx-auto">
            Complete your payment quickly and securely with M-PESA or card
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              <span>Instant Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Verified Secure</span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-6xl mx-auto py-8 sm:py-12 px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-6 sm:gap-8 items-start">
          <section className="lg:col-span-3 bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-100">
            <div className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-semibold text-emerald-800">
                <BadgeCheck className="h-3.5 w-3.5" />
                Safe Checkout
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-semibold text-blue-800">
                <Zap className="h-3.5 w-3.5" />
                Fast Confirmation
              </span>
            </div>

            <PaymentSimulation
              initialRouteId={routeId ?? undefined}
              initialVehicleNumber={vehicle ?? undefined}
              initialRouteName={routeName}
              initialRouteFrom={routeFrom}
              initialRouteTo={routeTo}
              initialRouteFare={Number.isFinite(routeFare) ? routeFare : undefined}
              onBack={handleBack}
            />
          </section>

          <aside className="lg:col-span-2 space-y-4 sm:space-y-5">
            <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-5 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Payment Confidence</h3>
              <p className="text-sm text-slate-600 mb-4">
                Every transaction is encrypted, validated, and tied to your trip reference.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />256-bit encrypted request flow</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />M-Pesa-first local checkout</li>
                <li className="flex items-start gap-2"><CheckCircle className="h-4 w-4 text-emerald-600 mt-0.5" />Digital ticket proof after confirmation</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3">Need help while paying?</h3>
              <p className="text-sm text-slate-600 mb-4">
                If the prompt delays, retry once and confirm your phone format is `07XXXXXXXX` or `2547XXXXXXXX`.
              </p>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                <div className="flex items-center gap-2 font-semibold mb-1">
                  <PhoneCall className="h-4 w-4" />
                  Quick Assistance
                </div>
                <p className="text-xs text-blue-800">Support responds fastest when you include route, vehicle, and time of payment attempt.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-5 shadow-sm">
              <h3 className="text-base font-bold mb-2">What happens next</h3>
              <p className="text-sm text-slate-300 mb-3">After payment success, your ticket can be delivered instantly in-app and optionally to WhatsApp.</p>
              <div className="text-xs text-slate-400">Tip: Keep your transaction reference for faster support follow-up.</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
    </>
  );
}
