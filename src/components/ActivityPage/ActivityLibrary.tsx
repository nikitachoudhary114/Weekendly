import React, { useState } from "react";
import ActivityCard from "./ActivityCard";
import { useAtomValue } from "jotai";
import { Search, Filter } from "lucide-react";
import type { IActivity } from "@/types";
import { selectedActivityAtom } from "@/store/atoms";
import { useTheme } from "@/hooks/useTheme";

interface Props {
  activities: IActivity[];
  isTouch: boolean;
  onSelectActivity: (activity: IActivity) => void;
}

const ActivityLibrary: React.FC<Props> = ({
  activities,
  isTouch,
  onSelectActivity,
}) => {
  const { isDark } = useTheme();
  const selectedId = useAtomValue(selectedActivityAtom)?.id ?? null;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = activities.filter(
    (a) =>
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.description.toLowerCase().includes(search.toLowerCase())) &&
      (category === "all" || a.category === category)
  );

  const categories = [
    "all",
    "indoor",
    "outdoor",
    "food",
    "social",
    "relaxation",
    "fitness",
    "culture",
  ];

  return (
    <div className={`flex flex-col ${isDark ? "text-white" : "text-gray-900"}`}>
      <div className="flex items-center mb-3">
        <Filter
          className={`${isDark ? "text-green-400" : "text-blue-500"} mr-2 w-5 h-5`}
        />
        <h3 className="font-bold text-lg">Activity Library</h3>
      </div>

      <p className="text-xs opacity-60 mb-3">
        {isTouch
          ? "Drag or tap a card, then drop on Schedule"
          : "Drag any card onto a time slot in the schedule →"}
      </p>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
              isDark
                ? "bg-gray-800 border-gray-700 focus:ring-green-400"
                : "bg-white border-gray-300 focus:ring-blue-400"
            }`}
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={`px-3 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
            isDark
              ? "bg-gray-800 border-gray-700 focus:ring-green-400"
              : "bg-white border-gray-300 focus:ring-blue-400"
          }`}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[min(50vh,380px)] lg:max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin pb-2">
        {filtered.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            isSelected={selectedId === activity.id}
            onSelect={() => onSelectActivity(activity)}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500 text-center col-span-full py-8">
            No activities found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityLibrary;
