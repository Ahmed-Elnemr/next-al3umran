'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Check, ShieldCheck, Sparkles, Zap, ArrowRight, ArrowLeft } from 'lucide-react';

interface PreviewPackage {
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
  bgGradient: string;
}

const PackagesSection = () => {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (name: string) => {
      if (typeof window === 'undefined') return null;
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
      return null;
    };

    setToken(getCookie('token'));
    setRole(getCookie('client_type'));
  }, []);

  const previewPackages: PreviewPackage[] = [
    {
      id: 'basic',
      nameAr: 'الباقة البرونزية',
      nameEn: 'Bronze Package',
      price: 150,
      color: '#B45309',
      icon: <ShieldCheck size={26} className="text-[#B45309]" />,
      bgGradient: 'from-[#ffffff] to-[#fcfaf4]',
      featuresAr: [
        'نشر حتى 5 عقارات نشطة',
        'ظهور العقارات في محركات البحث',
        'لوحة تحكم أساسية لإدارة الإعلانات',
        'دعم فني عبر واتساب خلال أوقات العمل',
        'شعار شركتك في صفحة العقار',
      ],
      featuresEn: [
        'List up to 5 active properties',
        'SEO index listing',
        'Basic dashboard for listing management',
        'WhatsApp support during working hours',
        'Company logo on property page',
      ],
    },
    {
      id: 'silver',
      nameAr: 'الباقة الفضية الأكثر طلباً',
      nameEn: 'Silver Package (Most Popular)',
      price: 350,
      color: '#0E6B58',
      icon: <Zap size={26} className="text-[#0E6B58]" />,
      badgeAr: 'الأكثر شعبية',
      badgeEn: 'Most Popular',
      bgGradient: 'from-[#f0f9f6] to-[#ffffff]',
      featuresAr: [
        'نشر حتى 15 عقار نشط',
        'تميز 3 عقارات في الصفحة الأولى للموقع',
        'إحصائيات متقدمة وحصرية للمشاهدات',
        'علامة "حساب موثق" لزيادة الموثوقية',
        'إرسال إشعارات للمشترين المهتمين',
        'دعم فني مخصص وسريع 24/7',
      ],
      featuresEn: [
        'List up to 15 active properties',
        'Feature 3 properties on home page',
        'Advanced traffic & lead analytics',
        '"Verified Account" badge for higher trust',
        'Push notifications to interested buyers',
        'Priority 24/7 technical support',
      ],
    },
    {
      id: 'gold',
      nameAr: 'الباقة الذهبية الملكية',
      nameEn: 'Gold Royal Package',
      price: 600,
      color: '#C89B3C',
      icon: <Sparkles size={26} className="text-[#C89B3C]" />,
      badgeAr: 'خيار النخبة',
      badgeEn: 'Elite Choice',
      bgGradient: 'from-[#fbf7ee] to-[#ffffff]',
      featuresAr: [
        'نشر عدد غير محدود من العقارات',
        'تميز 10 عقارات في قمة نتائج البحث',
        'دعم فني وتوجيه استشاري عقاري خاص',
        'لوحة تحكم احترافية كاملة وتكامل مع CRM',
        'مدير حساب شخصي مخصص لشركتك',
        'تصوير فوتوغرافي احترافي مجاني لعقار شهرياً',
      ],
      featuresEn: [
        'List unlimited properties',
        'Feature 10 properties at search tops',
        'Premium consultancy & advisor support',
        'Full professional dashboard & CRM API access',
        'Dedicated personal account manager',
        'Free professional photoshoot monthly',
      ],
    },
  ];

  // If role is loaded and user is NOT a seller (is buyer), hide this section entirely since buyers don't buy packages.
  if (role && role !== 'company') {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-8">
          {previewPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={"relative flex flex-col justify-between px-8 rounded-[32px] transition-all duration-300 bg-gradient-to-b " + pkg.bgGradient + (pkg.id === "silver" ? " py-12 shadow-[0_30px_60px_rgba(14,107,88,0.15)] md:-translate-y-4 md:scale-105 z-10" : " py-8 shadow-sm hover:shadow-xl hover:-translate-y-1 z-0")} style={{ borderColor: pkg.id === "silver" ? pkg.color : pkg.color + '40', borderWidth: pkg.id === "silver" ? '2px' : '1px' }}
              >
                {pkg.badgeAr && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex justify-center z-20">
                    <span className="inline-flex whitespace-nowrap rounded-full px-5 py-1.5 text-[11px] font-black uppercase tracking-wider text-white shadow-md" style={{ backgroundColor: pkg.color }}>
                      {isAr ? pkg.badgeAr : pkg.badgeEn}
                    </span>
                  </div>
                )}

              <div>
                {/* Icon Circle */}
                <div className={"w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm " + (pkg.id === "silver" ? "bg-white/10 border-white/10" : "bg-white border-[#E2ECE8]")}>
                  {pkg.icon}
                </div>

                <h3 className="text-lg font-black mb-1 text-gray-900">
                  {isAr ? pkg.nameAr : pkg.nameEn}
                </h3>

                {/* Price */}
                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-black text-gray-900">{pkg.price}</span>
                  <span className="text-gray-400 text-xs font-bold mx-2">
                    {isAr ? 'درهم / شهرياً' : 'AED / month'}
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
              <div className="mt-8">
                <Link
                  href={token ? `/${locale}/packages` : `/${locale}/login`}
                  className="w-full py-3.5 rounded-xl font-black text-xs text-center block transition-all duration-200 shadow-sm border-2" style={{ backgroundColor: pkg.id === 'silver' ? pkg.color : 'white', color: pkg.id === 'silver' ? 'white' : pkg.color, borderColor: pkg.color }}
                >
                  {isAr ? 'اشترك الآن' : 'Subscribe Now'}
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default PackagesSection;
