
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  image?: string;
  keywords?: string;
  type?: 'website' | 'article' | 'product';
  schema?: Record<string, any>;
}

const SEO = ({
  title = 'Floregance - Artisanal Handicraft Marketplace',
  description = 'Discover unique handcrafted treasures from artisans around the world. Ethically sourced, traditional craftsmanship for your home and lifestyle.',
  canonicalUrl = 'https://floregance.com',
  image = '/og-image.png',
  keywords = 'artisan, handmade, crafts, handcrafted, ethical shopping, home decor, pottery, textiles, jewelry',
  type = 'website',
  schema,
}: SEOProps) => {
  const baseUrl = 'https://floregance.com'; // Replace with actual domain in production
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;
  const fullCanonicalUrl = canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      
      {/* JSON-LD Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
