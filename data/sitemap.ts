import { MetadataRoute } from 'next';
import linksDataRaw from '@/data/links.json';
import { LinkData } from '@/lib/search';

const linksData = linksDataRaw as LinkData[];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.APP_URL || 'https://sarkarilinkhub.com';
  
  const links = linksData.map((link) => ({
    url: `${baseUrl}/links/${link.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...links,
  ];
}
