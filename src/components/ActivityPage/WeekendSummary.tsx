import React from "react";
import { useAtomValue } from "jotai";
import { weekendStateAtom } from "@/store/atoms";
import { getScheduleDuration } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { parseHour } from "@/lib/time";

const WeekendSummary: React.FC = () => {
  const { saturday, sunday } = useAtomValue(weekendStateAtom);
  const { isDark } = useTheme();

  const all = [...saturday, ...sunday];
  const totalHours = all.reduce(
    (sum, i) => sum + getScheduleDuration(i),
    0
  );

  const moodCount: Record<string, number> = {};
  all.forEach((i) => {
    moodCount[i.activity.mood] = (moodCount[i.activity.mood] || 0) + 1;
  });

  const moodColors: Record<string, string> = {
    adventurous:
      "bg-orange-300 text-orange-800 dark:bg-orange-700 dark:text-orange-200",
    relaxing:
      "bg-green-300 text-green-800 dark:bg-green-700 dark:text-green-200",
    creative:
      "bg-purple-300 text-purple-800 dark:bg-purple-700 dark:text-purple-200",
    energetic: "bg-red-300 text-red-800 dark:bg-red-700 dark:text-red-200",
    social:
      "bg-blue-300 text-blue-800 dark:bg-blue-700 dark:text-blue-200",
    Default: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  };

  const timeline = [...saturday, ...sunday].sort((a, b) => {
    const dayOrder = a.day === "saturday" ? 0 : 1;
    const dayOrderB = b.day === "saturday" ? 0 : 1;
    if (dayOrder !== dayOrderB) return dayOrder - dayOrderB;
    return parseHour(a.startTime) - parseHour(b.startTime);
  });

  return (
    <div
      className={`w-full p-6 rounded-2xl mb-8 shadow-lg transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100 shadow-gray-800"
          : "bg-white text-gray-900 shadow-gray-200"
      }`}
    >
      <h4 className="font-bold text-xl sm:text-2xl mb-4">Weekend Summary</h4>

      <div className="flex flex-col sm:flex-row sm:justify-between mb-4 gap-2 sm:gap-4">
        <p className="text-sm sm:text-base">Total Activities: {all.length}</p>
        <p className="text-sm sm:text-base">
          Total Hours Planned: {totalHours}
        </p>
      </div>

      {timeline.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium opacity-70 mb-2">Your timeline</p>
          <ul className="space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
            {timeline.map((item) => (
              <li
                key={item.id}
                className="text-sm flex items-center gap-2 opacity-90"
              >
                <span className="capitalize w-16 shrink-0 opacity-60">
                  {item.day.slice(0, 3)}
                </span>
                <span className="shrink-0 w-20 opacity-80">
                  {item.startTime}
                </span>
                <span>
                  {item.activity.icon} {item.activity.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {Object.entries(moodCount).map(([m, v]) => {
          const colorClass = moodColors[m] || moodColors["Default"];
          return (
            <motion.span
              key={m}
              className={`px-3 py-1 rounded-full font-medium text-sm cursor-default select-none ${colorClass} transition-all duration-200`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {m} x{v}
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default WeekendSummary;
