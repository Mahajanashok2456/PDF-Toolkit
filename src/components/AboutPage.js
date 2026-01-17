import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { ShineButton } from "./ShineButton";

const AboutPage = () => {
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
          <h1 className="text-4xl md:text-5xl font-bold text-modern-calm-alabaster-grey mb-6">
            About Our PDF Tools Platform
          </h1>

          <div className="space-y-8 text-modern-calm-dusty-denim leading-relaxed">
            <p className="text-lg">
              Our platform is a fast, secure, and easy-to-use online PDF
              solution designed to handle all your document needs in one place.
              From merging and splitting PDFs to converting, protecting, and
              optimizing files, we provide powerful PDF tools that work
              instantly in your browser.
            </p>

            <p className="text-lg">
              We created this service to solve a simple problem: PDF tools
              should be reliable, affordable, and private. No unnecessary
              sign-ups, no complicated workflows, and no loss of document
              quality.
            </p>

            {/* What We Do Section */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                What We Do
              </h2>
              <p className="text-lg mb-4">
                We offer a complete suite of online PDF tools, including:
              </p>
              <ul className="space-y-3">
                {[
                  "Merge multiple PDF files into one",
                  "Split PDFs into separate documents",
                  "Remove or extract pages",
                  "Rotate PDF pages",
                  "Convert PDF to Word and Word to PDF",
                  "Convert JPG images to PDF",
                  "Convert HTML to PDF",
                  "Protect PDFs with password security",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheckCircle className="text-modern-calm-dusk-blue mt-1 mr-3 flex-shrink-0" />
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg mt-4">
                Each tool is optimized for speed, accuracy, and file integrity,
                ensuring your documents remain professional and usable.
              </p>
            </div>

            {/* Why Choose Us Section */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Why Choose Us
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    title: "High-Quality Output",
                    description:
                      "Original formatting and clarity are preserved.",
                  },
                  {
                    title: "Fast Processing",
                    description: "Most operations complete in seconds.",
                  },
                  {
                    title: "Secure & Private",
                    description:
                      "Files are processed safely and deleted automatically.",
                  },
                  {
                    title: "Browser-Based",
                    description: "No software installation required.",
                  },
                  {
                    title: "User-Friendly",
                    description: "Simple interface, zero learning curve.",
                  },
                ].map((benefit, index) => (
                  <div
                    key={index}
                    className="bg-modern-calm-ink-black rounded-lg p-6"
                  >
                    <h3 className="text-xl font-semibold text-modern-calm-alabaster-grey mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-modern-calm-dusty-denim">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Our Mission Section */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Our Mission
              </h2>
              <p className="text-lg">
                Our mission is to become a trusted all-in-one PDF management
                platform for students, professionals, and businesses worldwide.
                We aim to remove technical barriers and make document handling
                simple, efficient, and secure for everyone.
              </p>
            </div>

            {/* Built for Everyday Use Section */}
            <div className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Built for Everyday Use
              </h2>
              <p className="text-lg">
                Whether you're editing reports, sharing contracts, converting
                images, or securing sensitive files, our tools are built to
                support real-world workflows with consistent performance.
              </p>
            </div>

            {/* CTA Section */}
            <div className="mt-12 text-center">
              <Link to="/#tools">
                <ShineButton className="inline-flex">
                  Explore Our Tools
                </ShineButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
