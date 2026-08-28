import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
import Providers from "@/providers/providers";
import { notFound } from "next/navigation";
import { locales } from "../../navigation";
import { cookies } from "next/headers";
import React from "react";
import type { Metadata } from "next";

import "react-toastify/dist/ReactToastify.css";
import "react-photo-view/dist/react-photo-view.css";
import Navbar from "../../src/components/navbar";
import { getContactData, getGeneralSettings, getPublicCategories, getNotificaionsCount } from "../../src/lib/serverActions";
import Footer from "../../src/components/home/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const generalData = await getGeneralSettings(locale);
  const favicon = generalData?.data?.favicon;

  return {
    title: generalData?.data?.site_name || (locale === "ar" ? "العمران" : "Al Omran"),
    description: generalData?.data?.site_tagline || (locale === "ar" ? "منصة العقارات الذكية" : "Smart Real Estate Platform"),
    icons: favicon
      ? { icon: favicon, apple: favicon, shortcut: favicon }
      : { icon: "/images/logo.png", apple: "/images/logo.png" },
  };
}


export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: currentLocale } = await params;

  if (!locales.includes(currentLocale as any)) {
    notFound();
  }

  let messages;
  try {
    messages = (await import(`../../messages/${currentLocale}.json`)).default;
  } catch {
    notFound();
  }

  const settingsData = await getContactData(currentLocale);
  const settings = settingsData?.data || {};
  const generalData = await getGeneralSettings(currentLocale);
  const general = generalData?.data || {};
  const categoriesData = await getPublicCategories(currentLocale);
  const categories = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : Array.isArray(categoriesData?.data?.data)
      ? categoriesData.data.data
      : [];

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("client_type")?.value;
  const userDataInfoStr = cookieStore.get("userDataInfo")?.value;
  let userData = null;
  if (userDataInfoStr) {
    try {
      userData = JSON.parse(userDataInfoStr);
    } catch (e) {
      console.error("Failed to parse userDataInfo cookie in layout", e);
    }
  }
  const notificationsCountData = token
    ? await getNotificaionsCount(currentLocale)
    : { data: { unread_count: 0 } };
  const notificationsUnReadCount = Number(
    notificationsCountData?.data?.unread_count ?? notificationsCountData?.unread_count ?? 0
  );

  // const logoAr = settings.find((item: any) => item.key === "logo_ar")?.value;
  // const logoEn = settings.find((item: any) => item.key === "logo_en")?.value;

  // const logo = isAr
  //   ? logoAr || logoEn
  //   : logoEn || logoAr;

  return (
    <NextIntlClientProvider
      locale={currentLocale || "en"}
      messages={messages}
      timeZone="Asia/Dubai"
    >
      <ToastContainer position="bottom-right" />
      <Providers locale={currentLocale || "en"}>
        <div
          dir={currentLocale === "ar" ? "rtl" : "ltr"}
          lang={currentLocale}
          className="min-h-screen bg-white"
        >
          <Navbar
            bank_account={null}
            token={token}
            role={role}
            userData={userData}
            notificationsUnReadCount={notificationsUnReadCount}
            logo={general.header_logo || general.logo}
            favicon={general.favicon}
            siteName={general.site_name}
            tagline={general.site_tagline}
          />
          {/* <WhatsApp locale={currentLocale}/> */}
          <div>{children}</div>
          <Footer contact={settings} general={general} categories={categories} />
          {/* <Footer settings={settings} locale={currentLocale} token={token} /> */}
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
