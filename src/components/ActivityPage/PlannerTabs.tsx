import { BookOpen, Calendar, PieChart } from "lucide-react";
import { useThemeContext } from "@/context/ThemeProvider";

export type PlannerTab = "library" | "schedule" | "summary";

interface Props {
  active: PlannerTab;
  onChange: (tab: PlannerTab) => void;
  scheduleCount: number;
}

const PlannerTabs: React.FC<Props> = ({ active, onChange, scheduleCount }) => {
  const { theme } = useThemeContext();
  const isDark = theme === "dark";

  const tabs: { id: PlannerTab; label: string; icon: typeof BookOpen }[] = [
    { id: "library", label: "Activities", icon: BookOpen },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "summary", label: "Summary", icon: PieChart },
  ];

  return (
    <div
      className={`lg:hidden sticky top-16 z-30 -mx-4 px-4 py-2 border-b backdrop-blur-md ${
        isDark
          ? "bg-gray-950/90 border-gray-800"
          : "bg-white/90 border-gray-200"
      }`}
    >
      <div className="flex gap-1 p-1 rounded-xl bg-gray-200/60 dark:bg-gray-800/80">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-1 rounded-lg text-xs font-semibold transition ${
              active === id
                ? "bg-indigo-600 text-white shadow-sm"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "schedule" && scheduleCount > 0 && (
              <span
                className={`text-[10px] px-1.5 rounded-full ${
                  active === id ? "bg-white/20" : "bg-indigo-500/20 text-indigo-500"
                }`}
              >
                {scheduleCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlannerTabs;
