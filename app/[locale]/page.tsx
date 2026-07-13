import BookingSteps from "../../src/components/home/BookingSteps";
import Categories from "../../src/components/home/Categories";
import Hero from "../../src/components/home/Hero";
import HomeCTA from "../../src/components/home/HomeCTA";
import WhyAlOmran from "../../src/components/home/WhyAlOmran";
import AvailableProperties from "../../src/components/home/AvailableProperties";
import PackagesSection from "../../src/components/home/PackagesSection";
import Footer from "../../src/components/home/Footer";
import { getHomeData } from "../../src/lib/serverActions";
import { cookies } from "next/headers";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const homeData = await getHomeData(locale);
  const sliders = homeData?.data?.sliders || [];
  const about_page = homeData?.data?.about_page || [];
  const categories = homeData?.data?.categories || [];
  const events = homeData?.data?.services || [];
  const faq_items = homeData?.data?.faq_items || [];
  const steps = homeData?.data?.service_flow || [];

  return (
    <div className="bg-[#F6F4EE]">
      <Hero />

      <Categories />

      <AvailableProperties />

      <WhyAlOmran />

      <BookingSteps />

      <PackagesSection />

      <HomeCTA />

    </div>
  );
}