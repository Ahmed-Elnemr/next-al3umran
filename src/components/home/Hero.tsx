"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      dir={isAr ? "rtl" : "ltr"}
      className="relative min-h-screen overflow-hidden bg-black"
    >
      {/* YouTube Video Background */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden bg-black">
        <iframe
          className={`
            absolute left-1/2 top-1/2
            h-[177.78vw] w-[100vw]
            min-h-[100vh] min-w-[56.25vh]
            -translate-x-1/2 -translate-y-1/2
            scale-[1.75]
            pointer-events-none
            transition-opacity duration-700
            ${showVideo ? "opacity-100" : "opacity-0"}
          `}
          src="https://www.youtube.com/embed/WBvuvR4vz58?autoplay=1&mute=1&loop=1&playlist=WBvuvR4vz58&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0&start=2&vq=hd1080"
          title="Al Omran Real Estate Video Background"
          frameBorder="0"
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>

      {/* Simple Soft Overlay */}
      <div className="absolute inset-0 z-[1] bg-black/25" />

      {/* Content Centered */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 pt-28 pb-16 text-center">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-white">
          <div className="mb-6 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-black/25 px-5 py-2.5 backdrop-blur-[2px]">
            <Sparkles size={16} className="text-[#C89B3C]" />
            <span className="text-xs font-black md:text-sm">
              {isAr
                ? "منصة العمران للتطوير العقاري"
                : "Al Omran Real Estate Platform"}
            </span>
          </div>

          <h1 className="max-w-5xl text-center text-4xl font-black leading-[1.18] tracking-[-0.04em] drop-shadow-[0_8px_25px_rgba(0,0,0,0.65)] md:text-6xl lg:text-7xl">
            {isAr
              ? "اكتشف عقارات فاخرة بمواقع استثنائية وإطلالات لا تُنسى"
              : "Discover luxury properties in exceptional locations with unforgettable views"}
          </h1>

          <p className="mt-6 max-w-3xl text-center text-base leading-8 text-white/90 drop-shadow-[0_5px_18px_rgba(0,0,0,0.65)] md:text-xl md:leading-9">
            {isAr
              ? "العمران يساعدك على الوصول لأفضل فرص السكن والاستثمار، من الفلل والمنازل الفاخرة إلى الشقق والأراضي والمشاريع الجديدة، بتجربة واضحة وسريعة."
              : "Al Omran helps you find premium living and investment opportunities, from luxury villas and homes to apartments, lands and new developments."}
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/properties`}
              className="group flex h-14 items-center justify-center gap-2 rounded-full bg-[#C89B3C] px-8 font-black text-[#101820] shadow-[0_22px_70px_rgba(200,155,60,0.45)] transition hover:-translate-y-1 hover:bg-[#d8aa49]"
            >
              {isAr ? "استكشف العقارات" : "Explore Properties"}
              <ArrowIcon
                size={19}
                className="transition group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              />
            </Link>

            <Link
              href={`/${locale}/sell-your-service`}
              className="flex h-14 items-center justify-center gap-2 rounded-full border border-white/35 bg-black/25 px-8 font-black text-white backdrop-blur-[2px] transition hover:-translate-y-1 hover:bg-white hover:text-[#101820]"
            >
              <Building2 size={19} />
              {isAr ? "أضف عقارك" : "Add Property"}
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/25 px-4 py-3 backdrop-blur-[2px]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#C89B3C] text-[#101820]">
                <ShieldCheck size={22} />
              </span>

              <div className="">
                <h3 className="text-sm font-black">
                  {isAr ? "عقارات موثقة" : "Verified Properties"}
                </h3>
                <p className="text-xs text-white/75">
                  {isAr
                    ? "بيانات واضحة وتواصل مباشر"
                    : "Clear details and direct contact"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-black/25 px-4 py-3 backdrop-blur-[2px]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-white">
                <MapPin size={22} />
              </span>

              <div className="">
                <h3 className="text-sm font-black">
                  {isAr ? "مواقع مميزة" : "Prime Locations"}
                </h3>
                <p className="text-xs text-white/75">
                  {isAr
                    ? "اختيارات مناسبة للسكن والاستثمار"
                    : "Perfect for living and investment"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Smooth Transition After Hero */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-16 bg-gradient-to-t from-[#F6F4EE] to-transparent" />
    </section>
  );
};

export default Hero;