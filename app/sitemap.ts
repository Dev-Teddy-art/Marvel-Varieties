// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getProductsAction } from '@/lib/actions';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://marvelvarieties.com'; // Your live domain

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const products = await getProductsAction();
    const productUrls: MetadataRoute.Sitemap = (products || []).map((p: any) => ({
      url: `${baseUrl}/?category=${encodeURIComponent(p.category)}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));

    return [...staticPages, ...productUrls];
  } catch (err) {
    return staticPages;
  }
}