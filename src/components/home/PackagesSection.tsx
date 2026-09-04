'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Check, ShieldCheck, Sparkles, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import apiServiceCall from '../../../src/lib/apiServiceCall';

interface PreviewPackage {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  currency?: string;
  featuresAr: string[];
  featuresEn: string[];
  icon: React.ReactNode;
  color: string;
  badgeAr?: string;
  badgeEn?: string;
  bgGradient: string;
}

const PackagesSection = ({ items = [], token }: { items?: any[], token?: string | null }) => {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [role, setRole] = useState<string | null>(null);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof window === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    setRole(getCookie('client_type'));
    setRoleLoaded(true);
  }, []);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubscribe = async (pkg: any) => {
    if (!token) {
      toast.error(isAr ? 'يرجى تسجيل الدخول أو إنشاء حساب كشركة للاشتراك في هذه الباقة.' : 'Please login or register as a company to subscribe to this package.', { autoClose: 5000, position: "bottom-right" });
      window.location.href = `/${locale}/login`;
      return;
    }

    const pkgIdStr = String(pkg.id);
    setLoadingId(pkgIdStr);
    try {
      const response = await apiServiceCall({
        method: 'post',
        url: 'client/subscriptions',
        body: { package_id: Number(pkg.id) },
        headers: {
          'Accept-Language': locale,
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Subscription response:', response);
      const successMessage = response?.message || response?.data?.message || (
        isAr
          ? `تهانينا! تم الاشتراك في باقة ${pkg.nameAr || pkg.name || ''} بنجاح.`
          : `Congratulations! Subscribed to ${pkg.nameEn || pkg.name || ''} successfully.`
      );
      toast.success(successMessage, { autoClose: 5000, position: "bottom-right" });
    } catch (error: any) {
      const message =
        error?.data?.message || error?.message ||
        (isAr
          ? 'رصيد محفظتك غير كافٍ للاشتراك بهذه الباقة. يرجى شحن المحفظة أولاً.'
          : 'Insufficient wallet balance. Please top up your wallet first.');
      toast.error(message, { autoClose: 5000, position: "bottom-right" });
    } finally {
      setLoadingId(null);
    }
  };

  const apiPackages = items.map((pkg, index) => {
    const palettes = [
      { id: 'basic', color: '#B45309', icon: <ShieldCheck size={26} className="text-[#B45309]" />, bgGradient: 'from-[#ffffff] to-[#fcfaf4]' },
      { id: 'silver', color: '#0E6B58', icon: <Zap size={26} className="text-[#0E6B58]" />, bgGradient: 'from-[#f0f9f6] to-[#ffffff]' },
      { id: 'gold', color: '#C89B3C', icon: <Sparkles size={26} className="text-[#C89B3C]" />, bgGradient: 'from-[#fbf7ee] to-[#ffffff]' },
    ];
    const theme = palettes[index % palettes.length];
    return {
      ...theme,
      id: String(pkg.id),
      nameAr: pkg.name,
      nameEn: pkg.name,
      price: pkg.price,
      currency: pkg.currency_label || (isAr ? (pkg.currency === 'USD' ? 'دولار' : 'درهم') : (pkg.currency || 'AED')),
      badgeAr: pkg.badge,
      badgeEn: pkg.badge,
      featuresAr: pkg.features || [],
      featuresEn: pkg.features || [],
    };
  });

  const previewPackages: PreviewPackage[] = apiPackages.length ? apiPackages : [];

  // If role is loaded and user is a logged-in normal buyer, hide this section entirely. Show to guests and companies.
  if (roleLoaded && role !== null && role !== 'company') {
    return null;
  }

  return (
    <section dir={isAr ? 'rtl' : 'ltr'} className="py-20 bg-gradient-to-b from-[#F6F4EE] to-[#EAE7DC] relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#0E6B58]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-[#C89B3C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative">

        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#0E6B58] bg-[#EEF6F3] px-4 py-2 rounded-full">
              {isAr ? 'باقات تميز المعلنين' : 'Advertising Plans'}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mt-6 leading-tight">
              {isAr ? 'أعلن عن عقارك باحترافية' : 'Promote Your Properties'}
            </h2>
            <p className="text-gray-500 mt-4 text-base max-w-xl">
              {isAr
                ? 'زد من نسبة وصول إعلاناتك العقارية وتواصل مع آلاف المشترين المهتمين يومياً عبر باقاتنا المميزة.'
                : 'Accelerate your listing views and connect with thousands of active buyers through our premium plans.'}
            </p>
          </div>

          <Link
            href={`/${locale}/packages`}
            className="mt-6 md:mt-0 flex items-center gap-2 text-sm font-black text-[#0E6B58] hover:text-[#095746] group transition-all duration-200"
          >
            <span>{isAr ? 'استعرض كافة الباقات' : 'View All Pricing plans'}</span>
            {isAr ? <ArrowLeft size={16} className="group-hover:-translate-x-1.5 transition-all" /> : <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-all" />}
          </Link>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8 relative z-50">
          {previewPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={"relative flex flex-col justify-between px-8 rounded-[32px] transition-all duration-300 bg-gradient-to-b " + pkg.bgGradient + (pkg.id === "silver" ? " py-12 shadow-xl md:-translate-y-4 md:scale-105 z-20" : " py-8 shadow-sm border border-[#E7E1D6] hover:shadow-lg z-10")} style={{ borderColor: pkg.id === "silver" ? pkg.color : pkg.color + '40', borderWidth: pkg.id === "silver" ? '2px' : '1px' }}
              >
                {pkg.badgeAr && (
                  <div className="absolute -top-3 left-0 right-0 flex justify-center pointer-events-none">
                    <span className="inline-flex whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: pkg.color }}>
                      {isAr ? pkg.badgeAr : pkg.badgeEn}
                    </span>
                  </div>
                )}

              <div className="flex-1">
                {/* Icon Circle */}
                <div className={"w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm " + (pkg.id === "silver" ? "bg-white/10 border-white/10" : "bg-white border-[#E2ECE8]")}>
                  {pkg.icon}
                </div>

                <h3 className="text-lg font-black mb-1 text-gray-900">
                  {isAr ? pkg.nameAr : pkg.nameEn}
                </h3>

                {/* Price */}
                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-black text-gray-900">
                    {Number(pkg.price || 0).toLocaleString(isAr ? 'ar-EG' : 'en-US')}
                  </span>
                  <span className="text-gray-400 text-xs font-bold mx-2">
                    {pkg.currency || (isAr ? 'درهم' : 'AED')} {isAr ? '/ شهرياً' : '/ month'}
                  </span>
                </div>

                <div className="w-full h-px my-5" style={{ backgroundColor: pkg.color + '30' }} />

                {/* Features */}
                <ul className="space-y-3.5">
                  {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className={"w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 " + (pkg.id === "silver" ? "bg-[#0E6B58] text-white" : "bg-[#EEF6F3] text-[#0E6B58]")}>
                        <Check size={10} strokeWidth={4} />
                      </span>
                      <span className="text-xs font-bold text-gray-700">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Redirect CTA */}
              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubscribe(pkg);
                  }}
                  disabled={loadingId === pkg.id}
                  className="w-full py-3.5 rounded-xl font-black text-xs text-center block transition-all duration-200 shadow-sm border-2 disabled:opacity-70 hover:scale-105 hover:shadow-md cursor-pointer"
                  style={{ backgroundColor: pkg.id === 'silver' ? pkg.color : 'white', color: pkg.id === 'silver' ? 'white' : pkg.color, borderColor: pkg.color }}
                >
                  {loadingId === pkg.id 
                    ? (isAr ? 'جاري الاشتراك...' : 'Subscribing...') 
                    : (isAr ? 'اشترك الآن' : 'Subscribe Now')}
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PackagesSection;
