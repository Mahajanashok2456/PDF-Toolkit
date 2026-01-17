import React from "react";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaEnvelope,
  FaGlobe,
  FaCheckCircle,
} from "react-icons/fa";
import { ShineButton } from "./ShineButton";

const SupportPage = () => {
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
            Support
          </h1>
          <p className="text-lg text-modern-calm-dusty-denim mb-8">
            We're here to help you get the best experience from our PDF tools
            platform. If you have questions, face issues, or need assistance,
            feel free to reach out.
          </p>

          <div className="space-y-8 text-modern-calm-dusty-denim leading-relaxed">
            {/* How Can We Help Section */}
            <section className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                How Can We Help?
              </h2>
              <p className="text-lg mb-4">You can contact us for:</p>
              <ul className="space-y-3 ml-4">
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">PDF processing issues</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    File upload or download problems
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Conversion or compression errors
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">
                    Feature requests or improvements
                  </span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">Security and privacy concerns</span>
                </li>
                <li className="flex items-start">
                  <FaCheckCircle className="text-modern-calm-dusk-blue mr-3 mt-1 flex-shrink-0" />
                  <span className="text-lg">General platform support</span>
                </li>
              </ul>
              <p className="text-lg mt-6 font-semibold">
                We aim to respond as quickly as possible with clear and
                effective solutions.
              </p>
            </section>

            {/* Contact Support Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Contact Support
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

              <p className="text-lg mb-3 font-semibold">
                When contacting support, please include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li className="text-lg">
                  The tool you were using (e.g., Merge PDF, JPG to PDF)
                </li>
                <li className="text-lg">A short description of the issue</li>
                <li className="text-lg">
                  Browser and device details (if applicable)
                </li>
              </ul>
              <p className="text-lg mt-4">
                This helps us resolve issues faster.
              </p>
            </section>

            {/* Technical & Development Support Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Technical & Development Support
              </h2>
              <p className="text-lg mb-4">
                This platform is designed, developed, and maintained by{" "}
                <span className="font-semibold text-modern-calm-alabaster-grey">
                  Mahajan Ashok
                </span>
                .
              </p>
              <p className="text-lg mb-3">For:</p>
              <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                <li className="text-lg">Custom PDF solutions</li>
                <li className="text-lg">API or backend integrations</li>
                <li className="text-lg">Performance optimization</li>
                <li className="text-lg">
                  Full-stack or AI-powered web development
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

            {/* Common Questions Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Common Questions
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-modern-calm-alabaster-grey mb-2">
                    Are my files safe?
                  </h3>
                  <p className="text-lg">
                    Yes. Files are processed securely and automatically deleted
                    after completion.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-modern-calm-alabaster-grey mb-2">
                    Do I need to sign up?
                  </h3>
                  <p className="text-lg">
                    No. Most tools work without registration.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-modern-calm-alabaster-grey mb-2">
                    Why did my PDF fail to process?
                  </h3>
                  <p className="text-lg">
                    Corrupted files, very large PDFs, or unsupported formats can
                    cause issues. Try re-uploading or splitting the file.
                  </p>
                </div>
              </div>
            </section>

            {/* Feedback & Suggestions Section */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                Feedback & Suggestions
              </h2>
              <p className="text-lg">
                We continuously improve our tools based on real user feedback.
                If you have suggestions or feature ideas, don't hesitate to
                contact us.
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

export default SupportPage;
