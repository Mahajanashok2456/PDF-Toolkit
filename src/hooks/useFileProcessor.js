import { useState } from "react";

const useFileProcessor = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const parsePages = (pagesString) => {
    if (!pagesString) return [];
    const pages = [];
    pagesString.split(",").forEach((part) => {
      const range = part.trim().split("-");
      if (range.length === 2) {
        const start = parseInt(range[0], 10);
        const end = parseInt(range[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            pages.push(i);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p)) {
          pages.push(p);
        }
      }
    });
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  const processFiles = async (selectedTool, files, options = {}) => {
    if (!selectedTool || files.length === 0) return;

    setProcessing(true);
    setError("");
    const formData = new FormData();
    const {
      splitOptions = {},
      rotateOptions = {},
      removePagesOptions = {},
      extractPagesOptions = {},
      organizeOptions = {},
      password = "",
    } = options;

    let field = "pdf";
    if (selectedTool === "merge") {
      field = "pdfs";
    } else if (["jpg-to-pdf"].includes(selectedTool)) {
      field = "file";
    } else if (selectedTool === "word-to-pdf") {
      field = "docx";
    }

    if (selectedTool === "merge") {
      files.forEach((file) => formData.append(field, file));
    } else if (selectedTool === "jpg-to-pdf") {
      // Send all images for jpg-to-pdf conversion
      files.forEach((file) => formData.append(field, file));
    } else {
      formData.append(field, files[0]);
      if (selectedTool === "split") {
        formData.append("startPage", splitOptions.startPage);
        formData.append(
          "endPage",
          splitOptions.endPage || files[0].pageCount || 1,
        );
      }
      if (selectedTool === "rotate") {
        formData.append("angle", rotateOptions.angle);
      }
      if (selectedTool === "remove-pages") {
        const pagesToRemove = parsePages(removePagesOptions.pagesToRemove);
        formData.append("pagesToRemove", JSON.stringify(pagesToRemove));
      }
      if (selectedTool === "extract-pages") {
        const pagesToExtract = parsePages(extractPagesOptions.pagesToExtract);
        formData.append("pagesToExtract", JSON.stringify(pagesToExtract));
      }
      if (selectedTool === "organize-pdf") {
        const newOrder = parsePages(organizeOptions.newOrder);
        formData.append("newOrder", JSON.stringify(newOrder));
      }
      if (selectedTool === "protect-pdf") {
        formData.append("password", password);
      }
    }

    try {
      let apiUrl =
        process.env.REACT_APP_API_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:3001"
          : window.location.origin);

      const response = await fetch(`${apiUrl}/api/${selectedTool}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      let downloadName;
      if (selectedTool === "convert") {
        downloadName = "converted.txt";
      } else if (selectedTool === "compress") {
        downloadName = "compressed.pdf";
      } else if (selectedTool === "rotate") {
        downloadName = "rotated.pdf";
      } else if (selectedTool === "remove-pages") {
        downloadName = "removed-pages.pdf";
      } else if (selectedTool === "extract-pages") {
        downloadName = "extracted-pages.pdf";
      } else if (selectedTool === "organize-pdf") {
        downloadName = "organized.pdf";
      } else if (selectedTool === "jpg-to-pdf") {
        downloadName = "converted.pdf";
      } else if (selectedTool === "pdf-to-word") {
        downloadName = "converted.docx";
      } else if (selectedTool === "word-to-pdf") {
        downloadName = "converted.pdf";
      } else if (selectedTool === "protect-pdf") {
        downloadName = "protected.pdf";
      } else {
        downloadName = `${selectedTool}.pdf`;
      }
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      if (window.gtag) {
        window.gtag("event", "file_processed", {
          event_category: "File Processing",
          event_label: selectedTool,
          value: files.length,
        });
      }
    } catch (error) {
      console.error("Error processing files:", error);
      setError(error.message || "Error processing files. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return { processFiles, processing, error, setError };
};

export default useFileProcessor;
