import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { getProperty, mapApiProperty } from "../../../../src/lib/api/client";
import { getMyPropertyAction } from "../../../../src/lib/serverActions";
import PropertyDetailsClient from "../../../../src/components/properties/PropertyDetailsClient";

interface PageProps {
  params: Promise<{
    locale: string;
    id: string;
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let property = null;
  try {
    const res = await getProperty(locale, id);
    if (res?.data) {
      property = mapApiProperty(res.data, locale);
    }
  } catch (err) {
    // Fallback if needed
  }

  if (!property) {
    return {
      title: isAr ? "عقار غير موجود | العمران" : "Property Not Found | Al Omran",
    };
  }

  const title = (isAr ? property.titleAr : property.titleEn) || "Al Omran Property";
  const description = (isAr ? property.descriptionAr : property.descriptionEn) || title;
  const image = property.image || property.gallery?.[0] || "/og-image.jpg";
  const price = property.priceAr || property.priceEn;

  const seoTitle = `${title} - ${price} | ${isAr ? "العمران" : "Al Omran"}`;

  return {
    title: seoTitle,
    description: description.substring(0, 160),
    openGraph: {
      title: seoTitle,
      description: description.substring(0, 160),
      images: [{ url: image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: description.substring(0, 160),
      images: [image],
    },
  };
}

export default async function PropertyDetailsPage({ params }: PageProps) {
  const { locale, id } = await params;
  const isAr = locale === "ar";

  let property = null;

  try {
    const res = await getProperty(locale, id);
    if (res?.data) {
      property = mapApiProperty(res.data, locale);
    }
  } catch (err) {
    try {
      const authRes = await getMyPropertyAction(locale, id);
      if (authRes?.data) {
        property = mapApiProperty(authRes.data, locale);
      }
    } catch (err) {
      property = null;
    }
  }

  if (!property) {
    return (
      <main
        dir={isAr ? "rtl" : "ltr"}
        className="flex min-h-screen items-center justify-center bg-[#EEF2EC] px-4"
      >
        <div className="rounded-[32px] bg-white p-8 text-center shadow-[0_20px_70px_rgba(16,24,32,0.10)]">
          <h1 className="text-2xl font-black text-[#101820]">
            {isAr ? "العقار غير موجود" : "Property Not Found"}
          </h1>

          <Link
            href={`/${locale}`}
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-[#101820] px-6 font-black text-white"
          >
            {isAr ? "العودة للرئيسية" : "Back Home"}
          </Link>
        </div>
      </main>
    );
  }

  return <PropertyDetailsClient property={property} locale={locale} isAr={isAr} />;
}