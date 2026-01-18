import React, { useState } from "react";
import { Link } from "react-router-dom";
import ToolCard from "./ToolCard";
import { ShineButton } from "./ShineButton";

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Organize PDF", "Convert PDF", "PDF Security"];

  const tools = [
    // Core Tools
    {
      name: "Merge PDFs",
      value: "merge",
      category: "Organize PDF",
      description: "Combine multiple PDF files into one document",
      path: "/merge-pdf",
    },
    {
      name: "Split PDF",
      value: "split",
      category: "Organize PDF",
      description: "Divide a PDF into separate files",
      path: "/split-pdf",
    },

    // Organize PDF
    {
      name: "Remove Pages",
      value: "remove-pages",
      category: "Organize PDF",
      description: "Delete specific pages from your PDF",
      path: "/organize-pdf?tool=remove-pages",
    },
    {
      name: "Extract Pages",
      value: "extract-pages",
      category: "Organize PDF",
      description: "Pull out selected pages into a new PDF",
      path: "/organize-pdf?tool=extract-pages",
    },
    {
      name: "Rotate PDF",
      value: "rotate",
      category: "Organize PDF",
      description: "Change the orientation of PDF pages",
      path: "/organize-pdf?tool=rotate",
    },

    // Convert PDF
    {
      name: "PDF to Word",
      value: "pdf-to-word",
      category: "Convert PDF",
      description: "Convert PDF to editable Word document",
      path: "/convert-pdf?tool=pdf-to-word",
    },
    {
      name: "JPG to PDF",
      value: "jpg-to-pdf",
      category: "Convert PDF",
      description: "Transform images into PDF format",
      path: "/convert-pdf?tool=jpg-to-pdf",
    },

    // PDF Security
    {
      name: "Protect PDF",
      value: "protect-pdf",
      category: "PDF Security",
      description: "Add password protection to PDF",
      path: "/pdf-security",
    },
  ];

  const filteredTools =
    activeCategory === "All"
      ? tools
      : tools.filter((tool) => tool.category === activeCategory);

  return (
    <div className="min-h-screen bg-modern-calm-ink-black">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-modern-calm-alabaster-grey mb-6">
            Your All-in-One{" "}
            <span className="bg-gradient-to-r from-modern-calm-dusk-blue via-modern-calm-dusty-denim to-modern-calm-alabaster-grey bg-clip-text text-transparent">
              PDF Toolkit
            </span>{" "}
            🚀
          </h1>
          <p className="text-xl text-modern-calm-dusty-denim mb-10 max-w-3xl mx-auto">
            Merge, Split, and Manage PDFs — lightning fast, secure, and free.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#tools" className="inline-block">
              <ShineButton>Get Started</ShineButton>
            </a>
            <Link to="/merge-pdf">
              <ShineButton className="inline-flex bg-modern-calm-alabaster-grey text-modern-calm-dusk-blue dark:bg-modern-calm-dusk-blue dark:text-white">
                Try Merge PDF
              </ShineButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools Grid Section */}
      <section id="tools" className="py-16 bg-modern-calm-prussian-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-modern-calm-alabaster-grey mb-4">
              Powerful PDF Toolkit
            </h2>
            <p className="text-xl text-modern-calm-dusty-denim max-w-3xl mx-auto">
              Everything you need to create, edit, and manage your PDF documents
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? "animate-shine bg-foreground dark:bg-background border-black/10 dark:border-white/10 text-black dark:text-white items-center justify-center rounded-xl border bg-[linear-gradient(110deg,#ffff,45%,#303030,55%,#ffff)] bg-size-[400%_100%] dark:bg-[linear-gradient(110deg,#000000,45%,#303030,55%,#000000)]"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool, index) => (
              <Link to={tool.path} key={tool.value} className="block">
                <ToolCard
                  tool={tool}
                  isNew={index < 3} // Mark first 3 tools as "New"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
