// SEO Configuration for all pages
export const seoConfig = {
  "merge-pdf": {
    title: "Merge PDFs Online Free – Combine Multiple PDF Files",
    description:
      "Merge multiple PDF files into a single document online for free. Fast, secure, and browser-based PDF merging with no signup.",
    keywords: "merge pdf, combine pdf files, join pdf online, pdf merger free",
  },
  "split-pdf": {
    title: "Split PDF Online – Divide PDF Files into Pages",
    description:
      "Split PDF files into separate pages or ranges online. Extract or divide PDFs instantly with a fast and secure tool.",
    keywords: "split pdf, divide pdf, extract pdf pages, pdf splitter online",
  },
  "remove-pages": {
    title: "Remove Pages from PDF – Delete PDF Pages Online",
    description:
      "Delete unwanted pages from PDF files online. Simple, fast, and secure PDF page removal with no signup required.",
    keywords:
      "remove pdf pages, delete pdf pages, pdf page remover, edit pdf pages",
  },
  "extract-pages": {
    title: "Extract Pages from PDF – Save Selected Pages Online",
    description:
      "Extract selected pages from a PDF and save them as a new file. Fast, accurate, and secure PDF page extraction.",
    keywords:
      "extract pdf pages, save pdf pages, pdf page extractor, split pdf pages",
  },
  "rotate-pdf": {
    title: "Rotate PDF Pages Online – Fix PDF Orientation",
    description:
      "Rotate PDF pages clockwise or counterclockwise online. Fix scanned or misaligned PDFs instantly.",
    keywords:
      "rotate pdf, fix pdf orientation, turn pdf pages, pdf rotation tool",
  },
  "jpg-to-pdf": {
    title: "JPG to PDF Converter – Convert Images to PDF",
    description:
      "Convert JPG images into high-quality PDF documents online. Fast, secure, and easy image to PDF conversion.",
    keywords: "jpg to pdf, image to pdf, convert jpg to pdf, photos to pdf",
  },
  "word-to-pdf": {
    title: "Word to PDF Converter – Convert DOCX to PDF Online",
    description:
      "Convert Word documents into professional PDF files online. Maintain formatting and layout perfectly.",
    keywords:
      "word to pdf, docx to pdf, convert word to pdf, create pdf from word",
  },
  "html-to-pdf": {
    title: "HTML to PDF Converter – Convert Web Pages to PDF",
    description:
      "Convert HTML files or web pages into clean PDF documents online. Ideal for reports, invoices, and archiving.",
    keywords:
      "html to pdf, webpage to pdf, convert html to pdf, website to pdf",
  },
  "protect-pdf": {
    title: "Protect PDF with Password – Secure PDF Files Online",
    description:
      "Add password protection to PDF files online. Secure your documents with encryption and access control.",
    keywords: "protect pdf, password protect pdf, secure pdf, encrypt pdf",
  },
  "organize-pdf": {
    title: "Organize PDF Pages – Reorder & Rearrange PDF Pages Online",
    description:
      "Organize, reorder, and rearrange PDF pages easily online. Rotate, remove, or extract pages with a simple drag-and-drop interface.",
    keywords:
      "organize pdf, reorder pdf pages, rearrange pdf, pdf page organizer",
  },
  "edit-pdf": {
    title: "Edit PDF Online – Add Page Numbers & Annotations",
    description:
      "Edit PDF files online by adding page numbers, annotations, and more. Free and easy-to-use PDF editing tools.",
    keywords: "edit pdf, add page numbers, pdf editor online, annotate pdf",
  },
  "pdf-security": {
    title: "PDF Security – Protect & Encrypt PDF Files Online",
    description:
      "Secure your PDF files with password protection and encryption. Keep your documents safe and private online.",
    keywords:
      "pdf security, encrypt pdf, password protect pdf, secure pdf files",
  },
  "privacy-policy": {
    title: "Privacy Policy – PDF Toolkit | Your Files Stay Private",
    description:
      "Read PDF Toolkit's Privacy Policy. We never store, track, or share your files. 100% secure and privacy-first PDF processing.",
    keywords:
      "pdf toolkit privacy policy, secure pdf tools, pdf data privacy, no file storage pdf",
  },
  "terms-of-service": {
    title: "Terms of Service – PDF Toolkit | Usage Rules & Conditions",
    description:
      "Review the Terms of Service for using PDF Toolkit. Clear guidelines, user responsibilities, and service conditions.",
    keywords:
      "pdf toolkit terms of service, online pdf terms, pdf usage policy, pdf toolkit terms",
  },
  support: {
    title: "Support – PDF Toolkit | Get Help with PDF Tools",
    description:
      "Need help using PDF Toolkit? Contact support for assistance, troubleshooting, and guidance on all PDF tools.",
    keywords:
      "pdf toolkit support, pdf help center, pdf tools support, online pdf help",
  },
  "contact-us": {
    title: "Contact Us – PDF Toolkit | Get in Touch",
    description:
      "Contact PDF Toolkit for support, feedback, or business inquiries. We're here to help with all PDF-related needs.",
    keywords:
      "contact pdf toolkit, pdf support contact, pdf tools contact, pdf help email",
  },
  faq: {
    title: "FAQ – PDF Toolkit | Frequently Asked Questions",
    description:
      "Find answers to common questions about PDF Toolkit, file security, supported tools, limits, and usage.",
    keywords:
      "pdf toolkit faq, pdf tools questions, pdf toolkit help, pdf common questions",
  },
  about: {
    title: "About PDF Toolkit – Free, Secure & Easy PDF Tools",
    description:
      "Learn about PDF Toolkit and our mission to provide fast, free, and privacy-focused online PDF tools for everyone.",
    keywords:
      "about pdf toolkit, free pdf tools, secure pdf editor, online pdf services",
  },
  default: {
    title: "Free PDF Tools Online – Merge, Split, Convert & Edit PDFs",
    description:
      "All-in-one PDF toolkit for merging, splitting, converting, and editing PDFs online. Fast, secure, and free PDF tools with no signup required.",
    keywords:
      "pdf tools, pdf converter, pdf editor, merge pdf, split pdf, convert pdf",
  },
};

export const getSEOData = (pathname) => {
  // Remove leading slash and get route key
  const route = pathname.replace(/^\//, "");

  // Return SEO data for the route or default
  return seoConfig[route] || seoConfig.default;
};

// Structured data (JSON-LD) - ONLY for homepage
// Automatically includes real ratings from backend if available
export const getStructuredData = (pathname, ratingData = null) => {
  const route = pathname.replace(/^\//, "");

  // Only return structured data for homepage
  if (route === "" || route === "/") {
    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Free PDF Tools",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      description:
        "All-in-one PDF toolkit for merging, splitting, converting, and editing PDFs online. Fast, secure, and free PDF tools with no signup required.",
    };

    // Use ratingData if it's valid
    if (ratingData && ratingData.isValid) {
      baseSchema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: ratingData.ratingValue.toString(),
        ratingCount: ratingData.ratingCount.toString(),
      };
    }

    return baseSchema;
  }

  // No structured data for other pages
  return null;
};
