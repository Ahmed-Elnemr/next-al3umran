import BookingSteps from "../../src/components/home/BookingSteps";
import Categories from "../../src/components/home/Categories";
import Hero from "../../src/components/home/Hero";
import HomeCTA from "../../src/components/home/HomeCTA";
import WhyAlOmran from "../../src/components/home/WhyAlOmran";
import AvailableProperties from "../../src/components/home/AvailableProperties";
import PackagesSection from "../../src/components/home/PackagesSection";
import Faq from "../../src/components/faq";
import LatestBlogs from "../../src/components/home/LatestBlogs";
import { cookies } from "next/headers";
import { getHomeData, getBlogPosts } from "../../src/lib/serverActions";
import { getTranslations } from "next-intl/server";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export const dynamic = "force-dynamic";

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const [homeData, blogsResponse] = await Promise.all([
    getHomeData(locale),
    getBlogPosts(locale, 1, 3)
  ]);
  const payload = homeData?.data || {};
  const latestBlogs = blogsResponse?.data?.data || [];
  const tBlogs = await getTranslations('blogs');

  return (
    <div className="bg-[#F6F4EE]">
      <Hero hero={payload.hero} />

      <Categories items={payload.categories || []} />

      <AvailableProperties items={payload.featured_properties || []} />

      <WhyAlOmran items={payload.why_items || []} />

      <BookingSteps items={payload.booking_steps || []} />

      <PackagesSection items={payload.packages || []} token={token} />

      <LatestBlogs posts={latestBlogs} t={tBlogs} locale={locale} />

      {payload.faqs && payload.faqs.length > 0 && (
        <Faq faq_items={payload.faqs} />
      )}

      <HomeCTA cta={payload.cta} />
    </div>
  );
}
