/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://oposcore.es',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/dashboard/', '/estudiar/', '/progreso/', '/simulacros/', '/perfil/', '/tutor/'] },
    ],
    additionalSitemaps: [
      'https://oposcore.es/sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/dashboard/*', '/estudiar/*', '/progreso/*', '/simulacros/*', '/perfil/*', '/tutor/*', '/login', '/register'],
}
