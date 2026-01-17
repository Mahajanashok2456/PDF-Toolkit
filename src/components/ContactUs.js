import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import { ShineButton } from "./ShineButton";

const ContactUs = () => {
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
            Contact Us
          </h1>
          <p className="text-lg text-modern-calm-dusty-denim mb-8">
            Have questions, feedback, or need help with our PDF tools? We'd love
            to hear from you. Reach out using the details below and we'll get
            back to you as soon as possible.
          </p>

          <div className="space-y-8 text-modern-calm-dusty-denim leading-relaxed">
            {/* Get in Touch Section */}
            <section className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-modern-calm-dusk-blue text-xl flex-shrink-0" />
                  <div>
                    <span className="text-lg font-semibold">Email: </span>
                    <a
                      href="mailto:ashokroshan78@gmail.com"
                      className="text-modern-calm-dusk-blue hover:underline text-lg"
                    >
                      ashokroshan78@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FaGlobe className="text-modern-calm-dusk-blue text-xl flex-shrink-0" />
                  <div>
                    <span className="text-lg font-semibold">Website: </span>
                    <a
                      href="https://mahajanashok.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-modern-calm-dusk-blue hover:underline text-lg"
                    >
                      https://mahajanashok.vercel.app/
                    </a>
                  </div>
                </div>
              </div>
              <p className="text-lg">
                Whether you're facing an issue, requesting a feature, or
                exploring collaboration opportunities, feel free to contact us.
              </p>
            </section>

            {/* What You Can Contact Us For Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                What You Can Contact Us For
              </h2>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Support with PDF tools and conversions
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    File processing or download issues
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Feature requests and suggestions
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Security or privacy-related questions
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Business, technical, or collaboration inquiries
                  </span>
                </li>
              </ul>
              <p className="text-lg mt-6 font-semibold">
                We respond with clear and practical solutions.
              </p>
            </section>

            {/* Developer & Technical Contact Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Developer & Technical Contact
              </h2>
              <p className="text-lg mb-4">
                This platform is developed and maintained by{" "}
                <span className="font-semibold text-modern-calm-alabaster-grey">
                  Mahajan Ashok
                </span>
                .
              </p>
              <p className="text-lg mb-3">For:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li className="text-lg">Custom PDF tools</li>
                <li className="text-lg">API integrations</li>
                <li className="text-lg">
                  Full-stack or AI-powered web development
                </li>
                <li className="text-lg">
                  Performance optimization and scalability
                </li>
              </ul>
              <p className="text-lg mb-3">Visit the developer portfolio:</p>
              <div className="flex items-center space-x-3">
                <FaGlobe className="text-modern-calm-dusk-blue text-xl flex-shrink-0" />
                <div>
                  <span className="text-lg font-semibold">Portfolio: </span>
                  <a
                    href="https://mahajanashok.vercel.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-modern-calm-dusk-blue hover:underline text-lg"
                  >
                    https://mahajanashok.vercel.app/
                  </a>
                </div>
              </div>
            </section>

            {/* Response Time Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Response Time
              </h2>
              <p className="text-lg">
                We aim to respond to all inquiries within{" "}
                <span className="font-semibold text-modern-calm-alabaster-grey">
                  24–48 hours
                </span>
                , excluding weekends and holidays.
              </p>
            </section>

            {/* CTA */}
            <div className="mt-12 text-center pt-8 border-t border-modern-calm-dusk-blue">
              <Link to="/#tools">
                <ShineButton>Back to Tools</ShineButton>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactUs;
