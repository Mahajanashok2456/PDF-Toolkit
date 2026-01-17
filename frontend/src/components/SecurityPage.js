import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import UploadPDFCard from "./UploadPDFCard";
import useFileProcessor from "../hooks/useFileProcessor";
import { ShineButton } from "./ShineButton";

const SecurityPage = () => {
  const [files, setFiles] = useState([]);
  const [password, setPassword] = useState("");
  const { processFiles, processing, error, setError } = useFileProcessor();
  const navigate = useNavigate();

  const handleFilesSelected = (selectedFiles) => {
    setFiles(selectedFiles);
  };

  const handleProcessFiles = async () => {
    if (files.length === 0) {
      setError("Please select a PDF file to secure");
      return;
    }

    if (!password) {
      setError("Please enter a password to protect your PDF");
      return;
    }

    await processFiles("protect-pdf", files, { password });
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
                PDF Security
              </h1>
              <p className="text-modern-calm-dusty-denim mt-1">
                Protect your PDF documents with password protection
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
              Upload a PDF file and set a password to protect it.
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8 mb-8">
            <UploadPDFCard
              instructionText="Upload PDF File to Secure"
              acceptTypes=".pdf"
              multiple={false}
              onFilesSelected={handleFilesSelected}
            />

            {/* Password Input */}
            {files.length > 0 && (
              <div className="mt-6 p-6 bg-modern-calm-dusk-blue bg-opacity-30 rounded-lg">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-modern-calm-alabaster-grey mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password to protect your PDF"
                      className="w-full p-3 border border-modern-calm-dusk-blue rounded-lg bg-modern-calm-ink-black text-modern-calm-alabaster-grey focus:ring-2 focus:ring-modern-calm-dusk-blue focus:border-modern-calm-dusk-blue placeholder-modern-calm-dusty-denim"
                    />
                  </div>
                </div>

                <ShineButton
                  onClick={handleProcessFiles}
                  disabled={processing}
                  className="mt-6 w-full"
                >
                  {processing ? "Securing PDF..." : "Secure PDF"}
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

export default SecurityPage;
