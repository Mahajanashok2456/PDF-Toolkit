import React, { useState } from "react";
import { FaFilePdf, FaPlus } from "react-icons/fa";

const UploadPDFCard = ({
  instructionText,
  acceptTypes = ".pdf",
  multiple = true,
  onFilesSelected,
}) => {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
    if (onFilesSelected) {
      onFilesSelected(selectedFiles);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="bg-modern-calm-prussian-blue rounded-xl shadow-lg border border-modern-calm-dusk-blue p-8">
      {/* Instruction Text */}
      <div className="text-center mb-6">
        <p className="text-lg text-modern-calm-alabaster-grey font-medium">
          {instructionText}
        </p>
      </div>

      {/* Upload Area */}
      <div className="text-center mb-6">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="mx-auto w-24 h-24 bg-modern-calm-dusk-blue bg-opacity-30 rounded-full flex items-center justify-center hover:bg-opacity-50 transition-all duration-200 ease-in-out border-2 border-dashed border-modern-calm-dusk-blue">
            <FaPlus className="text-3xl text-modern-calm-dusk-blue" />
          </div>
          <div className="mt-4">
            <p className="text-lg font-medium text-modern-calm-alabaster-grey">
              Upload Files
            </p>
            <p className="text-modern-calm-dusty-denim">
              Click to select files or drag and drop
            </p>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple={multiple}
          accept={acceptTypes}
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* File List */}
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
        </div>
      )}
    </div>
  );
};

export default UploadPDFCard;
