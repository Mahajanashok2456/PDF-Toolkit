import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const OrganizePage = () => {
  const [files, setFiles] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [rotation, setRotation] = useState(90);
  const [searchParams] = useSearchParams();
  const [selectedTool, setSelectedTool] = useState(
    searchParams.get("tool") || "remove-pages",
  );
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  // Update selected tool when URL changes
  React.useEffect(() => {
    const tool = searchParams.get("tool");
    if (tool) {
      setSelectedTool(tool);
    }
  }, [searchParams]);

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const getToolInfo = () => {
    switch (selectedTool) {
      case "remove-pages":
        return {
          title: "Remove Pages",
          description: "Delete specific pages from your PDF document",
          instruction: "Upload PDF to Remove Pages",
          label: "Pages to Remove (e.g., 1,3-5)",
          placeholder: "e.g., 1, 3, 5-7",
          buttonText: "Remove Pages",
        };
      case "extract-pages":
        return {
          title: "Extract Pages",
          description: "Extract specific pages into a new PDF",
          instruction: "Upload PDF to Extract Pages",
          label: "Pages to Extract (e.g., 1,3-5)",
          placeholder: "e.g., 1, 3, 5",
          buttonText: "Extract Pages",
        };
      case "rotate":
        return {
          title: "Rotate PDF",
          description: "Rotate PDF pages permanently",
          instruction: "Upload PDF to Rotate",
          buttonText: "Rotate PDF",
        };
      default: // remove-pages
        return {
          title: "Remove Pages",
          description: "Delete specific pages from your PDF document",
          instruction: "Upload PDF to Remove Pages",
          label: "Pages to Remove (e.g., 1,3-5)",
          placeholder: "e.g., 1, 3, 5-7",
          buttonText: "Remove Pages",
        };
    }
  };

  const toolInfo = getToolInfo();

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError(`Please select a PDF file to ${selectedTool.replace("-", " ")}`);
      return;
    }

    const options = {};

    if (selectedTool === "remove-pages") {
      if (!inputValue) {
        setError("Please specify pages to remove");
        return;
      }
      options.removePagesOptions = { pagesToRemove: inputValue };
    } else if (selectedTool === "extract-pages") {
      if (!inputValue) {
        setError("Please specify pages to extract");
        return;
      }
      options.extractPagesOptions = { pagesToExtract: inputValue };
    } else if (selectedTool === "rotate") {
      options.rotateOptions = { angle: parseInt(rotation) };
    }

    await processFiles(selectedTool, files, options);
  };

  return (
    <div className="min-h-screen bg-modern-calm-ink-black">
      {/* Mini Hero Section */}
      <section className="py-12 bg-modern-calm-prussian-blue shadow-sm border-b border-modern-calm-dusk-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-modern-calm-dusty-denim hover:text-modern-calm-alabaster-grey transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-modern-calm-alabaster-grey">
                {toolInfo.title}
              </h1>
              <p className="text-modern-calm-dusty-denim mt-1">
                {toolInfo.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tool Selection Dropdown */}
          <div className="mb-8">
            <select
              value={selectedTool}
              onChange={(e) => {
                setSelectedTool(e.target.value);
                setInputValue("");
                setError("");
                // Update URL without reloading
                const newUrl = `/organize-pdf?tool=${e.target.value}`;
                window.history.pushState({ path: newUrl }, "", newUrl);
              }}
              className="w-full md:w-auto p-2 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue"
            >
              <option value="remove-pages">Remove Pages</option>
              <option value="extract-pages">Extract Pages</option>
              <option value="rotate">Rotate PDF</option>
            </select>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <UploadPDFCard
              instructionText={toolInfo.instruction}
              acceptTypes=".pdf"
              multiple={false}
              onFilesSelected={handleFilesSelected}
            />

            {/* Tool Options */}
            {files.length > 0 && selectedTool !== "repair" && (
              <div className="mt-6 p-6 bg-modern-calm-dusk-blue bg-opacity-30 rounded-lg">
                <h4 className="text-lg font-semibold text-modern-calm-alabaster-grey mb-4">
                  {toolInfo.title} Options
                </h4>
                <div className="space-y-4">
                  {selectedTool === "rotate" ? (
                    <div>
                      <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                        Rotation Angle
                      </label>
                      <div className="flex space-x-4">
                        {[90, 180, 270].map((angle) => (
                          <button
                            key={angle}
                            onClick={() => setRotation(angle)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                              rotation === angle
                                ? "bg-gradient-to-r from-modern-calm-dusk-blue to-modern-calm-dusty-denim text-white shadow-lg scale-105"
                                : "bg-modern-calm-ink-black border border-modern-calm-dusk-blue text-modern-calm-alabaster-grey hover:bg-modern-calm-dusk-blue hover:bg-opacity-20 hover:border-modern-calm-dusty-denim"
                            }`}
                          >
                            {angle}°
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                        {toolInfo.label}
                      </label>
                      <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={toolInfo.placeholder}
                        className="w-full p-3 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue placeholder-modern-calm-dusty-denim"
                        rows="3"
                      />
                      <p className="mt-1 text-sm text-modern-calm-dusty-denim">
                        Enter page numbers separated by commas or ranges (e.g.,
                        1-3).
                      </p>
                    </div>
                  )}
                </div>

                <ShineButton
                  onClick={handleProcessFiles}
                  disabled={processing}
                  className="mt-6 w-full"
                >
                  {processing
                    ? `${toolInfo.buttonText}...`
                    : toolInfo.buttonText}
                </ShineButton>
              </div>
            )}

          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-900 bg-opacity-30 border border-red-700 text-red-300 rounded-lg">
              <p>{error}</p>
              <ShineButton
                onClick={() => setError("")}
                className="mt-2 text-xs h-auto px-2 py-1"
              >
                Dismiss
              </ShineButton>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrganizePage;
