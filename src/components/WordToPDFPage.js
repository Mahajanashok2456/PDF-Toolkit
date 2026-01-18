import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFilePdf } from "react-icons/fa";
import { SiMicrosoftword } from "react-icons/si";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const WordToPDFPage = () => {
  const [files, setFiles] = useState([]);
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) {
      setError("Please select a Word file");
      return;
    }
    setError("");
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please select a Word file to convert");
      return;
    }
    // Convert Word file using word-to-pdf endpoint
    await processFiles("word-to-pdf", files);
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
            <div className="flex items-center">
              <SiMicrosoftword className="text-3xl text-blue-400 mr-4" />
              <FaArrowLeft className="text-xl text-modern-calm-alabaster-grey mx-2 rotate-180" />
              <FaFilePdf className="text-3xl text-red-500 mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-modern-calm-alabaster-grey">
                  Word to PDF
                </h1>
                <p className="text-modern-calm-dusty-denim mt-1">
                  Convert Word documents (.docx) into PDF format
                </p>
              </div>
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
              Upload a Word document (.docx) to convert it into a PDF file.
              Perfect for sharing and archiving your documents.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <div className="border-2 border-dashed border-modern-calm-dusk-blue rounded-lg p-12 text-center">
              <input
                type="file"
                accept=".docx,.doc"
                onChange={handleFilesSelected}
                className="hidden"
                id="word-input"
              />
              <label
                htmlFor="word-input"
                className="cursor-pointer block"
              >
                <SiMicrosoftword className="text-6xl text-blue-400 mx-auto mb-4" />
                <p className="text-modern-calm-alabaster-grey text-lg font-semibold mb-2">
                  {files.length > 0 ? files[0].name : "Click to upload or drag & drop"}
                </p>
                <p className="text-modern-calm-dusty-denim text-sm">
                  Supported format: .docx, .doc
                </p>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Convert Button */}
            <div className="mt-8 flex gap-4 justify-center">
              <ShineButton
                onClick={handleConvert}
                disabled={files.length === 0 || processing}
                loading={processing}
              >
                {processing ? "Converting..." : "Convert to PDF"}
              </ShineButton>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Preserves Layout
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                Your Word document formatting is maintained in the PDF
              </p>
            </div>
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Universal Format
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                PDF works on any device and is perfect for sharing
              </p>
            </div>
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Quick Conversion
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                Fast and reliable conversion in seconds
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WordToPDFPage;
