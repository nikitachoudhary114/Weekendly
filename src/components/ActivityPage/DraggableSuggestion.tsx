import { useDraggable } from "@dnd-kit/core";
import type { IActivity } from "@/types";

interface Props {
  activity: IActivity;
  isDark: boolean;
}

const DraggableSuggestion: React.FC<Props> = ({ activity, isDark }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `suggest-${activity.id}`,
    data: {
      type: "activity" as const,
      activity,
      label: `${activity.icon} ${activity.name}`,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border cursor-grab active:cursor-grabbing transition-opacity ${
        isDragging ? "opacity-30" : "opacity-100"
      } ${
        isDark
          ? "border-gray-600 bg-gray-800 hover:bg-gray-700"
          : "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900"
      }`}
    >
      {activity.icon} {activity.name}
    </div>
  );
};

export default DraggableSuggestion;
