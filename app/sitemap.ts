import { MetadataRoute } from 'next';
import links from '@/data/links.json';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://govportal.example.com';

  // Base routes
  const routes = [
    '',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }));

  // Dynamic service routes
  const serviceRoutes = links.map((service) => ({
    url: `${baseUrl}/links/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...routes, ...serviceRoutes];
}
