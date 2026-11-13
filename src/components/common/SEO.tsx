import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogType?: 'website' | 'article' | 'product';
  ogImage?: string;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
}

const DEFAULT_TITLE = 'AgriEra | Modern Agricultural Commerce & Agronomy Services';
const DEFAULT_DESC =
  'AgriEra: Premium organic bio-fertilizers, crop protection, soil health conditioners, seeds, and expert agricultural diagnostics delivered direct to farmers across India.';
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1200&auto=format&fit=crop&q=80';
const SITE_URL = 'https://agriera.in';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd,
  noindex = false,
}) => {
  const location = useLocation();
  const fullTitle = title
    ? title.includes('AgriEra')
      ? title
      : `${title} | AgriEra`
    : DEFAULT_TITLE;
  const canonicalUrl = canonical || `${SITE_URL}${location.pathname}`;

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for link tags (canonical)
    const setCanonicalTag = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    // 3. Open Graph (OG) Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:site_name', 'AgriEra');

    // 4. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 5. Canonical URL
    setCanonicalTag(canonicalUrl);

    // 6. JSON-LD Structured Data
    const existingJsonLd = document.getElementById('seo-json-ld');
    if (existingJsonLd) {
      existingJsonLd.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'seo-json-ld';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('seo-json-ld');
      if (el) el.remove();
    };
  }, [fullTitle, description, canonicalUrl, ogType, ogImage, jsonLd, noindex]);

  return null;
};

export default SEO;

