'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Check, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const savedPackage = localStorage.getItem('alomran_subscribed_package');
    setSubscribedPackage(savedPackage);
  }, [locale, router]);

  const handleSubscribe = (pkg: Package) => {
    if (balance < pkg.price) {
      toast.error(
        isAr 
          ? 'رصيد محفظتك غير كافٍ للاشتراك بهذه الباقة. يرجى شحن المحفظة أولاً.' 
          : 'Insufficient wallet balance. Please top up your wallet first.'
      );
      return;
    }

    setLoadingId(pkg.id);
    
    setTimeout(() => {
      const newBalance = balance - pkg.price;
      setBalance(newBalance);
      localStorage.setItem('alomran_wallet_balance', newBalance.toString());
      localStorage.setItem('alomran_subscribed_package', pkg.id);
      setSubscribedPackage(pkg.id);
      setLoadingId(null);
      
      toast.success(
        isAr 
          ? `تهانينا! تم الاشتراك في باقة ${pkg.nameAr} بنجاح.` 
          : `Congratulations! Subscribed to ${pkg.nameEn} successfully.`
      );
    }, 1500);
  };

  const packages: Package[] = [
    {
      id: 'basic',
      nameAr: 'الباقة البرونزية',
      nameEn: 'Bronze Package',
      price: 150,
      color: '#B45309',
      icon: <ShieldCheck size={28} className="text-[#B45309]" />,
      featuresAr: [
        'نشر حتى 5 عقارات نشطة',
        'دعم فني عبر واتساب',
        'ظهور العقارات في محركات البحث',
        'لوحة تحكم أساسية لإحصائيات المشاهدة',
      ],
      featuresEn: [
        'List up to 5 active properties',
        'Technical support via WhatsApp',
        'SEO index listing',
        'Basic views dashboard analytics',
      ],
    },
    {
      id: 'silver',
      nameAr: 'الباقة الفضية الأكثر طلباً',
      nameEn: 'Silver Package (Most Popular)',
      price: 350,
      color: '#0E6B58',
      icon: <Zap size={28} className="text-[#0E6B58]" />,
      badgeAr: 'الأكثر شعبية',
      badgeEn: 'Most Popular',
      featuresAr: [
        'نشر حتى 15 عقار نشط',
        'تميز عقارين في الصفحة الأولى للموقع',
        'دعم فني مخصص وسريع 24/7',
        'إحصائيات متقدمة وحصرية للمشاهدات',
        'مشاركة العقارات في منصات التواصل الخاصة بالعمران',
      ],
      featuresEn: [
        'List up to 15 active properties',
        'Feature 2 properties on home page',
        'Priority 24/7 technical support',
        'Advanced traffic & lead analytics',
        'Social media coverage on Al Omran channels',
      ],
    },
    {
      id: 'gold',
      nameAr: 'الباقة الذهبية الملكية',
      nameEn: 'Gold Royal Package',
      price: 600,
      color: '#C89B3C',
      icon: <Sparkles size={28} className="text-[#C89B3C]" />,
      badgeAr: 'الأقوى تميزاً',
      badgeEn: 'Premium Choice',
      featuresAr: [
        'نشر عدد غير محدود من العقارات',
        'تميز 5 عقارات في قمة نتائج البحث الأولى',
        'دعم فني وتوجيه استشاري عقاري خاص',
        'لوحة تحكم احترافية كاملة وتكامل مع CRM',
        'تصوير فوتوغرافي احترافي مجاني لعقار واحد شهرياً',
      ],
      featuresEn: [
        'List unlimited properties',
        'Feature 5 properties at search tops',
        'Premium consultancy and advisor support',
        'Full professional dashboard & CRM API access',
        'Free professional photoshoot for 1 property monthly',
      ],
    },
  ];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {packages.map((pkg) => {
            const isActive = subscribedPackage === pkg.id;
            
            return (
              <div 
                key={pkg.id} 
                className={`bg-white rounded-[32px] border relative overflow-hidden transition-all duration-300 flex flex-col justify-between p-8 hover:shadow-[0_20px_50px_rgba(16,24,32,0.06)] hover:-translate-y-1.5 ${
                  isActive 
                    ? 'border-[#C89B3C] ring-2 ring-[#C89B3C]/50 shadow-[0_20px_50px_rgba(200,155,60,0.1)]' 
                    : 'border-[#E2ECE8]'
                }`}
              >
                {/* Badges */}
                {(pkg.badgeAr || isActive) && (
                  <span className="absolute top-4 end-4 text-[10px] font-black uppercase px-3 py-1.5 rounded-full text-white bg-gradient-to-r from-[#C89B3C] to-[#101820] shadow-sm">
                    {isActive 
                      ? (isAr ? 'نشطة حالياً' : 'Active Plan') 
                      : (isAr ? pkg.badgeAr : pkg.badgeEn)}
                  </span>
                )}

                {/* Card Title & Icon */}
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#F7FAF8] flex items-center justify-center mb-6">
                    {pkg.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">
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
                  <div className="w-full h-px bg-gray-100 my-6" />

                  {/* Features List */}
                  <ul className="space-y-4">
                    {(isAr ? pkg.featuresAr : pkg.featuresEn).map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center shrink-0 mt-0.5">
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
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[#EEF6F3] text-[#0E6B58] cursor-default'
                        : 'bg-[#0E6B58] hover:bg-[#095746] text-white hover:shadow-lg'
                    } disabled:opacity-70`}
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
