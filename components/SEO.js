import Head from 'next/head';

export default function SEO({
  title = 'LLMs.txt Generator | Optimize Your Website for AI Search Engines',
  description = 'Generate AI-friendly LLMs.txt files to make your website content discoverable by ChatGPT, Claude, and other AI search tools.',
  canonical = 'https://llms-txt-generator.com/',
  ogImage = 'https://llms-txt-generator.com/images/llms-txt-preview.png',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonical} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
    </Head>
  );
}