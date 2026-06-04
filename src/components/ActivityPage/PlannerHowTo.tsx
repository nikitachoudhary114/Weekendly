import { Hand, MousePointerClick, Smartphone } from "lucide-react";
import { useThemeContext } from "@/context/ThemeProvider";

interface Props {
  isTouch: boolean;
  hasSelection: boolean;
}

const PlannerHowTo: React.FC<Props> = ({ isTouch, hasSelection }) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  if (isTouch) {
    return (
      <div
        className={`rounded-xl px-4 py-3 text-sm border flex gap-3 items-start ${
          hasSelection
            ? isDark
              ? "border-indigo-500/50 bg-indigo-950/40 text-indigo-100"
              : "border-indigo-300 bg-indigo-50 text-indigo-900"
            : isDark
              ? "border-gray-700 bg-gray-800/50 text-gray-300"
              : "border-gray-200 bg-gray-50 text-gray-700"
        }`}
      >
        <Smartphone className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          {hasSelection ? (
            <>
              <p className="font-semibold">Activity selected</p>
              <p className="opacity-80 mt-0.5">
                Open the <strong>Schedule</strong> tab and tap a time slot to
                add it.
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">How to add activities</p>
              <p className="opacity-80 mt-0.5">
                1. Tap an activity in the library · 2. Switch to Schedule · 3.
                Tap a time slot
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl px-4 py-3 text-sm border flex gap-3 items-start ${
        isDark
          ? "border-gray-700 bg-gray-800/50 text-gray-300"
          : "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      <Hand className="w-5 h-5 shrink-0 mt-0.5 hidden sm:block" />
      <MousePointerClick className="w-5 h-5 shrink-0 mt-0.5 sm:hidden" />
      <p>
        <span className="font-semibold">Desktop:</span> drag from the library onto
        a time slot. Drag scheduled events to move them. Tap{" "}
        <span className="font-medium">+ Add</span> on mobile-sized windows too.
      </p>
    </div>
  );
};

export default PlannerHowTo;
