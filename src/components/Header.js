import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GooeyNav from "./GooeyNav";
import { FaChevronDown, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollToTop = () => {
    window.scrollTo(0, 0);
    setIsMobileMenuOpen(false);
    setIsToolsDropdownOpen(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsToolsDropdownOpen(false); 
  };

  return (
    <header className="sticky top-0 z-50 bg-modern-calm-ink-black border-b border-modern-calm-dusk-blue/20">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
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
                    <div className="max-h-[80vh] overflow-y-auto custom-scrollbar">
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
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-modern-calm-alabaster-grey hover:text-white focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-modern-calm-ink-black border-t border-modern-calm-dusk-blue shadow-xl z-50 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col px-4 py-6 space-y-4">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.onClick) item.onClick();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-lg font-medium text-modern-calm-alabaster-grey hover:text-white transition-colors border-b border-modern-calm-dusk-blue/30 pb-2"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile Tools Dropdown */}
            <div className="border-b border-modern-calm-dusk-blue/30 pb-2">
              <button
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className="flex items-center justify-between w-full text-lg font-medium text-modern-calm-alabaster-grey hover:text-white transition-colors"
              >
                Tools
                <FaChevronDown
                  className={`ml-1 text-xs transition-transform ${isToolsDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isToolsDropdownOpen && (
                <div className="mt-2 ml-4 flex flex-col space-y-2 border-l-2 border-modern-calm-dusk-blue pl-4 py-2">
                  {tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={handleScrollToTop}
                      className="text-base text-modern-calm-dusty-denim hover:text-white transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
