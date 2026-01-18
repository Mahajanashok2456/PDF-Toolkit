import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const ConvertPage = () => {
  const [files, setFiles] = useState([]);
  const [searchParams] = useSearchParams();
  const toolParam = searchParams.get("tool");
  const [convertOption, setConvertOption] = useState(
    toolParam || "pdf-to-word",
  );
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError("Please select a file to convert");
      return;
    }
    await processFiles(convertOption, files);
  };

  // Determine file types based on conversion option
  const getFileTypes = () => {
    if (convertOption.startsWith("pdf-to-")) {
      return {
        accept: ".pdf",
        multiple: false,
        instruction: "Upload PDF File to Convert",
      };
    } else if (convertOption.endsWith("-to-pdf")) {
      if (convertOption === "jpg-to-pdf") {
        return {
          accept: "image/*",
          multiple: true,
          instruction: "Upload Images to Convert to PDF",
        };
      }
    }
    return {
      accept: ".pdf",
      multiple: false,
      instruction: "Upload File to Convert",
    };
  };

  const fileTypes = getFileTypes();

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
                Convert PDF
              </h1>
              <p className="text-modern-calm-dusty-denim mt-1">
                Convert between PDF and other popular file formats
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
              Select the conversion type and upload your file to convert it to
              another format.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                Conversion Type
              </label>
              <select
                value={convertOption}
                onChange={(e) => setConvertOption(e.target.value)}
                className="w-full p-3 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue"
              >
                <option value="pdf-to-word">PDF to Word</option>
                <option value="jpg-to-pdf">JPG to PDF</option>
              </select>
            </div>

            <UploadPDFCard
              instructionText={fileTypes.instruction}
              acceptTypes={fileTypes.accept}
              multiple={fileTypes.multiple}
              onFilesSelected={handleFilesSelected}
            />

            {/* Convert Button */}
            {files.length > 0 && (
              <ShineButton
                onClick={handleProcessFiles}
                disabled={processing}
                className="mt-6 w-full"
              >
                {processing ? "Converting File..." : "Convert File"}
              </ShineButton>
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

export default ConvertPage;
