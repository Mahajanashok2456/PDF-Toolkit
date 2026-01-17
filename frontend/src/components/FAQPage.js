import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";

const FAQPage = () => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqSections = [
    {
      title: "General Questions",
      faqs: [
        {
          question: "What is this platform used for?",
          answer:
            "This platform provides fast and secure online PDF tools to merge, split, convert, rotate, and protect PDF files directly in your browser.",
        },
        {
          question: "Do I need to create an account?",
          answer:
            "No. Most tools work instantly without registration or login.",
        },
        {
          question: "Is this service free?",
          answer:
            "Core features are available for free. Some advanced features or limits may change in the future.",
        },
      ],
    },
    {
      title: "File Security & Privacy",
      faqs: [
        {
          question: "Are my files safe?",
          answer:
            "Yes. Files are processed securely and automatically deleted after processing. We do not read, store, or share your documents.",
        },
        {
          question: "How long are my files stored?",
          answer:
            "Only for the time required to complete the operation. Files are deleted immediately after processing.",
        },
      ],
    },
    {
      title: "PDF Tools",
      faqs: [
        {
          question: "How do I merge multiple PDFs?",
          answer:
            "Upload your PDFs, arrange them in the desired order, and click Merge. Your combined PDF will be ready to download in seconds.",
        },
        {
          question: "Can I split a PDF into individual pages?",
          answer:
            "Yes. You can split a PDF by page range or extract individual pages into separate files.",
        },
        {
          question: "Can I remove or extract specific pages?",
          answer:
            "Yes. You can delete unwanted pages or extract selected pages into a new PDF.",
        },
        {
          question: "Can I rotate PDF pages?",
          answer:
            "Yes. Rotate pages clockwise or counter-clockwise to fix orientation issues.",
        },
        {
          question: "Does PDF to Word keep formatting?",
          answer:
            "Yes. We preserve layout, fonts, and structure as accurately as possible, though complex designs may vary slightly.",
        },
        {
          question: "Can I convert JPG images to PDF?",
          answer:
            "Yes. Upload images and convert them into high-quality PDFs with optimized file size.",
        },
        {
          question: "Can I convert Word or HTML to PDF?",
          answer:
            "Yes. Word documents and HTML pages can be converted into clean, printable PDFs.",
        },
        {
          question: "Can I protect my PDF with a password?",
          answer:
            "Yes. You can add password protection to restrict access or editing.",
        },
      ],
    },
    {
      title: "Technical Issues",
      faqs: [
        {
          question: "Why did my file fail to process?",
          answer:
            "Common reasons include: Corrupted or damaged files, Unsupported formats, Very large file sizes, Network interruptions. Try re-uploading or splitting the file.",
        },
        {
          question: "Which browsers are supported?",
          answer:
            "All modern browsers including Chrome, Edge, Firefox, and Safari.",
        },
      ],
    },
    {
      title: "Support",
      faqs: [
        {
          question: "How do I contact support?",
          answer:
            "📧 Email: ashokroshan78@gmail.com | 🌐 Website: https://mahajanashok.vercel.app/",
        },
        {
          question: "Who developed this platform?",
          answer:
            "The platform is developed and maintained by Mahajan Ashok. You can view the developer portfolio here: 🔗 https://mahajanashok.vercel.app/",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-modern-calm-ink-black">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <Link
          to="/"
          className="inline-flex items-center text-modern-calm-alabaster-grey hover:text-modern-calm-dusty-denim mb-6 transition-all duration-200 ease-in-out"
        >
          <FaArrowLeft className="mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-modern-calm-alabaster-grey mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-modern-calm-dusty-denim mb-12 text-lg">
            Find answers to common questions about our PDF tools and services
          </p>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-2xl font-bold text-modern-calm-alabaster-grey mb-6">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.faqs.map((faq, faqIndex) => {
                    const globalIndex = `${sectionIndex}-${faqIndex}`;
                    const isExpanded = expandedIndex === globalIndex;

                    return (
                      <div
                        key={globalIndex}
                        className="border border-modern-calm-dusk-blue rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(globalIndex)}
                          className="w-full px-6 py-4 bg-modern-calm-dusk-blue bg-opacity-30 hover:bg-opacity-50 transition-all duration-200 flex items-center justify-between text-left"
                        >
                          <span className="text-modern-calm-alabaster-grey font-semibold">
                            {faq.question}
                          </span>
                          <FaChevronDown
                            className={`text-modern-calm-dusty-denim transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="px-6 py-4 bg-modern-calm-ink-black border-t border-modern-calm-dusk-blue">
                            <p className="text-modern-calm-dusty-denim leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center pt-8 border-t border-modern-calm-dusk-blue">
            <Link to="/#tools">
              <button className="inline-block px-8 py-3 bg-gradient-to-r from-modern-calm-dusk-blue to-modern-calm-dusty-denim text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                Back to Tools
              </button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQPage;
