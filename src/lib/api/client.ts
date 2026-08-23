import apiServiceCall from "../apiServiceCall";

export async function fetchClient<T = any>(
  path: string,
  locale: string,
  options: { method?: string; body?: any; token?: string } = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Accept-Language": locale,
    "X-Locale": locale,
  };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  return apiServiceCall({
    url: path,
    method: options.method,
    body: options.body,
    headers,
  });
}

export const getHome = (locale: string) => fetchClient("home", locale);
export const getProperties = (locale: string, query = "") =>
  fetchClient(`properties${query ? `?${query}` : ""}`, locale);
export const getProperty = (locale: string, id: string | number) =>
  fetchClient(`properties/${id}`, locale);
export const getCategories = (locale: string) => fetchClient("categories", locale);
export const getCategory = (locale: string, id: string | number) =>
  fetchClient(`categories/${id}`, locale);
export const postContactMessage = (locale: string, body: Record<string, unknown>) =>
  fetchClient("contact-us", locale, { method: "POST", body });
export const getPackages = (locale: string) => fetchClient("packages", locale);
export const getFaqs = (locale: string) => fetchClient("faqs", locale);
export const getCompanies = (locale: string, query = "") =>
  fetchClient(`companies${query ? `?${query}` : ""}`, locale);
export const getCompany = (locale: string, id: string | number) =>
  fetchClient(`companies/${id}`, locale);
export const postCompanyReview = (
  locale: string,
  id: string | number,
  body: { rating: number; comment?: string },
  token: string
) => fetchClient(`companies/${id}/reviews`, locale, { method: "POST", body, token });
export const getCountries = (locale: string) => fetchClient("countries", locale);
export const getCities = (locale: string, countryId?: number | string) =>
  fetchClient(`cities${countryId ? `?country_id=${countryId}` : ""}`, locale);
export const getProfile = (locale: string, token: string) =>
  fetchClient("profile", locale, { token });
export const updateProfile = (locale: string, token: string, body: FormData) =>
  fetchClient("profile", locale, { method: "POST", body, token });

export function envelopeList(res: any): any[] {
  const data = res?.data;
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

export function localizedText(value: unknown, locale = "ar"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const pick = obj[locale] ?? obj.ar ?? obj.en ?? obj.name;
    return typeof pick === "string" ? pick : "";
  }
  return String(value);
}

const CURRENCY_LABELS: Record<string, { ar: string; en: string }> = {
  AED: { ar: "درهم", en: "AED" },
  USD: { ar: "دولار", en: "USD" },
  SAR: { ar: "ريال", en: "SAR" },
  EGP: { ar: "جنيه", en: "EGP" },
};

export function currencyLabel(currency: string, locale: string, fallback?: string) {
  if (fallback) return fallback;
  const code = String(currency || "AED").toUpperCase();
  const labels = CURRENCY_LABELS[code];
  if (!labels) return code;
  return locale === "ar" ? labels.ar : labels.en;
}

export function formatMoney(price: number, currency: string, locale: string, currencyName?: string) {
  const isAr = locale === "ar";
  const amount = Number(price || 0).toLocaleString(isAr ? "ar-EG" : "en-US");
  const label = currencyLabel(currency, locale, currencyName);
  return isAr ? `${amount} ${label}` : `${label} ${amount}`;
}

export function mapApiProperty(item: any, locale = "ar") {
  const listingType = item.listing_type === "rent" ? "rent" : "sale";
  const categorySlug = item.category?.slug || "apartment";
  const typeMap: Record<string, string> = {
    apartments: "apartment",
    villas: "villa",
    lands: "land",
    chalets: "chalet",
    offices: "office",
    "new-projects": "house",
  };
  const title = item.title || "";
  const location = item.location || item.city?.name || "";
  const company = item.company?.name || "";
  const code = item.currency || "AED";
  const money = formatMoney(item.price, code, locale, item.currency_label);

  return {
    id: item.id,
    image: item.image || item.image || "/images/placeholder-property.jpg",
    gallery: item.gallery?.length ? item.gallery : [item.image || item.image].filter(Boolean),
    titleAr: title,
    titleEn: title,
    countryAr: item.country?.name || "",
    countryEn: item.country?.name || "",
    cityAr: item.city?.name || "",
    cityEn: item.city?.name || "",
    locationAr: location,
    locationEn: location,
    price: Number(item.price || 0),
    priceAr: money,
    priceEn: money,
    currencyAr: currencyLabel(code, "ar", locale === "ar" ? item.currency_label : undefined),
    currencyEn: currencyLabel(code, "en", locale === "en" ? item.currency_label : undefined),
    status: listingType,
    type: typeMap[categorySlug] || "apartment",
    companyId: String(item.company?.id || ""),
    companyAr: company,
    companyEn: company,
    companyLogo: item.company?.logo,
    whatsapp: item.whatsapp,
    phone: item.phone,
    email: item.email,
    beds: item.bedrooms || 0,
    baths: item.bathrooms || 0,
    area: item.area || 0,
    createdAt: item.created_at,
    descriptionAr: item.description || "",
    descriptionEn: item.description || "",
    category: item.category?.slug,
    categoryId: item.category?.id,
    features: (item.features || []).map((feature: any) => feature.value || feature),
  };
}
