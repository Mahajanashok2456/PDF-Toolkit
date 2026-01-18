import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaFileWord } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const PDFToWordPage = () => {
  const [files, setFiles] = useState([]);
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleConvert = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file to convert");
      return;
    }
    await processFiles("pdf-to-word", files);
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
              <FaFileWord className="text-3xl text-modern-calm-alabaster-grey mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-modern-calm-alabaster-grey">
                  PDF to Word
                </h1>
                <p className="text-modern-calm-dusty-denim mt-1">
                  Convert PDFs into editable Word documents (.docx)
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
              Upload a PDF file to convert it into an editable Word document.
              The conversion maintains the document structure and formatting.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <UploadPDFCard
              onFilesSelected={handleFilesSelected}
              multiple={false}
              accept=".pdf"
              instruction="Upload PDF File"
            />

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
                {processing ? "Converting..." : "Convert to Word"}
              </ShineButton>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Preserves Formatting
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                Maintains text, images, and layout from the original PDF
              </p>
            </div>
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Editable Output
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                Create fully editable Word documents that you can modify
              </p>
            </div>
            <div className="bg-modern-calm-prussian-blue rounded-lg p-6 border border-modern-calm-dusk-blue">
              <h3 className="text-modern-calm-alabaster-grey font-semibold mb-2">
                ✓ Fast Conversion
              </h3>
              <p className="text-modern-calm-dusty-denim text-sm">
                Quick and reliable conversion process for your documents
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PDFToWordPage;
