import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { ShineButton } from "./ShineButton";

const TermsOfService = () => {
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
            Terms of Service
          </h1>
          <p className="text-modern-calm-dusty-denim mb-8">
            Last updated: January 17, 2026
          </p>

          <div className="space-y-8 text-modern-calm-dusty-denim leading-relaxed">
            <p className="text-lg">
              Welcome to our PDF tools platform. By accessing or using our
              website and services, you agree to comply with and be bound by
              these Terms of Service. If you do not agree, please do not use our
              services.
            </p>

            {/* Section 1 */}
            <section className="mt-10">
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                1. Use of Services
              </h2>
              <p className="text-lg mb-4">
                Our services allow you to merge, split, convert, protect, and
                manage PDF files online. You agree to use the platform only for
                lawful purposes and in accordance with these terms.
              </p>
              <p className="text-lg mb-4 font-semibold">You must not:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Upload malicious, illegal, or harmful content</li>
                <li>Attempt to disrupt or overload our systems</li>
                <li>Reverse-engineer, scrape, or abuse the service</li>
                <li>
                  Use the platform to violate any laws or third-party rights
                </li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                2. File Handling & Ownership
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You retain full ownership of all files you upload</li>
                <li>We do not claim any rights over your documents</li>
                <li>
                  Files are processed only to perform the requested operation
                </li>
                <li>
                  Uploaded files are automatically deleted after processing
                </li>
              </ul>
              <p className="text-lg mt-4 font-semibold">
                You are solely responsible for the content of the files you
                upload.
              </p>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                3. Privacy
              </h2>
              <p className="text-lg">
                Your use of our services is also governed by our{" "}
                <Link
                  to="/privacy-policy"
                  className="text-modern-calm-dusk-blue hover:underline"
                >
                  Privacy Policy
                </Link>
                . By using the platform, you consent to the collection and use
                of information as described there.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                4. Service Availability
              </h2>
              <p className="text-lg mb-4">
                We aim to provide uninterrupted access, but we do not guarantee
                that the service will always be available, error-free, or
                uninterrupted.
              </p>
              <p className="text-lg mb-4 font-semibold">
                We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or discontinue any feature at any time</li>
                <li>
                  Temporarily suspend access for maintenance or security reasons
                </li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                5. Limitation of Liability
              </h2>
              <p className="text-lg mb-4">
                Our services are provided "as is" and "as available."
              </p>
              <p className="text-lg mb-4">
                To the maximum extent permitted by law:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  We are not liable for data loss, file corruption, or business
                  interruption
                </li>
                <li>
                  We are not responsible for indirect, incidental, or
                  consequential damages
                </li>
                <li>Use of the service is at your own risk</li>
              </ul>
              <p className="text-lg mt-4 font-semibold">
                We strongly recommend keeping backups of important files.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                6. Intellectual Property
              </h2>
              <p className="text-lg mb-4">
                All website content, branding, design, logos, and software
                (excluding user files) are the property of the platform and
                protected by applicable intellectual property laws.
              </p>
              <p className="text-lg">
                You may not copy, reproduce, or distribute any part of the
                platform without prior written permission.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                7. Termination
              </h2>
              <p className="text-lg mb-4">
                We reserve the right to restrict or terminate access to the
                platform if:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>These Terms are violated</li>
                <li>The service is abused or misused</li>
                <li>Required by law or security reasons</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                8. Third-Party Services
              </h2>
              <p className="text-lg">
                Our platform may rely on third-party tools or infrastructure. We
                are not responsible for issues caused by third-party service
                interruptions or failures.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                9. Changes to Terms
              </h2>
              <p className="text-lg">
                We may update these Terms of Service at any time. Changes will
                be posted on this page with an updated date. Continued use of
                the platform constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                10. Governing Law
              </h2>
              <p className="text-lg">
                These Terms shall be governed and interpreted in accordance with
                applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            {/* Section 11 */}
            <section>
              <h2 className="text-3xl font-bold text-modern-calm-alabaster-grey mb-6">
                11. Contact Information
              </h2>
              <p className="text-lg mb-4">
                If you have any questions regarding these Terms of Service,
                contact us at:
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

export default TermsOfService;
