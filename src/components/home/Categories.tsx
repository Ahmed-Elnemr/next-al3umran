"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { Home, Castle, Trees, Building2, Warehouse, Hotel, ArrowLeft, ArrowRight } from "lucide-react";

const ICON_MAP: Record<string, typeof Home> = {
  apartments: Home,
  villas: Castle,
  lands: Trees,
  "new-projects": Building2,
  chalets: Warehouse,
  offices: Hotel,
};

const COLORS = [
  "from-[#0E6B58] to-[#101820]",
  "from-[#8A5A2B] to-[#C89B3C]",
  "from-[#315C3F] to-[#89A86B]",
  "from-[#101820] to-[#0E6B58]",
];

type CategoryItem = {
  id: number;
  name: string;
  slug: string;
  listings_count?: number;
};

const Categories = ({ items = [] }: { items?: CategoryItem[] }) => {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const categories = items.slice(0, 4);

  return (
    <section dir={isAr ? "rtl" : "ltr"} className="py-16 lg:py-24 bg-[#F6F4EE]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-10">
          <div>
            <span className="inline-flex rounded-full bg-[#EEF6F3] text-[#0E6B58] border border-[#DCE6E2] px-4 py-2 text-xs font-black mb-4">
              {isAr ? "أنواع العقارات" : "Property Types"}
            </span>

            <h2 className="text-3xl lg:text-5xl font-black text-[#101820]">
              {isAr ? "اختار نوع العقار المناسب لك" : "Choose your property type"}
            </h2>

            <p className="mt-4 text-[#63756F] leading-7 max-w-2xl">
              {isAr
                ? "تصفح أهم أنواع العقارات داخل منصة العمران بطريقة سهلة وسريعة."
                : "Browse the most important property categories in a simple and fast way."}
            </p>
          </div>

          <Link
            href={`/${locale}/categories`}
            className="h-12 rounded-full bg-white border border-[#E7E1D6] text-[#101820] px-5 flex items-center justify-center gap-2 font-black hover:text-[#0E6B58] transition w-fit"
          >
            {isAr ? "عرض الكل" : "View All"}
            <ArrowIcon size={18} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((item, index) => {
            const Icon = ICON_MAP[item.slug] || Building2;
            const count = item.listings_count ?? 0;

            return (
              <Link
                href={`/${locale}/category/${item.id}`}
                key={item.id}
                className="group rounded-[32px] bg-white border border-[#E7E1D6] p-5 shadow-sm hover:shadow-[0_24px_70px_rgba(16,24,32,0.12)] hover:-translate-y-1 transition"
              >
                <div
                  className={`w-16 h-16 rounded-[24px] bg-gradient-to-br ${COLORS[index % COLORS.length]} text-white flex items-center justify-center mb-8`}
                >
                  <Icon size={30} />
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black text-[#101820]">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[#63756F] mt-2">
                      {isAr ? `${count} عقار` : `${count} listings`}
                    </p>
                  </div>

                  <span className="w-10 h-10 rounded-full bg-[#EEF6F3] text-[#0E6B58] flex items-center justify-center group-hover:bg-[#0E6B58] group-hover:text-white transition">
                    <ArrowIcon size={18} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
