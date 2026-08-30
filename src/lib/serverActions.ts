"use server";

import { cookies } from "next/headers";
import apiServiceCall from "./apiServiceCall";
import { errorsHandling } from "./helper";

export const getSingleCourse = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `courses/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: null };
  }
};
export const getSingleCategory = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `categories/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: null };
  }
};

export const getSingleService = async (lang: string, id: string) => {
  try {
    const data = await apiServiceCall({
      url: `services/${id}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: null };
  }
};

export const getProfile = async (lang: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    const data = await apiServiceCall({
      url: `getProfile`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: null };
  }
};
export const getMyServices = async (lang: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    const data = await apiServiceCall({
      url: `user/services`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: [] };
  }
};

export const getMyProperties = async (lang: string, page: number = 1) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 

    const data = await apiServiceCall({
      url: `client/my/properties?page=${page}&per_page=12`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: { data: [], meta: null } };
  }
};

export const getMyPropertyAction = async (lang: string, id: string | number) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; 
    if (!token) return { data: null };

    const data = await apiServiceCall({
      url: `client/my/properties/${id}`,
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Accept-Language": lang,
      },
    });
    return data;
  } catch (error) {
    return { data: null };
  }
};

export const getHomeData = async (lang: string) => {
  try {
    const data = await apiServiceCall({
      url: "client/home",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: {} };
  }
};

export const getGeneralSettings = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "client/general-settings",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: {} };
  }
};

export const getPublicCategories = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "categories",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: [] };
  }
};

export const getContactData = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "client/contact",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: {} };
  }
};

export const getAboutUs = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "about-us",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: {} };
  }
};

export const getPrivacy = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "client/privacy",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: {} };
  }
};

export const getTerms = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "client/terms",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: {} };
  }
};

export const getSiteServices = async (lang: string) => {
  try {
    return await apiServiceCall({
      url: "services",
      headers: { "Accept-Language": lang, "X-Locale": lang },
    });
  } catch (error) {
    return { data: [] };
  }
};

export const getSettingsData = async (lang: string) => {
  return getContactData(lang);
};

export const getNotifications = async (lang: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return { data: [] };
  }

  try {
    return await apiServiceCall({
      url: "notifications",
      headers: {
        "Accept-Language": lang,
        "X-Locale": lang,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return { data: [] };
  }
};

export const getNotificaionsCount = async (lang: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    return { data: { unread_count: 0 } };
  }

  try {
    return await apiServiceCall({
      url: "notifications/unread-count",
      headers: {
        "Accept-Language": lang,
        "X-Locale": lang,
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return { data: { unread_count: 0 } };
  }
};


export const getBlogPosts = async (lang: string, page: number = 1, perPage?: number) => {
  try {
    let url = `client/blogs?page=${page}`;
    if (perPage) {
      url += `&per_page=${perPage}`;
    }
    
    const data = await apiServiceCall({
      url: url,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: { data: [], meta: null } };
  }
};

export const getSingleBlogPost = async (lang: string, slug: string) => {
  try {
    const data = await apiServiceCall({
      url: `client/blogs/${slug}`,
      headers: { "Accept-Language": lang },
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: null };
  }
};

export const postBlogComment = async (lang: string, blogId: string, content: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const headers: any = { "Accept-Language": lang };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const data = await apiServiceCall({
      url: `client/blogs/${blogId}/comments`,
      method: "POST",
      body: { content },
      headers,
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return null;
  }
};

export const toggleFavoriteAction = async (lang: string, propertyId: number | string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const headers: any = { "Accept-Language": lang };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const data = await apiServiceCall({
      url: `client/favorites/${propertyId}`,
      method: "POST",
      headers,
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return null;
  }
};

export const getFavoritesAction = async (lang: string) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return { data: [] };
    }
    const headers: any = { "Accept-Language": lang, Authorization: `Bearer ${token}` };

    const data = await apiServiceCall({
      url: `client/favorites`,
      method: "GET",
      headers,
    });
    return data;
  } catch (error) {
    errorsHandling(error, lang);
    return { data: [] };
  }
};