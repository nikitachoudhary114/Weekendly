import type { ScheduleItem } from "@/types";

export function parseStoredSchedule(raw: string | null): ScheduleItem[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ScheduleItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item?.id &&
          item?.activity?.duration &&
          item?.startTime &&
          (item.day === "saturday" || item.day === "sunday")
      )
      .map((item) => ({
        ...item,
        duration: item.duration ?? item.activity.duration,
      }));
  } catch {
    return [];
  }
}

export function loadWeekendFromStorage(): {
  saturday: ScheduleItem[];
  sunday: ScheduleItem[];
} {
  return {
    saturday: parseStoredSchedule(localStorage.getItem("saturday")),
    sunday: parseStoredSchedule(localStorage.getItem("sunday")),
  };
}
