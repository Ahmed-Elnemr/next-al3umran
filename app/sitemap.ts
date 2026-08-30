import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://alomran.com';
  
  // Core routes for the platform
  const routes = [
    '',
    '/properties',
    '/services',
    '/categories',
    '/blogs',
    '/contact',
    '/about',
    '/login',
    '/register',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add Arabic and English variants for each route
  routes.forEach((route) => {
    sitemapEntries.push({
      url: `${baseUrl}/ar${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' || route === '/properties' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : route === '/properties' ? 0.9 : 0.8,
    });
    sitemapEntries.push({
      url: `${baseUrl}/en${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' || route === '/properties' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : route === '/properties' ? 0.9 : 0.8,
    });
  });

  return sitemapEntries;
}
