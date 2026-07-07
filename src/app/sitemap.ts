import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = 'https://ai-news-hub.vercel.app';

  // Core pages
  const staticPages = [
    { url: siteUrl, changeFrequency: 'hourly' as const, priority: 1.0 },
    { url: `${siteUrl}/papers`, changeFrequency: 'hourly' as const, priority: 0.9 },
    { url: `${siteUrl}/monitor`, changeFrequency: 'hourly' as const, priority: 0.7 },
    { url: `${siteUrl}/bookmarks`, changeFrequency: 'daily' as const, priority: 0.3 },
    { url: `${siteUrl}/search`, changeFrequency: 'daily' as const, priority: 0.3 },
  ];

  return staticPages;
}