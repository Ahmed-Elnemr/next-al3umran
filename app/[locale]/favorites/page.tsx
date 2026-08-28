"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, HeartCrack } from "lucide-react";
import PropertiesList from "../../../src/components/properties/PropertiesList";
import { getFavoritesAction } from "../../../src/lib/serverActions";
import type { PropertyItem } from "../../../app/[locale]/properties/page";
import { mapApiProperty } from "../../../src/lib/api/client";

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default function FavoritesPage({ params }: PageProps) {
  const { locale } = use(params);
  const isAr = locale === "ar";
  const BackIcon = isAr ? ArrowRight : ArrowLeft;
  const [favoriteProperties, setFavoriteProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const response = await getFavoritesAction(locale);
        if (response?.data && Array.isArray(response.data)) {
          const mappedData = response.data.map((item: any) => mapApiProperty(item, locale));
          setFavoriteProperties(mappedData);
        }
      } catch (error) {
        console.error("Failed to load favorites", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [locale]);

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F7FAF8]">
      {/* Header */}
      <section className="bg-[#0E6B58] pb-24 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <Link
            href={`/${locale}`}
            className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/80 transition hover:text-white"
          >
            <BackIcon size={16} />
            {isAr ? "العودة للرئيسية" : "Back to Home"}
          </Link>

          <h1 className="text-4xl font-black md:text-5xl">
            {isAr ? "عقاراتك المفضلة" : "Your Favorite Properties"}
          </h1>
          <p className="mt-4 text-lg text-white/80">
            {isAr
              ? "استعرض العقارات التي قمت بحفظها لسهولة الرجوع إليها."
              : "Browse the properties you have saved for easy access."}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 -mt-16">
        {loading ? (
          <PropertiesList
            isAr={isAr}
            locale={locale}
            properties={[]}
            loading={true}
          />
        ) : favoriteProperties.length > 0 ? (
          <PropertiesList
            isAr={isAr}
            locale={locale}
            properties={favoriteProperties}
            resetFilters={() => {}}
          />
        ) : (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-[32px] bg-white p-8 text-center shadow-[0_20px_70px_rgba(16,24,32,0.05)] border border-[#E2ECE8]">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#EEF6F3] text-[#0E6B58] mb-6">
              <HeartCrack size={36} />
            </div>
            <h2 className="text-2xl font-black text-[#101820]">
              {isAr ? "قائمة المفضلة فارغة" : "Your Wishlist is Empty"}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-gray-500">
              {isAr
                ? "لم تقم بإضافة أي عقار إلى المفضلة حتى الآن. تصفح العقارات واضغط على علامة القلب لحفظ العقارات التي تهمك."
                : "You haven't added any properties to your favorites yet. Browse properties and click the heart icon to save the ones you like."}
            </p>

            <Link
              href={`/${locale}/properties`}
              className="mt-8 inline-flex h-14 items-center justify-center rounded-2xl bg-[#0E6B58] px-8 font-black text-white transition hover:bg-[#095746] hover:shadow-lg"
            >
              {isAr ? "تصفح العقارات الآن" : "Browse Properties Now"}
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
