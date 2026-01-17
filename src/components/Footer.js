import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import RatingWidget from "./RatingWidget";

const Footer = () => {
  const [showRating, setShowRating] = useState(false);

  return (
    <footer className="bg-gray-900 text-white">
      {showRating && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-800">
          <RatingWidget onRatingSubmitted={() => setShowRating(false)} />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
              PDF Toolkit
            </h2>
            <p className="text-gray-400 mb-4 max-w-md">
              Your all-in-one solution for PDF manipulation. Fast, secure, and
              completely free to use.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/Mahajanashok2456"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/mahajanashok78/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#tools"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </li>
              <li>
                <Link
                  to="/merge-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Merge PDFs
                </Link>
              </li>
              <li>
                <Link
                  to="/split-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Split PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/organize-pdf?tool=remove-pages"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Remove Pages
                </Link>
              </li>
              <li>
                <Link
                  to="/organize-pdf?tool=extract-pages"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Extract Pages
                </Link>
              </li>
              <li>
                <Link
                  to="/organize-pdf?tool=rotate"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Rotate PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/convert-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link
                  to="/convert-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  JPG to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/convert-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  WORD to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/convert-pdf"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  HTML to PDF
                </Link>
              </li>
              <li>
                <Link
                  to="/pdf-security"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Protect PDF
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms-of-service"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/contact-us"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            Made by{" "}
            <a
              href="https://mahajanashok.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Mahajan
            </a>
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} PDF Toolkit. All rights reserved.
          </p>
          <button
            onClick={() => setShowRating(!showRating)}
            className="mt-4 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {showRating ? "✕ Close" : "⭐ Rate This Tool"}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
