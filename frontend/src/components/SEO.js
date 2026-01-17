import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSEOData, getStructuredData } from "../utils/seoConfig";
import { getRemoteRatingStats } from "../utils/ratingSystem";

const SEO = () => {
  const location = useLocation();
  const [ratingStats, setRatingStats] = useState(null);

  useEffect(() => {
    // Fetch rating stats for structured data
    const fetchRatings = async () => {
      const stats = await getRemoteRatingStats();
      setRatingStats(stats);
    };

    if (location.pathname === "/" || location.pathname === "") {
      fetchRatings();
    }
  }, [location.pathname]);

  useEffect(() => {
    const seoData = getSEOData(location.pathname);
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    // Update document title
    document.title = seoData.title;

    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = seoData.description;

    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.name = "keywords";
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seoData.keywords;

    // Open Graph
    const ogTags = [
      { property: "og:title", content: seoData.title },
      { property: "og:description", content: seoData.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: window.location.href },
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Twitter
    const twitterTags = [
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: seoData.title },
      { name: "twitter:description", content: seoData.description },
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    });

    // Structured Data (JSON-LD)
    const structuredData = getStructuredData(location.pathname, ratingStats);
    if (structuredData) {
      let structuredDataScript = document.querySelector(
        'script[type="application/ld+json"]',
      );
      if (!structuredDataScript) {
        structuredDataScript = document.createElement("script");
        structuredDataScript.type = "application/ld+json";
        document.head.appendChild(structuredDataScript);
      }
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      let structuredDataScript = document.querySelector(
        'script[type="application/ld+json"]',
      );
      if (structuredDataScript) {
        structuredDataScript.remove();
      }
    }
  }, [location.pathname, ratingStats]);

  return null;
};

export default SEO;
