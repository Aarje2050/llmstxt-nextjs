export function getApplicationSchema() {
    return {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "LLMs.txt Generator",
      "applicationCategory": "SEO Tool",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Generate AI-friendly LLMs.txt files to make your website content discoverable by AI search tools.",
      "featureList": [
        "LLMs.txt file generation",
        "Token counting and analytics",
        "AI model cost estimation",
        "URL discovery and mapping"
      ],
      "author": {
        "@type": "Organization",
        "name": "ImmortalSEO"
      }
    };
  }