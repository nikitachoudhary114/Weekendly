import { formatTime } from "@/lib/time";

/** Parse droppable id like "saturday-14" → day + "2:00 PM" */
export function parseSlotId(
  id: string
): { day: "saturday" | "sunday"; time: string } | null {
  const match = id.match(/^(saturday|sunday)-(\d+)$/);
  if (!match) return null;
  const day = match[1] as "saturday" | "sunday";
  const hour = parseInt(match[2], 10);
  if (Number.isNaN(hour)) return null;
  return { day, time: formatTime(hour) };
}
