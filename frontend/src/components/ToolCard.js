import React from "react";
import {
  FaFileAlt,
  FaCompress,
  FaEdit,
  FaLock,
  FaImage,
  FaFileWord,
  FaCode,
} from "react-icons/fa";

const ToolCard = ({ tool, isNew = false }) => {
  const getIcon = (toolValue) => {
    const iconMap = {
      merge: FaFileAlt,
      split: FaFileAlt,
      compress: FaCompress,
      convert: FaFileAlt,
      "pdf-to-word": FaFileWord,
      rotate: FaFileAlt,
      "remove-pages": FaEdit,
      "extract-pages": FaEdit,
      "organize-pdf": FaEdit,
      "jpg-to-pdf": FaImage,
      "word-to-pdf": FaFileWord,
      "html-to-pdf": FaCode,
      "edit-pdf": FaEdit,
      "protect-pdf": FaLock,
    };
    return iconMap[toolValue] || FaFileAlt;
  };

  const getIconColors = (toolValue) => {
    const colorMap = {
      merge: {
        bg: "bg-blue-100",
        icon: "text-blue-600",
        hoverBg: "group-hover:bg-blue-200",
        hoverIcon: "group-hover:text-blue-700",
      },
      split: {
        bg: "bg-purple-100",
        icon: "text-purple-600",
        hoverBg: "group-hover:bg-purple-200",
        hoverIcon: "group-hover:text-purple-700",
      },
      compress: {
        bg: "bg-green-100",
        icon: "text-green-600",
        hoverBg: "group-hover:bg-green-200",
        hoverIcon: "group-hover:text-green-700",
      },
      convert: {
        bg: "bg-orange-100",
        icon: "text-orange-600",
        hoverBg: "group-hover:bg-orange-200",
        hoverIcon: "group-hover:text-orange-700",
      },
      "pdf-to-word": {
        bg: "bg-blue-100",
        icon: "text-blue-600",
        hoverBg: "group-hover:bg-blue-200",
        hoverIcon: "group-hover:text-blue-700",
      },
      rotate: {
        bg: "bg-indigo-100",
        icon: "text-indigo-600",
        hoverBg: "group-hover:bg-indigo-200",
        hoverIcon: "group-hover:text-indigo-700",
      },
      "remove-pages": {
        bg: "bg-red-100",
        icon: "text-red-600",
        hoverBg: "group-hover:bg-red-200",
        hoverIcon: "group-hover:text-red-700",
      },
      "extract-pages": {
        bg: "bg-teal-100",
        icon: "text-teal-600",
        hoverBg: "group-hover:bg-teal-200",
        hoverIcon: "group-hover:text-teal-700",
      },
      "organize-pdf": {
        bg: "bg-cyan-100",
        icon: "text-cyan-600",
        hoverBg: "group-hover:bg-cyan-200",
        hoverIcon: "group-hover:text-cyan-700",
      },
      "jpg-to-pdf": {
        bg: "bg-pink-100",
        icon: "text-pink-600",
        hoverBg: "group-hover:bg-pink-200",
        hoverIcon: "group-hover:text-pink-700",
      },
      "word-to-pdf": {
        bg: "bg-blue-100",
        icon: "text-blue-600",
        hoverBg: "group-hover:bg-blue-200",
        hoverIcon: "group-hover:text-blue-700",
      },
      "html-to-pdf": {
        bg: "bg-yellow-100",
        icon: "text-yellow-600",
        hoverBg: "group-hover:bg-yellow-200",
        hoverIcon: "group-hover:text-yellow-700",
      },
      "edit-pdf": {
        bg: "bg-violet-100",
        icon: "text-violet-600",
        hoverBg: "group-hover:bg-violet-200",
        hoverIcon: "group-hover:text-violet-700",
      },
      "protect-pdf": {
        bg: "bg-emerald-100",
        icon: "text-emerald-600",
        hoverBg: "group-hover:bg-emerald-200",
        hoverIcon: "group-hover:text-emerald-700",
      },
    };
    return (
      colorMap[toolValue] || {
        bg: "bg-gray-100",
        icon: "text-gray-600",
        hoverBg: "group-hover:bg-gray-200",
        hoverIcon: "group-hover:text-gray-700",
      }
    );
  };

  const IconComponent = getIcon(tool.value);
  const iconColors = getIconColors(tool.value);

  return (
    <div className="bg-modern-calm-prussian-blue p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 cursor-pointer border border-modern-calm-dusk-blue hover:border-modern-calm-dusty-denim group relative h-full">
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-modern-calm-dusk-blue to-modern-calm-dusty-denim text-white text-xs font-semibold px-2 py-1 rounded-full">
          New
        </span>
      )}
      <div className="flex flex-col items-center text-center space-y-3 h-full">
        <div
          className={`p-3 ${iconColors.bg} ${iconColors.hoverBg} rounded-full transition-colors duration-300`}
        >
          <IconComponent
            className={`text-2xl ${iconColors.icon} ${iconColors.hoverIcon} transition-colors duration-300`}
          />
        </div>
        <h3 className="text-lg font-semibold text-modern-calm-alabaster-grey group-hover:text-white transition-colors duration-300 line-clamp-2">
          {tool.name}
        </h3>
        <p className="text-sm text-modern-calm-dusty-denim leading-relaxed line-clamp-3 flex-grow">
          {tool.description}
        </p>
      </div>
    </div>
  );
};

export default ToolCard;
