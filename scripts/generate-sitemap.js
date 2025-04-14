const fs = require('fs');
const path = require('path');
const { globby } = require('globby');

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  // Define base URL for the site
  const baseUrl = 'https://llms-txt-generator.com';
  
  // Get all page paths using globby
  const pages = await globby([
    'pages/**/*.js',
    'pages/*.js',
    '!pages/_*.js',
    '!pages/api',
    '!pages/404.js',
  ]);
  
  // Transform paths to URLs
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(page => {
      // Get the route from the file path
      const route = page
        .replace('pages', '')
        .replace('.js', '')
        .replace(/\/index/g, '');
        
      // Default route is '/'
      const path = route === '' ? '/' : route;
      
      return `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${path === '/' ? 'daily' : 'weekly'}</changefreq>
    <priority>${path === '/' ? '1.0' : '0.7'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  // Write the sitemap to the public directory
  const publicPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(publicPath, sitemap);
  
  console.log('Sitemap generated!');
}

generateSitemap();