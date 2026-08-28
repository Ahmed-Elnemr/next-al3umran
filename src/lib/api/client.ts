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

export const getHome = (locale: string) => fetchClient("client/home", locale);
export const getProperties = async (locale: string, query = "") => {
  const queryString = query ? `?${query}` : "";
  try {
    return await fetchClient(`client/properties${queryString}`, locale);
  } catch {
    return fetchClient(`properties${queryString}`, locale);
  }
};

export const getProperty = async (locale: string, id: string | number) => {
  try {
    return await fetchClient(`client/properties/${id}`, locale);
  } catch {
    return fetchClient(`properties/${id}`, locale);
  }
};

export const getCategories = async (locale: string) => {
  try {
    return await fetchClient("client/categories", locale);
  } catch {
    try {
      return await fetchClient("categories", locale);
    } catch {
      return { data: [] };
    }
  }
};

export const getCategory = async (locale: string, id: string | number) => {
  try {
    return await fetchClient(`client/categories/${id}`, locale);
  } catch {
    return fetchClient(`categories/${id}`, locale);
  }
};

export const postContactMessage = (locale: string, body: Record<string, unknown>) =>
  fetchClient("client/contact-us", locale, { method: "POST", body });
export const getPackages = (locale: string) => fetchClient("packages", locale);
export const getFaqs = (locale: string) => fetchClient("faqs", locale);
export const getCompanies = async (locale: string, query = "") => {
  try {
    return await fetchClient(`client/companies${query ? `?${query}` : ""}`, locale);
  } catch {
    return fetchClient(`companies${query ? `?${query}` : ""}`, locale);
  }
};
export const getCompany = async (locale: string, id: string | number) => {
  try {
    return await fetchClient(`client/companies/${id}`, locale);
  } catch {
    return fetchClient(`companies/${id}`, locale);
  }
};
export const postCompanyReview = (
  locale: string,
  id: string | number,
  body: { rating: number; comment?: string },
  token: string
) => fetchClient(`client/companies/${id}/reviews`, locale, { method: "POST", body, token });
export const getCountries = async (locale: string) => {
  try {
    return await fetchClient("client/countries", locale);
  } catch {
    return fetchClient("countries", locale);
  }
};
export const getCities = async (locale: string, countryId?: number | string) => {
  const path = countryId ? `?country_id=${countryId}` : "";
  try {
    return await fetchClient(`client/cities${path}`, locale);
  } catch {
    return fetchClient(`cities${path}`, locale);
  }
};
export const getProfile = (locale: string, token: string) =>
  fetchClient("client/profile", locale, { token });
export const updateProfile = (locale: string, token: string, body: FormData) =>
  fetchClient("client/profile", locale, { method: "POST", body, token });
export const changePhone = (locale: string, token: string, body: Record<string, unknown>) =>
  fetchClient("client/profile/change-phone", locale, { method: "POST", body, token });
export const deleteProfile = (locale: string, token: string) =>
  fetchClient("client/profile", locale, { method: "DELETE", token });

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
  if (!item) return null;
  const listingType = item.listing_type === "rent" ? "rent" : "sale";
  const categorySlug = item.category?.slug || item.category_slug || "apartment";
  const typeMap: Record<string, string> = {
    apartments: "apartment",
    villas: "villa",
    lands: "land",
    chalets: "chalet",
    offices: "office",
    "new-projects": "house",
    apartment: "apartment",
    villa: "villa",
    land: "land",
    chalet: "chalet",
    office: "office",
    house: "house",
  };
  const title = item.title || item.name || "";
  const location = item.location || item.city?.name || item.address || "";
  const company = item.company?.name || item.company_name || "";
  const code = item.currency || "AED";
  const money = formatMoney(item.price, code, locale, item.currency_label);
  const mainImg = item.image || item.image_url || item.main_image || item.cover_image || (item.gallery && item.gallery[0]) || "";
  const galleryImgs = (item.gallery && item.gallery.length > 0) ? item.gallery : (mainImg ? [mainImg] : []);

  return {
    id: item.id,
    image: mainImg,
    gallery: galleryImgs,
    titleAr: title,
    titleEn: title,
    countryAr: item.country?.name || item.country_name || "",
    countryEn: item.country?.name || item.country_name || "",
    cityAr: item.city?.name || item.city_name || "",
    cityEn: item.city?.name || item.city_name || "",
    locationAr: location,
    locationEn: location,
    price: Number(item.price || 0),
    priceAr: money,
    priceEn: money,
    currencyAr: currencyLabel(code, "ar", locale === "ar" ? item.currency_label : undefined),
    currencyEn: currencyLabel(code, "en", locale === "en" ? item.currency_label : undefined),
    status: listingType,
    type: typeMap[categorySlug] || "apartment",
    companyId: String(item.company?.id || item.company_id || ""),
    companyAr: company,
    companyEn: company,
    companyLogo: item.company?.logo || item.company_logo,
    whatsapp: item.whatsapp || item.company?.phone || item.phone || "",
    phone: item.phone || item.company?.phone || "",
    email: item.email || item.company?.email || "",
    beds: item.bedrooms ?? item.beds ?? 0,
    baths: item.bathrooms ?? item.baths ?? 0,
    area: item.area || 0,
    createdAt: item.created_at || new Date().toISOString(),
    descriptionAr: item.description || "",
    descriptionEn: item.description || "",
    category: item.category?.slug || item.category,
    categoryId: item.category?.id || item.category_id,
    features: (item.features || []).map((feature: any) => (typeof feature === "object" ? feature.value || feature.name || feature.title : String(feature))),
  };
}
