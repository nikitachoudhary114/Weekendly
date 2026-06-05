import React, { useState } from "react";
import { useRecoilValue } from "recoil";
import { Plus } from "lucide-react";
import { weekendStateAtom, selectedActivityAtom } from "@/recoil/atoms";
import { getScheduleDuration } from "@/types";
import { useTheme } from "@/hooks/useTheme";
import ScheduleEventBlock from "./ScheduleEventBlock";
import DroppableSlot from "./DroppableSlot";
import {
  TIME_SLOTS,
  parseHour,
  formatTime,
  getOccupiedHours,
  SCHEDULE_END,
} from "@/lib/time";

interface Props {
  isTouch: boolean;
  onSlotTap: (day: "saturday" | "sunday", time: string) => void;
  onRemoveActivity: (id: string) => void;
  onMoveSchedule: (
    id: string,
    day: "saturday" | "sunday",
    time: string
  ) => void;
  onResizeSchedule: (id: string, duration: number) => void;
}

const MOOD_STYLES: Record<string, { light: string; dark: string }> = {
  adventurous: {
    light: "bg-orange-100 border-orange-300 text-orange-900",
    dark: "bg-orange-900/60 border-orange-700 text-orange-100",
  },
  relaxing: {
    light: "bg-green-100 border-green-300 text-green-900",
    dark: "bg-green-900/60 border-green-700 text-green-100",
  },
  creative: {
    light: "bg-purple-100 border-purple-300 text-purple-900",
    dark: "bg-purple-900/60 border-purple-700 text-purple-100",
  },
  energetic: {
    light: "bg-red-100 border-red-300 text-red-900",
    dark: "bg-red-900/60 border-red-700 text-red-100",
  },
  social: {
    light: "bg-blue-100 border-blue-300 text-blue-900",
    dark: "bg-blue-900/60 border-blue-700 text-blue-100",
  },
};

function slotId(day: "saturday" | "sunday", hour: number) {
  return `${day}-${hour}`;
}

const WeekendSchedule: React.FC<Props> = ({
  isTouch,
  onSlotTap,
  onRemoveActivity,
  onMoveSchedule,
  onResizeSchedule,
}) => {
  const { saturday, sunday } = useRecoilValue(weekendStateAtom);
  const selectedActivity = useRecoilValue(selectedActivityAtom);
  const { isDark } = useTheme();
  const [activeDay, setActiveDay] = useState<"saturday" | "sunday">("saturday");

  const handleMoveByHour = (
    id: string,
    day: "saturday" | "sunday",
    hour: number
  ) => {
    onMoveSchedule(id, day, formatTime(hour));
  };

  const DayColumn = ({
    day,
    items,
  }: {
    day: "saturday" | "sunday";
    items: typeof saturday;
  }) => {
    const sorted = [...items].sort(
      (a, b) => parseHour(a.startTime) - parseHour(b.startTime)
    );
    const occupiedHours = new Set<number>();
    sorted.forEach((ev) => {
      getOccupiedHours(ev.startTime, getScheduleDuration(ev)).forEach((h) =>
        occupiedHours.add(h)
      );
    });

    return (
      <div className="flex-1">
        <h4 className="font-bold text-base sm:text-lg mb-3 text-center capitalize flex items-center justify-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              day === "saturday" ? "bg-indigo-500" : "bg-violet-500"
            }`}
          />
          {day}
          <span className="text-xs sm:text-sm font-normal opacity-60">
            ({items.length})
          </span>
        </h4>
        <div className="flex flex-col gap-2 max-h-[min(60vh,480px)] overflow-y-auto scrollbar-thin pr-1">
          {TIME_SLOTS.map((hour) => {
            const event = sorted.find((ev) => parseHour(ev.startTime) === hour);
            const id = slotId(day, hour);
            const canTapAdd = isTouch && selectedActivity && !event;

            if (event) {
              const moodStyle =
                MOOD_STYLES[event.activity.mood] ?? MOOD_STYLES.relaxing;
              const maxDuration = SCHEDULE_END - parseHour(event.startTime) + 1;

              return (
                <DroppableSlot key={event.id} id={id}>
                  <ScheduleEventBlock
                    event={event}
                    day={day}
                    isDark={isDark}
                    moodClass={isDark ? moodStyle.dark : moodStyle.light}
                    maxDuration={maxDuration}
                    onRemove={onRemoveActivity}
                    onMove={handleMoveByHour}
                    onResize={onResizeSchedule}
                  />
                </DroppableSlot>
              );
            }

            if (!occupiedHours.has(hour)) {
              return (
                <DroppableSlot
                  key={id}
                  id={id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSlotTap(day, formatTime(hour))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      onSlotTap(day, formatTime(hour));
                  }}
                  className={`w-full border border-dashed rounded-lg px-3 py-3 text-center text-sm transition-all touch-manipulation min-h-[52px] cursor-pointer ${
                    isDark
                      ? "border-gray-600 text-gray-400"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  <span className="font-medium">{formatTime(hour)}</span>
                  {canTapAdd ? (
                    <span className="flex items-center justify-center gap-1 text-xs mt-1 text-indigo-500 font-semibold">
                      <Plus className="w-3 h-3" />
                      Add {selectedActivity?.name}
                    </span>
                  ) : (
                    <span className="block text-xs mt-0.5 opacity-50">
                      {isTouch ? "Tap to add" : "Drop here"}
                    </span>
                  )}
                </DroppableSlot>
              );
            }

            return (
              <DroppableSlot key={id} id={id} className="h-3 rounded min-h-[12px]">
                <span className="sr-only">{formatTime(hour)}</span>
              </DroppableSlot>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-center px-1">
        <h3 className="text-lg sm:text-xl font-bold">Weekend Schedule</h3>
        <p className="text-xs sm:text-sm opacity-60 mt-1">
          Drag activities here · Grip or ↑↓ to move · +/- to change length
        </p>
      </div>

      <div className="flex gap-2 p-1 rounded-full bg-gray-200/50 dark:bg-gray-800/80 w-full max-w-sm mx-auto">
        {(["saturday", "sunday"] as const).map((day) => (
          <button
            key={day}
            type="button"
            onClick={() => setActiveDay(day)}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition touch-manipulation ${
              activeDay === day
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow"
                : isDark
                  ? "text-gray-400"
                  : "text-gray-600"
            }`}
          >
            {day.charAt(0).toUpperCase() + day.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-full">
        {activeDay === "saturday" ? (
          <DayColumn day="saturday" items={saturday} />
        ) : (
          <DayColumn day="sunday" items={sunday} />
        )}
      </div>
    </div>
  );
};

export default WeekendSchedule;
