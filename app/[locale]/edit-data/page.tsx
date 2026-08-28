import React from "react";
import Container from "../../../src/components/shared/container";
import EditDataForm from "./EditDataForm";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const isAr = locale === "ar";
  const t = await getTranslations({ locale, namespace: "profile" });

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value ?? "";
  const clientType = cookieStore.get("client_type")?.value;
  const userDataString = cookieStore.get("userDataInfo")?.value;

  let userData: { client_type?: string } | null = null;
  if (userDataString) {
    try {
      userData = JSON.parse(userDataString);
    } catch {
      userData = null;
    }
  }

  const role = clientType || userData?.client_type || "customer";

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-[#F7FAF8] py-12 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-black text-[#101820] mb-4 tracking-tight">
            {t("editTitle")}
          </h1>
          <p className="text-base text-[#63756F] max-w-2xl mx-auto">
            {t("editSubtitle") || "Manage your personal information, security settings, and connected accounts."}
          </p>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_70px_rgba(16,24,32,0.05)] border border-[#E2ECE8] overflow-hidden">
          <EditDataForm token={token} role={role} />
        </div>
      </div>
    </main>
  );
};

export default page;
