import type { Metadata } from "next";
import { Tajawal } from "next/font/google";

import "../src/globals.css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import 'aos/dist/aos.css';

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700", "800", "900"],
  variable: "--font-tajawal",
  display: "swap",
});


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  return {
    title: isAr
      ? "العمران | افضل منصة عقارية تطوير عقاري بيع وايجار في سوريا والعراق والأمارات"
      : "Al Omran | The Best Real Estate & Property Development Platform for Sale & Rent in Syria, Iraq & UAE",

    description: isAr
      ? "اكتشف العمران، افضل منصة عقارية تطوير عقاري بيع وايجار في سوريا والعراق والأمارات. استكشف الشقق، الفلل، والأراضي في أكبر سوق عقاري متكامل."
      : "Discover Al Omran, the best real estate and property development platform for sale and rent in Syria, Iraq, and the UAE. Explore apartments, villas, and lands in the largest integrated real estate market.",

    keywords: isAr
      ? [
        "افضل منصة عقارية",
        "تطوير عقاري",
        "بيع وايجار",
        "عقارات سوريا",
        "عقارات العراق",
        "عقارات الإمارات",
        "العمران",
        "شقق للبيع",
        "شقق للإيجار",
        "فلل للبيع",
        "أراضي للبيع",
        "مشاريع عقارية",
      ]
      : [
        "best real estate platform",
        "property development",
        "sale and rent",
        "Syria real estate",
        "Iraq real estate",
        "UAE real estate",
        "Al Omran",
        "apartments for sale",
        "apartments for rent",
        "villas for sale",
        "lands for sale",
        "real estate projects",
      ],

    openGraph: {
      title: isAr
        ? "العمران | افضل منصة عقارية تطوير عقاري بيع وايجار في سوريا والعراق والأمارات"
        : "Al Omran | The Best Real Estate Platform for Sale & Rent in Syria, Iraq & UAE",

      description: isAr
        ? "اكتشف العمران، افضل منصة عقارية تطوير عقاري بيع وايجار في سوريا والعراق والأمارات. تصفح آلاف العقارات والمشاريع الآن."
        : "Discover Al Omran, the best real estate and property development platform for sale and rent in Syria, Iraq, and the UAE.",

      url: "https://al3umran.com",
      siteName: "Al Omran",

      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isAr
            ? "العمران منصة عقارية"
            : "Al Omran Real Estate Platform",
        },
      ],

      locale: isAr ? "ar_AR" : "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",

      title: isAr
        ? "العمران | منصة العقارات"
        : "Al Omran | Real Estate Platform",

      description: isAr
        ? "منصة متكاملة للعقارات والتطوير العقاري في العراق وسوريا والإمارات."
        : "A complete platform for real estate and property development in Iraq, Syria, and the UAE.",

      images: ["/og-image.jpg"],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: `https://al3umran.com/${locale}`,
      languages: {
        "ar": "https://al3umran.com/ar",
        "en": "https://al3umran.com/en",
        "x-default": "https://al3umran.com/ar",
      },
    },

    icons: {
      icon: "/images/logo.png",
      apple: "/images/logo.png",
    },

    metadataBase: new URL("https://al3umran.com"),
    verification: {
      google: "1-uh-_u93SNcd9mAE7UHc3ey5D0DOTVW7bYhVcX4RyI",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // الحصول على الـ locale من params مباشرة
  const { locale: currentLocale } = await params;
  const isAr = currentLocale === "ar";

  return (
    <html
      lang={currentLocale}
      dir={currentLocale === "ar" ? "rtl" : "ltr"}
      suppressHydrationWarning
    >
      <head>
      </head>
      <body
        className={`min-h-screen ${tajawal.variable} ${tajawal.className}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}