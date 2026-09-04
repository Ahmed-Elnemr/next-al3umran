import { toast } from "react-toastify";

export const errorsHandling = (
  error: unknown,
  lang: string,
  client?: boolean
) => {
  const err = (error || {}) as { data?: unknown; status?: number; message?: string };

  const path =
    typeof window !== "undefined"
      ? window.location.pathname
      : "/";

  // 🚫 لو الصفحة الرئيسية → لا تعيد التوجيه نهائيًا
  if (path === `/${lang}` || path === `/${lang}/`) {
    console.warn("Prevented redirect loop on home page");
    return; // تجاهل الـ error
  }

  // -------------------------
  // 401 → redirect للصفحة الرئيسية
  // -------------------------
  if (err.status === 401) {
    if (client) {
      window.location.href = `/${lang}`;
    } else {
      // redirect(`/${lang}`);
    }
    return;
  }

  // -------------------------
  // رسائل login first
  // -------------------------
  if (client) {
    if (
      err?.message === "الرجاء تسجيل الدخول أولاً" ||
      err?.message === "please login first"
    ) {
      window.location.href = `/${lang}`;
    } else {
      toast.error(err?.message || (err?.data as any)?.message || "An error occurred");
    }
  } else {
    if (err && typeof err === "object" && Object.keys(err).length > 0) {
      console.warn("Server-side warning in errorsHandling:", err.message || error);
    }
  }
};

export const ensureHttps = (url?: string): string => {
  if (!url) return "";
  if (url.startsWith("http://")) {
    return url.replace(/^http:\/\//i, "https://");
  }
  return url;
};
