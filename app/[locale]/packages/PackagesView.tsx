'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, Sparkles, Zap, Wallet, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { envelopeList, fetchClient, getPackages } from '@/lib/api/client';

interface ApiPackage {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
  currency_label?: string;
  badge?: string;
  features?: string[];
  [key: string]: any;
}

interface PackagesViewProps {
  initialPackages?: ApiPackage[];
}

const PackagesView: React.FC<PackagesViewProps> = ({ initialPackages = [] }) => {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';

  const [role, setRole] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [subscribedPackage, setSubscribedPackage] = useState<string | null>(null);
  const [packages, setPackages] = useState<any[]>(initialPackages);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof window === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const userRole = getCookie('client_type');
    setRole(userRole);

    // If user is a logged-in normal buyer, redirect to home. Show to guests and companies.
    if (userRole && userRole !== 'company') {
      router.push(`/${locale}`);
      return;
    }

    // If initialPackages is empty, fetch packages dynamically
    if (!initialPackages || initialPackages.length === 0) {
      getPackages(locale)
        .then((res: any) => {
          const list = envelopeList(res);
          if (list && list.length > 0) {
            setPackages(list);
          }
        })
        .catch(() => {});
    }

    // Fetch real wallet data from client/wallet with token
    const token = getCookie('token');
    if (token) {
      fetchClient('client/wallet', locale, { token })
        .then((res: any) => {
          const walBalance = res?.data?.balance ?? res?.balance;
          if (walBalance !== undefined && walBalance !== null) {
            setBalance(Number(walBalance));
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch wallet from client/wallet:', err);
        });
    }
  }, [locale, router, initialPackages]);

  const handleSubscribe = async (pkg: any) => {
    const getCookie = (name: string) => {
      if (typeof window === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    const token = getCookie('token');
    if (!token) {
      toast.error(isAr ? 'يرجى تسجيل الدخول أو إنشاء حساب كشركة للاشتراك.' : 'Please login or register as a company to subscribe.');
      setTimeout(() => router.push(`/${locale}/login`), 2000);
      return;
    }

    const pkgIdStr = String(pkg.id);
    setLoadingId(pkgIdStr);
    try {
      const res = await fetchClient('client/subscriptions', locale, {
        method: 'POST',
        body: { package_id: Number(pkg.id) },
        token,
      });
      setBalance(Number(res?.data?.balance ?? balance - (pkg.price || 0)));
      setSubscribedPackage(pkgIdStr);
      const successMessage = res?.message || res?.data?.message || (
        isAr
          ? `تهانينا! تم الاشتراك في باقة ${pkg.name} بنجاح.`
          : `Congratulations! Subscribed to ${pkg.name} successfully.`
      );
      toast.success(successMessage);
    } catch (error: any) {
      const message =
        error?.data?.message ||
        (isAr
          ? 'رصيد محفظتك غير كافٍ للاشتراك بهذه الباقة. يرجى شحن المحفظة أولاً.'
          : 'Insufficient wallet balance. Please top up your wallet first.');
      toast.error(message);
    } finally {
      setLoadingId(null);
    }
  };

  const palettes = [
    { id: 'basic', color: '#B45309', icon: <ShieldCheck size={28} className="text-[#B45309]" />, bgGradient: 'from-[#ffffff] to-[#fcfaf4]' },
    { id: 'silver', color: '#0E6B58', icon: <Zap size={28} className="text-[#0E6B58]" />, bgGradient: 'from-[#f0f9f6] to-[#ffffff]' },
    { id: 'gold', color: '#C89B3C', icon: <Sparkles size={28} className="text-[#C89B3C]" />, bgGradient: 'from-[#fbf7ee] to-[#ffffff]' },
  ];

  const formattedPackages = packages.map((pkg, index) => {
    const theme = palettes[index % palettes.length];
    return {
      ...pkg,
      ...theme,
      id: String(pkg.id),
      name: pkg.name || (isAr ? 'الباقة المميزة' : 'Premium Package'),
      price: pkg.price || 0,
      currency: pkg.currency_label || (isAr ? (pkg.currency === 'USD' ? 'دولار' : 'درهم') : (pkg.currency || 'AED')),
      badge: pkg.badge,
      features: pkg.features || [],
    };
  });

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F6F4EE] py-16 lg:py-24 px-4 relative overflow-hidden">

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#0E6B58]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#C89B3C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
            <Sparkles size={14} />
            {isAr ? 'باقات تميز المعلنين والشركات' : 'Company & Seller Packages'}
          </span>

          <h1 className="text-3xl lg:text-5xl font-black text-[#101820] leading-tight">
            {isAr ? 'اختر الباقة المناسبة وسوّق لعقاراتك لآلاف العملاء' : 'Choose the best package for your listings'}
          </h1>

          <p className="mt-4 text-[#63756F] text-base leading-7 max-w-2xl mx-auto">
            {isAr
              ? 'تتيح لك باقات العمران الترويجية إيصال إعلاناتك العقارية إلى شريحة واسعة من المشترين والمستثمرين الجادين بسرعة وسهولة.'
              : 'Al Omran packages help you showcase your properties to thousands of active buyers and investors.'}
          </p>

          {/* Wallet Balance Bar */}
          <div className="mt-8 inline-flex items-center gap-5 bg-white border border-[#E7E1D6] rounded-[24px] px-6 py-4 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center font-bold">
              <Wallet size={24} />
            </div>
            <div className={isAr ? 'text-right' : 'text-left'}>
              <p className="text-xs text-[#71807B] font-bold">{isAr ? 'رصيد محفظتك الحالي' : 'Current Wallet Balance'}</p>
              <h3 className="text-xl font-black text-[#101820] mt-0.5">
                {Number(balance || 0).toLocaleString(isAr ? 'ar-EG' : 'en-US')}{' '}
                <span className="text-sm font-bold text-[#0E6B58]">{isAr ? 'درهم إماراتي' : 'AED'}</span>
              </h3>
            </div>
            <button
              onClick={() => router.push(`/${locale}/wallet`)}
              className="bg-[#0E6B58] hover:bg-[#095746] text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 shadow-sm"
            >
              {isAr ? 'شحن المحفظة' : 'Top Up Wallet'}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-4 relative z-50">
          {formattedPackages.map((pkg) => {
            const pkgIdStr = String(pkg.id);
            const isActive = subscribedPackage === pkgIdStr;
            const isHighlighted = pkg.id === "2" || pkg.badge;

            return (
              <div
                key={pkgIdStr}
                className={
                  "relative flex flex-col justify-between px-8 rounded-[32px] transition-all duration-300 bg-gradient-to-b " +
                  pkg.bgGradient +
                  (isHighlighted
                    ? " py-12 shadow-xl md:-translate-y-4 md:scale-105 border-2 border-[#0E6B58] z-20"
                    : " py-8 shadow-sm border border-[#E7E1D6] z-10 hover:shadow-lg")
                }
              >
                {/* Badge */}
                {(pkg.badge || isActive) && (
                  <div className="absolute -top-3.5 left-0 right-0 flex justify-center pointer-events-none">
                    <span
                      className="inline-flex whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md"
                      style={{ backgroundColor: isActive ? '#0E6B58' : pkg.color }}
                    >
                      {isActive ? (isAr ? 'باقة نشطة حالياً' : 'Active Plan') : pkg.badge}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#E7E1D6] flex items-center justify-center mb-6 shadow-sm">
                    {pkg.icon}
                  </div>

                  <h3 className="text-xl font-black mb-2 text-[#101820]">
                    {pkg.name}
                  </h3>

                  {/* Price */}
                  <div className="my-6 flex items-baseline">
                    <span className="text-4xl font-black text-[#101820]">
                      {Number(pkg.price || 0).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                    </span>
                    <span className="text-[#63756F] text-xs font-bold mx-2">
                      {pkg.currency} {isAr ? '/ شهرياً' : '/ month'}
                    </span>
                  </div>

                  <div className="w-full h-px my-6 bg-[#E7E1D6]" />

                  {/* Features */}
                  <ul className="space-y-4">
                    {pkg.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                         <span className="w-5 h-5 rounded-full bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-xs font-bold text-[#40524C] leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscription Action Button */}
                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    className={
                      "w-full py-4 rounded-xl font-black text-xs transition-colors duration-200 shadow-md border-2 cursor-pointer " +
                      (isActive
                        ? "bg-[#EEF6F3] text-[#0E6B58] border-[#0E6B58]"
                        : isHighlighted
                        ? "bg-[#0E6B58] text-white border-[#0E6B58] hover:bg-[#095746] hover:border-[#095746]"
                        : "bg-white text-[#101820] border-[#E7E1D6] hover:border-[#0E6B58] hover:bg-[#0E6B58] hover:text-white")
                    }
                  >
                    {loadingId === pkgIdStr
                      ? (isAr ? 'جاري الاشتراك...' : 'Subscribing...')
                      : isActive
                      ? (isAr ? 'باقة نشطة' : 'Subscribed')
                      : (isAr ? 'اشترك في الباقة الآن' : 'Subscribe Now')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-16 text-center text-sm text-[#63756F] font-bold">
          {isAr
            ? 'تطبق الشروط والأحكام. هل تحتاج إلى خطة مخصصة كشركة عقارية؟ '
            : 'Terms apply. Need a custom plan for your real estate agency? '}
          <a
            href={`/${locale}/technical-support`}
            className="text-[#0E6B58] underline hover:text-[#095746] transition-all ml-1"
          >
            {isAr ? 'تواصل مع الدعم الفني' : 'Contact Support'}
          </a>
        </div>
      </div>
    </div>
  );
};

export default PackagesView;
