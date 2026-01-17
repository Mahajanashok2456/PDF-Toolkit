import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GooeyNav from "./GooeyNav";
import { FaChevronDown } from "react-icons/fa";

const Header = () => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const navItems = [
    {
      label: "Home",
      onClick: () => {
        handleScrollToTop();
        navigate("/#tools");
      },
    },
    { label: "FAQ", onClick: () => navigate("/faq") },
    { label: "About", onClick: () => navigate("/about") },
    { label: "Contact", onClick: () => navigate("/contact-us") },
  ];

  const tools = [
    { name: "Merge PDFs", path: "/merge-pdf" },
    { name: "Split PDF", path: "/split-pdf" },
    { name: "Remove Pages", path: "/organize-pdf?tool=remove-pages" },
    { name: "Extract Pages", path: "/organize-pdf?tool=extract-pages" },
    { name: "Rotate PDF", path: "/organize-pdf?tool=rotate" },
    { name: "PDF to Word", path: "/convert-pdf?tool=pdf-to-word" },
    { name: "JPG to PDF", path: "/convert-pdf?tool=jpg-to-pdf" },
    { name: "WORD to PDF", path: "/convert-pdf?tool=word-to-pdf" },
    { name: "HTML to PDF", path: "/convert-pdf?tool=html-to-pdf" },
    { name: "Protect PDF", path: "/pdf-security" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-modern-calm-ink-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            onClick={handleScrollToTop}
            className="text-2xl font-bold bg-gradient-to-r from-modern-calm-dusk-blue to-modern-calm-dusty-denim bg-clip-text text-transparent"
          >
            PDF Toolkit
          </Link>

          {/* Navigation Container */}
          <div className="flex items-center gap-8">
            {/* GooeyNav */}
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />

            {/* Tools Dropdown */}
            <div className="relative group">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center text-modern-calm-alabaster-grey hover:text-white transition-colors font-medium py-2"
              >
                Tools
                <FaChevronDown
                  className={`ml-1 text-xs transition-transform ${isToolsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isToolsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsToolsDropdownOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-1 w-64 bg-modern-calm-prussian-blue rounded-lg shadow-lg border border-modern-calm-dusk-blue py-2 z-50">
                    {tools.map((tool) => (
                      <Link
                        key={tool.path}
                        to={tool.path}
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          handleScrollToTop();
                        }}
                        className="block px-4 py-2 text-sm text-modern-calm-alabaster-grey hover:bg-modern-calm-dusk-blue hover:text-white transition-colors"
                      >
                        {tool.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
