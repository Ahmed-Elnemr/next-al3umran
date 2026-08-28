import React from "react";
import { getPrivacy } from "../../../src/lib/serverActions";
import Container from "../../../src/components/shared/container";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params }: LayoutProps) => {
  const { locale } = await params;
  const privacy = await getPrivacy(locale);
  const value = privacy?.data?.value;

  return (
    <Container>
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">
          {locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
        </h1>
        {value ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <p>{locale === "ar" ? "لا توجد سياسة خصوصية حالياً" : "No privacy policy is available yet."}</p>
        )}
      </div>
    </Container>
  );
};

export default page;
