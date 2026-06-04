import type { IActivity } from "@/types";
import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical } from "lucide-react";
import { useThemeContext } from "@/context/ThemeProvider";

interface ActivityCardProps {
  activity: IActivity;
  isSelected: boolean;
  onSelect: () => void;
}

const categoryColorsDark: Record<string, string> = {
  indoor: "bg-green-500/80",
  outdoor: "bg-blue-500/80",
  food: "bg-orange-400/80",
  social: "bg-purple-500/80",
  relaxation: "bg-teal-400/80",
  fitness: "bg-red-500/80",
  culture: "bg-yellow-400/80",
};

const categoryColorsLight: Record<string, string> = {
  indoor: "bg-green-600/30",
  outdoor: "bg-blue-600/30",
  food: "bg-orange-500/30",
  social: "bg-purple-600/30",
  relaxation: "bg-teal-500/30",
  fitness: "bg-red-500/30",
  culture: "bg-yellow-500/30",
};

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isSelected,
  onSelect,
}) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `library-${activity.id}`,
      data: {
        type: "activity" as const,
        activity,
        label: `${activity.icon} ${activity.name}`,
      },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onSelect}
      className={`rounded-xl p-4 border text-left w-full transition-shadow touch-manipulation ${
        isSelected
          ? "ring-2 ring-indigo-500 border-indigo-500 shadow-lg"
          : "hover:shadow-md"
      } ${
        isDragging ? "opacity-40 shadow-xl z-10" : ""
      } ${
        isDark
          ? "bg-gray-900 hover:bg-gray-800 border-gray-700 text-white"
          : "bg-gray-50 hover:bg-white border-gray-200 text-gray-900"
      } cursor-grab active:cursor-grabbing`}
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 opacity-30 shrink-0" />
          <span className="text-2xl">{activity.icon}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {isSelected && (
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white">
              <Check className="w-3.5 h-3.5" />
            </span>
          )}
          <span
            className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
              isDark
                ? categoryColorsDark[activity.category]
                : categoryColorsLight[activity.category]
            }`}
          >
            {activity.category}
          </span>
        </div>
      </div>
      <h4 className="font-bold text-base leading-tight">{activity.name}</h4>
      <p
        className={`text-xs sm:text-sm mt-1 line-clamp-2 ${
          isDark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        {activity.description}
      </p>
      <div className="flex justify-between mt-2 text-xs">
        <span
          className={`px-2 py-0.5 rounded ${
            isDark ? "bg-gray-800" : "bg-gray-200"
          }`}
        >
          {activity.duration}h
        </span>
        <span className="capitalize opacity-70">{activity.mood}</span>
      </div>
    </div>
  );
};

export default ActivityCard;
