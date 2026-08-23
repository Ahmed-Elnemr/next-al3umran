'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { envelopeList, fetchClient, getPackages } from '../../../src/lib/api/client';

interface Package {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  featuresAr: string[];
  featuresEn: string[];
  icon: React.ReactNode;
  color: string;
  badgeAr?: string;
  badgeEn?: string;
}

const PackagesPage = () => {
  const locale = useLocale();
  const router = useRouter();
  const isAr = locale === 'ar';
  
  const [role, setRole] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [subscribedPackage, setSubscribedPackage] = useState<string | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    // Read role and balance from cookies and localStorage
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    const userRole = getCookie('client_type');
    setRole(userRole);

    // If role is not seller, redirect to home
    if (userRole && userRole !== 'company') {
      router.push(`/${locale}`);
      return;
    }

    // Load balance
    const savedBalance = localStorage.getItem('alomran_wallet_balance');
    if (savedBalance) {
      setBalance(parseFloat(savedBalance));
    } else {
      localStorage.setItem('alomran_wallet_balance', '1000');
      setBalance(1000); // Default test balance
    }

    // Load active package
    const token = getCookie('token');
    getPackages(locale)
      .then((res) => {
        const palettes = [
          { color: '#B45309', icon: <ShieldCheck size={28} className="text-[#B45309]" /> },
          { color: '#0E6B58', icon: <Zap size={28} className="text-[#0E6B58]" /> },
          { color: '#C89B3C', icon: <Sparkles size={28} className="text-[#C89B3C]" /> },
        ];
        setPackages(
          envelopeList(res).map((item: any, index: number) => ({
            id: String(item.id),
            nameAr: item.name,
            nameEn: item.name,
            price: item.price,
            color: palettes[index % palettes.length].color,
            icon: palettes[index % palettes.length].icon,
            badgeAr: item.badge,
            badgeEn: item.badge,
            featuresAr: item.features || [],
            featuresEn: item.features || [],
          }))
        );
      })
      .catch(() => setPackages([]));

    if (token) {
      fetchClient('wallet', locale, { token })
        .then((res) => {
          if (res?.data?.balance !== undefined) {
            setBalance(Number(res.data.balance));
          }
        })
        .catch(() => {});
    }
  }, [locale, router]);

  const handleSubscribe = async (pkg: Package) => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };
    const token = getCookie('token');
    if (!token) {
      router.push(`/${locale}/login`);
      return;
    }

    setLoadingId(pkg.id);
    try {
      const res = await fetchClient('subscriptions', locale, {
        method: 'POST',
        body: { package_id: Number(pkg.id) },
        token,
      });
      setBalance(Number(res?.data?.balance ?? balance - pkg.price));
      setSubscribedPackage(pkg.id);
      toast.success(
        isAr
          ? `تهانينا! تم الاشتراك في باقة ${pkg.nameAr} بنجاح.`
          : `Congratulations! Subscribed to ${pkg.nameEn} successfully.`
      );
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

  if (role && role !== 'company') {
    return null; // Will redirect
  }

  return (
    <div dir={isAr ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F6F4EE] py-20 px-4">
      <ToastContainer position="bottom-right" />
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#0E6B58] bg-[#EEF6F3] px-4 py-2 rounded-full">
            {isAr ? 'باقات الاشتراك العقاري' : 'Premium Subscriptions'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mt-6 leading-tight">
            {isAr ? 'اشترك في باقات العمران وتميز!' : 'Choose Your Premium Plan'}
          </h1>
          <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
            {isAr 
              ? 'اختر الخطة المناسبة لعرض وتسويق عقاراتك لآلاف العملاء المهتمين يومياً.' 
              : 'Unlock advanced listing tools and reach thousands of serious clients daily.'}
          </p>

          {/* Wallet Balance Bar */}
          <div className="mt-8 inline-flex items-center gap-4 bg-white border border-[#E2ECE8] rounded-[24px] px-6 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-2xl bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center font-bold">
              💰
            </div>
            <div className="text-start">
              <p className="text-xs text-gray-400 font-semibold">{isAr ? 'رصيد محفظتك الحالي' : 'Wallet Balance'}</p>
              <h3 className="text-xl font-black text-gray-900 mt-0.5">
                {balance} <span className="text-sm font-bold text-[#0E6B58]">{isAr ? 'درهم إماراتي' : 'AED'}</span>
              </h3>
            </div>
            <button
              onClick={() => router.push(`/${locale}/wallet`)}
              className="bg-[#0E6B58] hover:bg-[#095746] text-white px-4 py-2 rounded-xl text-xs font-black transition-all duration-200"
            >
              {isAr ? 'شحن المحفظة' : 'Top Up'}
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8">
          {packages.map((pkg) => {
            const isActive = subscribedPackage === pkg.id;
            
            return (
              <div 
                key={pkg.id} 
                className={"relative flex flex-col justify-between px-8 rounded-[32px] transition-all duration-300 bg-gradient-to-b " + pkg.bgGradient + (pkg.id === "silver" ? " py-12 shadow-[0_30px_60px_rgba(14,107,88,0.15)] md:-translate-y-4 md:scale-105 z-10" : " py-8 shadow-sm hover:shadow-xl hover:-translate-y-1 z-0")} style={{ borderColor: (isActive || pkg.id === "silver") ? pkg.color : pkg.color + '40', borderWidth: (isActive || pkg.id === "silver") ? '2px' : '1px' }}
              >
                {/* Badges */}
                {(pkg.badgeAr || isActive) && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex justify-center z-20">
                    <span className="inline-flex whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-lg" style={{ backgroundColor: pkg.color }}>
                      {isActive 
                        ? (isAr ? 'نشطة حالياً' : 'Active Plan') 
                        : (isAr ? pkg.badgeAr : pkg.badgeEn)}
                    </span>
                  </div>
                )}

                {/* Card Title & Icon */}
                <div>
                  <div className={"w-14 h-14 rounded-2xl flex items-center justify-center mb-6 " + (pkg.id === "silver" ? "bg-white/10" : "bg-[#F7FAF8]")}>
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-black mb-2 text-gray-900">
                    {isAr ? pkg.nameAr : pkg.nameEn}
                  </h3>
                  
                  {/* Price */}
                  <div className="my-6">
                    <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                    <span className="text-gray-400 text-sm font-bold mx-2">
                      {isAr ? 'درهم / شهرياً' : 'AED / month'}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px my-6" style={{ backgroundColor: pkg.color + '30' }} />

                  {/* Features List */}
                  <ul className="space-y-4">
                    {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className={"w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 " + (pkg.id === "silver" ? "bg-[#0E6B58] text-white" : "bg-[#EEF6F3] text-[#0E6B58]")}>
                          <Check size={12} strokeWidth={3} />
                        </span>
                        <span className="text-sm font-semibold text-gray-600 leading-normal">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-8">
                  <button
                    disabled={isActive || loadingId !== null}
                    onClick={() => handleSubscribe(pkg)}
                    className={"w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 shadow-sm border-2 disabled:opacity-70"} style={isActive ? { backgroundColor: pkg.color + '20', color: pkg.color, borderColor: 'transparent', cursor: 'default' } : { backgroundColor: pkg.id === 'silver' ? pkg.color : 'white', color: pkg.id === 'silver' ? 'white' : pkg.color, borderColor: pkg.color }}
                  >
                    {loadingId === pkg.id 
                      ? (isAr ? 'جاري الاشتراك...' : 'Subscribing...')
                      : isActive 
                        ? (isAr ? 'باقة نشطة' : 'Subscribed') 
                        : (isAr ? 'اشترك الآن' : 'Subscribe Now')}
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-16 text-center text-sm text-gray-400 font-bold">
          {isAr 
            ? 'تطبق الشروط والأحكام. هل تحتاج خطة مخصصة؟ ' 
            : 'Terms apply. Need a custom agency enterprise plan? '}
          <a href="https://wa.me/971500000000" className="text-[#0E6B58] underline hover:text-[#095746] transition-all ml-1">
            {isAr ? 'تواصل معنا' : 'Contact us'}
          </a>
        </div>

      </div>
    </div>
  );
};

export default PackagesPage;
