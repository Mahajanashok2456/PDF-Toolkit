import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const MergePage = () => {
  const [files, setFiles] = useState([]);
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFiles) => {
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleProcessFiles = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDF files to merge");
      return;
    }
    await processFiles("merge", files);
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
                Merge PDF
              </h1>
              <p className="text-modern-calm-dusty-denim mt-1">
                Combine multiple PDF files into one seamless document
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Instruction Message */}
          <div className="bg-modern-calm-dusk-blue bg-opacity-20 border border-modern-calm-dusk-blue rounded-lg p-6 mb-8">
            <p className="text-modern-calm-alabaster-grey text-center">
              Select multiple PDF files to merge them into a single document.
              Files will be combined in the order they appear below.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <UploadPDFCard
              instructionText="Upload PDF Files to Merge"
              acceptTypes=".pdf"
              multiple={true}
              onFilesSelected={handleFilesSelected}
            />

            {/* File List and Process Button */}
            {files.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-modern-calm-alabaster-grey mb-4">
                  Selected Files:
                </h4>
                <div className="space-y-2 max-w-md mx-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-modern-calm-dusk-blue bg-opacity-30 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <FaFilePdf className="text-modern-calm-dusk-blue" />
                        <span className="text-sm text-modern-calm-alabaster-grey truncate">
                          {file.name}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <ShineButton
                  onClick={handleProcessFiles}
                  disabled={processing}
                  className="mt-6 w-full"
                >
                  {processing ? "Merging PDFs..." : "Merge PDFs"}
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

export default MergePage;
