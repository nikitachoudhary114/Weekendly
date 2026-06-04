import type { IActivity, ScheduleItem } from "@/types";
import { getScheduleDuration } from "@/types";
import { canPlaceAt, resolveOverlaps, parseHour, formatTime } from "@/lib/time";

export interface WeekendState {
  saturday: ScheduleItem[];
  sunday: ScheduleItem[];
}

export function addActivityToPlan(
  prev: WeekendState,
  activity: IActivity,
  day: "saturday" | "sunday",
  time: string
): WeekendState | null {
  if (!canPlaceAt(time, activity.duration)) return null;

  const newItem: ScheduleItem = {
    id: crypto.randomUUID(),
    activity,
    startTime: time,
    day,
    duration: activity.duration,
  };

  if (day === "saturday") {
    const updated = resolveOverlaps(prev.saturday, time, activity.duration);
    return { ...prev, saturday: [...updated, newItem] };
  }

  const updated = resolveOverlaps(prev.sunday, time, activity.duration);
  return { ...prev, sunday: [...updated, newItem] };
}

export function moveScheduleItem(
  prev: WeekendState,
  id: string,
  day: "saturday" | "sunday",
  time: string
): WeekendState | null {
  const item = [...prev.saturday, ...prev.sunday].find((i) => i.id === id);
  if (!item) return null;
  const duration = getScheduleDuration(item);
  if (!canPlaceAt(time, duration)) return null;

  let newSat = prev.saturday.filter((i) => i.id !== id);
  let newSun = prev.sunday.filter((i) => i.id !== id);
  const moved: ScheduleItem = { ...item, startTime: time, day };

  if (day === "saturday") {
    newSat = resolveOverlaps(newSat, time, duration);
    newSat = [...newSat, moved];
  } else {
    newSun = resolveOverlaps(newSun, time, duration);
    newSun = [...newSun, moved];
  }

  return { saturday: newSat, sunday: newSun };
}

export function resizeScheduleItem(
  prev: WeekendState,
  id: string,
  newDuration: number
): WeekendState | null {
  const item = [...prev.saturday, ...prev.sunday].find((i) => i.id === id);
  if (!item || newDuration < 1) return null;

  const duration = Math.round(newDuration);
  if (!canPlaceAt(item.startTime, duration)) return null;

  const list =
    item.day === "saturday" ? prev.saturday : prev.sunday;
  const others = list.filter((i) => i.id !== id);
  const resolved = resolveOverlaps(others, item.startTime, duration);
  const updated: ScheduleItem = { ...item, duration };

  if (item.day === "saturday") {
    return { ...prev, saturday: [...resolved, updated] };
  }
  return { ...prev, sunday: [...resolved, updated] };
}

export function nudgeScheduleItem(
  prev: WeekendState,
  id: string,
  hourDelta: number
): WeekendState | null {
  const item = [...prev.saturday, ...prev.sunday].find((i) => i.id === id);
  if (!item) return null;

  const newHour = parseHour(item.startTime) + hourDelta;
  return moveScheduleItem(prev, id, item.day, formatTime(newHour));
}
