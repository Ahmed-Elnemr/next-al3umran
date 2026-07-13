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
    ? "العمران | منصة العقارات والتطوير العقاري في العراق وسوريا والإمارات"
    : "Al Omran | Real Estate & Property Development Platform in Iraq, Syria & UAE",

  description: isAr
    ? "العمران منصة متكاملة لبيع وشراء وتأجير العقارات والتطوير العقاري في العراق وسوريا والإمارات، اكتشف الشقق والفلل والأراضي والمشاريع العقارية بسهولة."
    : "Al Omran is a comprehensive real estate and property development platform for buying, selling, and renting properties in Iraq, Syria, and the UAE. Discover apartments, villas, lands, and real estate projects easily.",

  keywords: isAr
    ? [
        "العمران",
        "عقارات",
        "تطوير عقاري",
        "عقارات العراق",
        "عقارات سوريا",
        "عقارات الإمارات",
        "بيع شقق",
        "شراء عقارات",
        "تأجير عقارات",
        "فلل للبيع",
        "شقق للإيجار",
        "مشاريع عقارية",
        "أراضي للبيع",
        "منصة عقارية",
      ]
    : [
        "Al Omran",
        "real estate",
        "property development",
        "Iraq real estate",
        "Syria real estate",
        "UAE real estate",
        "apartments for sale",
        "property rental",
        "villas for sale",
        "real estate platform",
        "lands for sale",
        "property marketplace",
      ],

  openGraph: {
    title: isAr
      ? "العمران | منصة العقارات والتطوير العقاري"
      : "Al Omran | Real Estate Platform",

    description: isAr
      ? "اكتشف أفضل العقارات والمشاريع العقارية في العراق وسوريا والإمارات عبر منصة العمران."
      : "Discover the best real estate properties and development projects across Iraq, Syria, and the UAE with Al Omran.",

    url: "https://alomran.com",
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
    canonical: "https://alomran.com",
    languages: {
      "ar-SA": "https://alomran.com/ar",
      "en-US": "https://alomran.com/en",
    },
  },

  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },

  metadataBase: new URL("https://alomran.com"),
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