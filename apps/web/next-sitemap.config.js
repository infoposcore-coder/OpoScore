/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://opometrics.es',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/api/', '/dashboard/', '/estudiar/', '/progreso/', '/simulacros/', '/perfil/', '/tutor/'] },
    ],
    additionalSitemaps: [
      'https://opometrics.es/sitemap.xml',
    ],
  },
  exclude: ['/api/*', '/dashboard/*', '/estudiar/*', '/progreso/*', '/simulacros/*', '/perfil/*', '/tutor/*', '/login', '/register'],
}
