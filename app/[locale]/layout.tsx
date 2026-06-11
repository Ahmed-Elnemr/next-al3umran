import { ToastContainer } from "react-toastify";
import { NextIntlClientProvider } from "next-intl";
// import Providers from "@/providers/providers";
import { notFound } from "next/navigation";
import { locales } from "../../navigation";
import { cookies } from "next/headers";
import React from "react";

import "react-photo-view/dist/react-photo-view.css";
import Navbar from "../../src/components/navbar";
import { getSettingsData } from "../../src/lib/serverActions";


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

  const settingsData = await getSettingsData(currentLocale);
  const settings = settingsData?.data || [];

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAr = currentLocale === "ar";

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
      {/* <Providers locale={currentLocale || "en"}> */}
        <div
          dir={currentLocale === "ar" ? "rtl" : "ltr"}
          lang={currentLocale}
          className="min-h-screen overflow-hidden bg-white"
        >
          <Navbar
            bank_account={settings?.find((item: any) => item.key === "bankAccount")}
            token={token}
            notificationsUnReadCount={0}
          />
          {/* <WhatsApp locale={currentLocale}/> */}
          <div>{children}</div>
          {/* <Footer settings={settings} locale={currentLocale} token={token} /> */}
        </div>
      {/* </Providers> */}
    </NextIntlClientProvider>
  );
}
