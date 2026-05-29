import { getHomeData  } from "../../src/lib/serverActions";
import { cookies } from "next/headers";

interface LayoutProps {
  params: Promise<{ locale: string | any }>;
}

export default async function HomePage({ params }: LayoutProps) {
  const { locale } = await params;
    const cookieStore =  await cookies();
    const token = cookieStore.get("token")?.value;
     
  const homeData = await getHomeData(locale);
  const sliders = homeData?.data?.sliders || [];
  const about_page = homeData?.data?.about_page || [];
  const categories = homeData?.data?.categories || [];
  const events = homeData?.data?.services || [];
  const faq_items = homeData?.data?.faq_items || [];
  const steps = homeData?.data?.service_flow || [];


  return (
    <div className="">
      {/* <Whatsapp whatsapp = {whatsapp}/> */}
       Hello Everyone
    </div>
  );
}
