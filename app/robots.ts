import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/quiz', '/api/', '/signin', '/signup', '/upgrade/cancel'],
    },
    sitemap: 'https://studibudi.vercel.app/sitemap.xml',
  }
}
