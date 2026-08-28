import { getHomeData } from "@/lib/serverActions";
import PackagesView from "./PackagesView";

interface LayoutProps {
  params: Promise<{ locale: string }>;
}

export const dynamic = "force-dynamic";

export default async function PackagesPage({ params }: LayoutProps) {
  const { locale } = await params;
  const homeData = await getHomeData(locale);
  const payload = homeData?.data || {};

  return <PackagesView initialPackages={payload.packages || []} />;
}
