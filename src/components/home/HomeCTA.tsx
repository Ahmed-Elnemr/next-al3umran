'use client';

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowUpRight, Building2, MessageCircle } from "lucide-react";

const HomeCTA = ({ cta }: { cta?: { title?: string; subtitle?: string } }) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  
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
    let clientType = getCookie('client_type');
    if (!clientType) {
      const userStr = getCookie('userDataInfo');
      if (userStr) {
        try {
          const parsed = JSON.parse(decodeURIComponent(userStr));
          if (parsed?.client_type) clientType = parsed.client_type;
        } catch (e) {}
      }
    }
    setRole(clientType);
  }, []);

  // Only companies can add/list properties. Hide this CTA section completely for customers.
  if (role !== 'company') {
    return null;
  }

  const buttonHref = `/${locale}/add-your-property`;
  const buttonText = isAr ? "ابدأ نشر عقارك" : "Start Listing";

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-[42px] overflow-hidden bg-gradient-to-br from-[#0E6B58] to-[#101820] p-8 lg:p-12 text-white">
          <div className="absolute -top-20 -end-20 w-72 h-72 rounded-full bg-[#C89B3C]/25 blur-2xl" />
          <div className="absolute -bottom-20 -start-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />

          <div className="relative grid lg:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <div className="w-16 h-16 rounded-3xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
                <Building2 size={30} className="text-[#C89B3C]" />
              </div>

              <h2 className="text-3xl lg:text-5xl font-black leading-tight">
                {cta?.title ||
                  (isAr
                    ? "هل تبحث عن عقار أو ترغب في عرضه؟"
                    : "Are you looking for a property or wanting to list one?")}
              </h2>

              <p className="mt-4 text-white/75 leading-8 max-w-2xl">
                {cta?.subtitle ||
                  (isAr
                    ? "انشر عقارك الآن للوصول لعملاء جادين، أو تواصل معنا مباشرة لتلبية طلباتك العقارية فوراً."
                    : "List your property now to reach serious clients, or contact us directly to fulfill your real estate requests instantly.")}
              </p>
            </div>

            <Link
              href={buttonHref}
              className="h-14 rounded-full bg-[#C89B3C] text-[#101820] px-7 flex items-center justify-center gap-2 font-black shadow-[0_20px_60px_rgba(200,155,60,0.35)] hover:-translate-y-1 transition"
            >
              {buttonText}
              <ArrowUpRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeCTA;