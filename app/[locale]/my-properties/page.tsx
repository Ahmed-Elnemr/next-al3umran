import React from "react";
import Image from "next/image";
import { getMyProperties } from "../../../src/lib/serverActions";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import Link from "next/link";
import { Plus, MapPin, Bed, Bath, Maximize } from "lucide-react";
import ServicesActions from "../my-services/ServicesActions";// Keeping the actions component for now
import { ensureHttps } from "../../../src/lib/helper";

interface LayoutProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const page = async ({ params, searchParams }: LayoutProps) => {
  const { locale } = await params;
  const t = await getTranslations("services"); 
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const role = cookieStore.get("client_type")?.value;

  const search = await searchParams;
  const pageNumber = Number(search?.page) || 1;

  const response = await getMyProperties(locale, pageNumber);
  const properties = response?.data?.data || [];
  const meta = response?.data?.meta || null;

  const isAr = locale === "ar";

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-center sm:text-left text-[#101820]">
          {isAr ? "عقاراتي" : "My Properties"}
        </h1>

        {role === "company" && (
          <Link
            href={`/${locale}/add-your-property`}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-[#0E6B58] text-white font-medium rounded-lg hover:bg-[#0E6B58]/90 transition-colors duration-200 shadow-sm hover:shadow-md self-center"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm sm:text-base">
              {isAr ? "إضافة عقار جديد" : "Add New Property"}
            </span>
          </Link>
        )}
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500 font-medium">
            {isAr ? "لا يوجد عقارات مضافة بعد" : "No properties found"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <div
              key={property.id}
              className="bg-white rounded-[24px] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-[#E4DED1] group flex flex-col"
            >
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden bg-gray-100 flex items-center justify-center">
                {property.image ? (
                  <Image
                    src={ensureHttps(property.image)}
                    alt={property.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-gray-300">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="bg-[#C89B3C] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    {property.listing_type === 'rent' 
                      ? (isAr ? 'للإيجار' : 'For Rent')
                      : (isAr ? 'للبيع' : 'For Sale')}
                  </span>
                  {property.category?.name && (
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {property.category.name}
                    </span>
                  )}
                </div>
                
                {property.status === 'pending' && (
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                      {isAr ? 'قيد المراجعة' : 'Pending'}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-3">
                  <p className="text-[#C89B3C] font-black text-xl flex items-end gap-1">
                    {property.price.toLocaleString()}
                    <span className="text-sm font-semibold text-gray-500 mb-1">
                      {property.currency_label || property.currency}
                    </span>
                    {property.listing_type === 'rent' && property.rent_period && (
                      <span className="text-xs font-medium text-gray-400 mb-1 ml-1">
                        / {isAr ? (property.rent_period === 'month' ? 'شهر' : property.rent_period === 'year' ? 'سنة' : 'يوم') : property.rent_period}
                      </span>
                    )}
                  </p>
                </div>

                <h3 className="font-bold text-lg text-[#101820] mb-2 line-clamp-1 group-hover:text-[#0E6B58] transition-colors">
                  {property.title}
                </h3>
                
                <p className="text-gray-500 text-sm flex items-center gap-1.5 mb-4 line-clamp-1">
                  <MapPin className="w-4 h-4 text-[#0E6B58]" />
                  {property.location}
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-3 gap-2 py-4 border-y border-gray-100 mb-4 mt-auto">
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Bed className="w-5 h-5 text-[#9BAAA5]" />
                    <span className="text-xs font-bold text-[#101820]">{property.bedrooms || 0}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 border-x border-gray-100">
                    <Bath className="w-5 h-5 text-[#9BAAA5]" />
                    <span className="text-xs font-bold text-[#101820]">{property.bathrooms || 0}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Maximize className="w-5 h-5 text-[#9BAAA5]" />
                    <span className="text-xs font-bold text-[#101820]">{property.area || 0} م²</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex flex-col gap-2">
                  <ServicesActions service={property} token={token || ""} type="property" />
                  
                  <Link 
                    href={`/${locale}/add-your-property?editId=${property.id}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-[#EEF6F3] text-[#101820] hover:text-[#0E6B58] font-bold rounded-xl border border-gray-200 hover:border-[#0E6B58]/30 transition-all text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {isAr ? 'تعديل العقار' : 'Edit Property'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {meta && meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          {meta.links.map((link: any, index: number) => {
            const isPrev = link.label.includes('Previous') || link.label.includes('السابق') || link.label.includes('&laquo;');
            const isNext = link.label.includes('Next') || link.label.includes('التالي') || link.label.includes('&raquo;');
            
            let label = link.label;
            if (isPrev) label = isAr ? 'السابق' : 'Prev';
            if (isNext) label = isAr ? 'التالي' : 'Next';

            return (
              <Link
                key={index}
                href={link.url ? `/${locale}/my-properties?page=${link.url.split('page=')[1]}` : '#'}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  link.active
                    ? 'bg-[#0E6B58] text-white shadow-md'
                    : link.url
                    ? 'bg-white text-[#101820] border border-[#E4DED1] hover:bg-[#EEF6F3] hover:text-[#0E6B58]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                dangerouslySetInnerHTML={{ __html: label }}
                onClick={(e) => !link.url && e.preventDefault()}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default page;
