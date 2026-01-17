import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ShineButton } from "./ShineButton";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-modern-calm-dusty-denim mb-8">
            Last updated: January 17, 2026
          </p>

          <div className="space-y-8 text-modern-calm-dusty-denim leading-relaxed">
            <p className="text-lg">
              Your privacy matters to us. This Privacy Policy explains how we
              collect, use, and protect your information when you use our PDF
              tools platform.
            </p>
            <p className="text-lg">
              By accessing or using our services, you agree to the practices
              described in this policy.
            </p>

            {/* Section 1 */}
            <section className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                1. Information We Collect
              </h2>

              <h3 className="text-2xl font-semibold text-modern-calm-alabaster-grey mb-4 mt-6">
                a) Files You Upload
              </h3>
              <p className="text-lg mb-4">
                When you use our tools (merge, split, convert, protect PDFs,
                etc.), you may upload files for processing.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Files are used only to perform the requested operation</li>
                <li>We do not analyze, read, or share your documents</li>
                <li>
                  Files are automatically deleted from our servers after
                  processing
                </li>
              </ul>

              <h3 className="text-2xl font-semibold text-modern-calm-alabaster-grey mb-4 mt-6">
                b) Usage Information
              </h3>
              <p className="text-lg mb-4">
                We may collect limited, non-personal information such as:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Browser type</li>
                <li>Device type</li>
                <li>IP address (for security and abuse prevention)</li>
                <li>Pages visited and actions performed</li>
              </ul>
              <p className="text-lg mt-4">
                This data helps us improve performance and user experience.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                2. How We Use Your Information
              </h2>
              <p className="text-lg mb-4">
                We use collected information only to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Process and deliver requested PDF operations</li>
                <li>Maintain platform security and stability</li>
                <li>Improve tool performance and usability</li>
                <li>Prevent misuse or fraudulent activity</li>
              </ul>
              <p className="text-lg mt-4 font-semibold">
                We do not sell, rent, or trade your data.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                3. File Security & Retention
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Uploaded files are processed in a secure environment</li>
                <li>Files are temporarily stored only for processing</li>
                <li>Files are automatically deleted after completion</li>
                <li>We do not keep backups of uploaded documents</li>
              </ul>
              <p className="text-lg mt-4 font-semibold">
                Your documents remain private and confidential.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                4. Cookies & Analytics
              </h2>
              <p className="text-lg mb-4">
                We may use cookies or similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain session functionality</li>
                <li>Understand usage trends</li>
                <li>Improve website performance</li>
              </ul>
              <p className="text-lg mt-4">
                You can disable cookies in your browser settings, though some
                features may not function properly.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                5. Third-Party Services
              </h2>
              <p className="text-lg mb-4">
                We may use trusted third-party services for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hosting</li>
                <li>Analytics</li>
                <li>Performance monitoring</li>
              </ul>
              <p className="text-lg mt-4">
                These services are bound by strict confidentiality and data
                protection obligations.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                6. Data Protection
              </h2>
              <p className="text-lg mb-4">
                We implement appropriate technical and organizational measures
                to protect your data against:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Unauthorized access</li>
                <li>Data loss</li>
                <li>Misuse or alteration</li>
              </ul>
              <p className="text-lg mt-4">
                However, no online system is 100% secure. We continuously
                improve our security practices.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                7. Children's Privacy
              </h2>
              <p className="text-lg">
                Our services are not intended for children under the age of 13.
                We do not knowingly collect personal data from children.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                8. Changes to This Policy
              </h2>
              <p className="text-lg">
                We may update this Privacy Policy from time to time. Any changes
                will be reflected on this page with an updated date.
              </p>
              <p className="text-lg mt-4">
                We encourage you to review this policy periodically.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                9. Contact Us
              </h2>
              <p className="text-lg mb-4">
                If you have questions or concerns about this Privacy Policy or
                your data, you can contact us at:
              </p>
              <p className="text-lg">
                Email:{" "}
                <a
                  href="mailto:ashokroshan78@gmail.com"
                  className="text-modern-calm-dusk-blue hover:underline"
                >
                  ashokroshan78@gmail.com
                </a>
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

export default PrivacyPolicy;
