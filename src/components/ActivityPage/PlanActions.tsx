import React from "react";
import { Download, Save, Trash2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  onClear: () => void;
  onSave: () => void;
  onExport: () => void;
}

const PlanActions: React.FC<Props> = ({ onClear, onSave, onExport }) => {
  const { isDark } = useTheme();

  const iconButtonClasses = `
    flex flex-col items-center gap-2
    text-sm font-medium
  `;

  const circleClasses = `
    flex items-center justify-center w-12 h-12 rounded-full 
    shadow-sm transition-colors duration-200
    ${
      isDark
        ? "bg-gray-800 text-gray-200 hover:bg-gray-700"
        : "bg-white text-gray-700 hover:bg-gray-100"
    }
  `;

  return (
    <div className="flex items-center gap-6 justify-center mr-2">
      <button type="button" className={iconButtonClasses} onClick={onExport}>
        <div className={circleClasses}>
          <Download size={20} />
        </div>
        <span>Export Poster</span>
      </button>

      <button type="button" className={iconButtonClasses} onClick={onSave}>
        <div className={circleClasses}>
          <Save size={20} />
        </div>
        <span>Save</span>
      </button>

      <button type="button" className={iconButtonClasses} onClick={onClear}>
        <div className={circleClasses}>
          <Trash2 size={20} />
        </div>
        <span>Clear All</span>
      </button>
    </div>
  );
};

export default PlanActions;
