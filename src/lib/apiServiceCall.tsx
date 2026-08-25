import axios from "axios";

const resolveRequestLocale = (headers?: Record<string, any>): string => {
  const headerLocale =
    headers?.["X-Locale"] || headers?.["x-locale"] || headers?.["Accept-Language"];
  if (headerLocale) {
    return String(headerLocale).split(",")[0].split("-")[0];
  }
  if (typeof window !== "undefined") {
    const first = window.location.pathname.split("/").filter(Boolean)[0];
    if (first === "ar" || first === "en") {
      return first;
    }
  }
  return "ar";
};

export const apiErrorMessage = (error: any, fallback = ""): string => {
  const body = error?.data ?? error;
  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message;
  }
  const first = Object.values(body?.errors ?? {}).flat()[0];
  return typeof first === "string" && first.trim() ? first : fallback;
};

export const apiFieldErrors = (error: any): Record<string, string> => {
  const errors = error?.data?.errors ?? {};
  const mapped: Record<string, string> = {};
  Object.entries(errors).forEach(([key, value]) => {
    mapped[key] = Array.isArray(value) ? String(value[0] ?? "") : String(value ?? "");
  });
  return mapped;
};

export const isI18nKey = (message?: string): boolean =>
  !!message && /^[a-z][a-z0-9_]*$/i.test(message);

export const translateOrRaw = (t: (key: string) => string, message?: string): string => {
  if (!message) return "";
  return isI18nKey(message) ? t(message) : message;
};

const apiServiceCall = async ({
  url,
  method,
  body,
  headers,
}: {
  url: string;
  method?: string;
  body?: any;
  headers?: any;
}) => {
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const locale = resolveRequestLocale(headers);
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    "Accept-Language": locale,
    "X-Locale": locale,
    ...headers,
  };
  if (isFormData) {
    delete requestHeaders["Content-Type"];
  } else if (!requestHeaders["Content-Type"]) {
    requestHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await axios({
      method: method?.toUpperCase() || "GET",
      url: `${process.env.NEXT_PUBLIC_API_URL}${url.replace(/^\//, "")}`,
      data: body,
      headers: requestHeaders,
    });
    return response?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        data: error.response?.data,
        status: error.response?.status || 500,
        message: error.message,
      };
    }
    console.error("apiServiceCall error:", error);
    throw { data: null, status: 500, message: String(error) };
  }
};

export default apiServiceCall;
