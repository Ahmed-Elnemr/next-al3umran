import React from "react";
import { getTerms } from "../../../src/lib/serverActions";
import Container from "../../../src/components/shared/container";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

const page = async ({ params }: LayoutProps) => {
  const { locale } = await params;
  const terms = await getTerms(locale);
  const value = terms?.data?.value;

  return (
    <Container>
      <div className="container mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">
          {locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}
        </h1>
        {value ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
        ) : (
          <p>{locale === "ar" ? "لا توجد شروط حالياً" : "No terms are available yet."}</p>
        )}
      </div>
    </Container>
  );
};

export default page;
