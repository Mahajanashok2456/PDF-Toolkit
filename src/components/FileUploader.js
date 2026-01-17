import React, { useState } from 'react';

const FileUploader = React.memo(({ onFilesSelect, selectedTool, multiple = false, accept = '.pdf' }) => {
  // Determine multiple and accept based on selectedTool if not provided
  const isMultiple = multiple || ['merge', 'scan-to-pdf', 'organize-pdf'].includes(selectedTool);
  const fileAccept = accept || (['scan-to-pdf', 'jpg-to-pdf'].includes(selectedTool) ? 'image/*' : '.pdf');
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState('');

  const validateFiles = (files) => {
    const fileArray = isMultiple ? Array.from(files) : [files];
    const isImage = fileAccept === 'image/*';
    for (const file of fileArray) {
      if (isImage) {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff'];
        if (!allowedImageTypes.includes(file.type)) {
          return `Invalid file type: ${file.name}. Only image files are allowed.`;
        }
      } else {
        if (file.type !== 'application/pdf') {
          return `Invalid file type: ${file.name}. Only PDF files are allowed.`;
        }
      }
      if (file.size > 50 * 1024 * 1024) {
        return `File too large: ${file.name}. Maximum size is 50MB.`;
      }
    }
    return null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesInput = isMultiple ? e.dataTransfer.files : e.dataTransfer.files[0];
      const validationError = validateFiles(filesInput);
      if (validationError) {
        setError(validationError);
        return;
      }
      const files = isMultiple ? Array.from(e.dataTransfer.files) : e.dataTransfer.files[0];
      onFilesSelect(files);
      // Google Analytics event tracking
      if (window.gtag) {
        window.gtag('event', 'file_uploaded', {
          event_category: 'File Interaction',
          event_label: 'Drop Upload',
          value: files.length || 1
        });
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');
    if (e.target.files && e.target.files[0]) {
      const filesInput = isMultiple ? e.target.files : e.target.files[0];
      const validationError = validateFiles(filesInput);
      if (validationError) {
        setError(validationError);
        return;
      }
      const files = isMultiple ? Array.from(e.target.files) : e.target.files[0];
      onFilesSelect(files);
      // Google Analytics event tracking
      if (window.gtag) {
        window.gtag('event', 'file_uploaded', {
          event_category: 'File Interaction',
          event_label: 'Click Upload',
          value: files.length || 1
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
            : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={isMultiple}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept={fileAccept}
          data-testid="file-input"
        />
        <div className="text-gray-600 dark:text-gray-300">
          <p className="text-lg font-medium">
            {fileAccept === 'image/*' ? 'Drop image files here or click to upload' : 'Drop PDF files here or click to upload'}
          </p>
          <p className="text-sm mt-2">
            {fileAccept === 'image/*' ? 'Supports image files only' : 'Supports PDF files only'}
          </p>
        </div>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
          <p>{error}</p>
          <button
            onClick={() => setError('')}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
});

export default FileUploader;
