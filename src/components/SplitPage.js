import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const SplitPage = () => {
  const [files, setFiles] = useState([]);
  const [splitOptions, setSplitOptions] = useState({
    startPage: 1,
    endPage: "",
  });
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file to split");
      return;
    }
    await processFiles("split", files, { splitOptions });
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
                Split PDF
              </h1>
              <p className="text-modern-calm-dusty-denim mt-1">
                Divide a large PDF document into smaller files by specifying
                page ranges
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
              Upload a PDF file and specify the page range you want to extract
              into a separate document.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <UploadPDFCard
              instructionText="Upload PDF File to Split"
              acceptTypes=".pdf"
              multiple={false}
              onFilesSelected={handleFilesSelected}
            />

            {/* Split Options */}
            {files.length > 0 && (
              <div className="mt-6 p-6 bg-modern-calm-dusk-blue bg-opacity-30 rounded-lg">
                <h4 className="text-lg font-semibold text-modern-calm-alabaster-grey mb-4">
                  Split Options
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                      Start Page
                    </label>
                    <input
                      type="number"
                      value={splitOptions.startPage}
                      onChange={(e) =>
                        setSplitOptions({
                          ...splitOptions,
                          startPage: parseInt(e.target.value) || 1,
                        })
                      }
                      min="1"
                      className="w-full p-3 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                      End Page
                    </label>
                    <input
                      type="number"
                      value={splitOptions.endPage}
                      onChange={(e) =>
                        setSplitOptions({
                          ...splitOptions,
                          endPage: parseInt(e.target.value) || "",
                        })
                      }
                      min="1"
                      placeholder="Leave blank for last page"
                      className="w-full p-3 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue placeholder-modern-calm-dusty-denim"
                    />
                  </div>
                </div>

                <ShineButton
                  onClick={handleProcessFiles}
                  disabled={processing}
                  className="mt-6 w-full"
                >
                  {processing ? "Splitting PDF..." : "Split PDF"}
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

export default SplitPage;
