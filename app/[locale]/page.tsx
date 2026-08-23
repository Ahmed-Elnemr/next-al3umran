import BookingSteps from "../../src/components/home/BookingSteps";
import Categories from "../../src/components/home/Categories";
import Hero from "../../src/components/home/Hero";
import HomeCTA from "../../src/components/home/HomeCTA";
import WhyAlOmran from "../../src/components/home/WhyAlOmran";
import AvailableProperties from "../../src/components/home/AvailableProperties";
import PackagesSection from "../../src/components/home/PackagesSection";
import { getHomeData } from "../../src/lib/serverActions";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
  const homeData = await getHomeData(locale);
  const payload = homeData?.data || {};

  return (
    <div className="bg-[#F6F4EE]">
      <Hero hero={payload.hero} />

      <Categories items={payload.categories || []} />

      <AvailableProperties items={payload.featured_properties || []} />

      <WhyAlOmran items={payload.why_items || []} />

      <BookingSteps items={payload.booking_steps || []} />

      <PackagesSection items={payload.packages || []} />

      <HomeCTA cta={payload.cta} />
    </div>
  );
}
