

const resolveRequestLocale = (headers?: Record<string, unknown>): string => {
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

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, unknown>;
}

export const apiErrorMessage = (error: unknown, fallback = ""): string => {
  const body = ((error as Record<string, unknown>)?.data ?? error) as ApiErrorBody;
  if (typeof body?.message === "string" && body.message.trim()) {
    return body.message;
  }
  const first = Object.values(body?.errors ?? {}).flat()[0];
  return typeof first === "string" && first.trim() ? first : fallback;
};

export const apiFieldErrors = (error: unknown): Record<string, string> => {
  const body = (error as Record<string, unknown>)?.data as ApiErrorBody;
  const errors = body?.errors ?? {};
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

const getBaseUrl = (): string => {
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "/backend-api/";
  }
  return "https://api.al3umran.com/api/v1/";
};

const apiServiceCall = async ({
  url,
  method,
  body,
  headers,
}: {
  url: string;
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
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

  const baseUrl = getBaseUrl();
  let fullUrl = url;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    fullUrl = `${baseUrl}${url.replace(/^\//, "")}`;
  }

  try {
    let finalBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (isFormData) {
        finalBody = body as FormData;
      } else {
        finalBody = JSON.stringify(body);
      }
    }

    const response = await fetch(fullUrl, {
      method: method?.toUpperCase() || "GET",
      body: finalBody,
      headers: requestHeaders,
    });

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw {
        data,
        status: response.status,
        message: `HTTP Error ${response.status}: ${response.statusText}`,
      };
    }

    return data;
  } catch (error: unknown) {
    const err = error as Record<string, unknown>;
    // If it's already formatted by our throw above
    if (err.status && err.message) {
      throw err;
    }
    
    // Otherwise it's a generic network error
    throw { data: null, status: 500, message: String(error) };
  }
};

export default apiServiceCall;
