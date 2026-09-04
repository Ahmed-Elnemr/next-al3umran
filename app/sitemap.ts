import { MetadataRoute } from 'next';
import { getProperties, getCategories } from '../src/lib/api/client';
import { getBlogPosts } from '../src/lib/serverActions';

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://al3umran.com';
  
  // Core routes for the platform
  const coreRoutes = [
    '',
    '/properties',
    '/services',
    '/categories',
    '/blogs',
    '/technical-support',
    '/about-us',
    '/login',
    '/register',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add Arabic and English variants for each core route
  coreRoutes.forEach((route) => {
    ['ar', 'en'].forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' || route === '/properties' ? 'daily' : 'weekly',
        priority: route === '' ? 1 : route === '/properties' ? 0.9 : 0.8,
      });
    });
  });

  try {
    const [propertiesRes, blogsRes, categoriesRes] = await Promise.all([
      getProperties('ar', 'per_page=100'),
      getBlogPosts('ar', 1, 100),
      getCategories('ar')
    ]);

    // Properties
    const propertiesRows = propertiesRes?.data?.data || propertiesRes?.data?.properties || propertiesRes?.data || [];
    const properties = Array.isArray(propertiesRows) ? propertiesRows : [];
    
    properties.forEach((property: any) => {
      if (property.id) {
        ['ar', 'en'].forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/properties/${property.id}`,
            lastModified: new Date(property.updated_at || property.created_at || new Date()),
            changeFrequency: 'daily',
            priority: 0.8,
          });
        });
      }
    });

    // Blogs
    const blogs = blogsRes?.data?.data || [];
    blogs.forEach((blog: any) => {
      if (blog.slug || blog.id) {
        ['ar', 'en'].forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/blogs/${blog.slug || blog.id}`,
            lastModified: new Date(blog.updated_at || blog.created_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        });
      }
    });

    // Categories
    const categoriesRows = categoriesRes?.data?.data || categoriesRes?.data || [];
    const categories = Array.isArray(categoriesRows) ? categoriesRows : [];
    categories.forEach((cat: any) => {
      if (cat.id) {
        ['ar', 'en'].forEach((locale) => {
          sitemapEntries.push({
            url: `${baseUrl}/${locale}/category/${cat.id}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        });
      }
    });

  } catch (error) {
    console.error("Error generating dynamic sitemap:", error);
  }

  return sitemapEntries;
}
