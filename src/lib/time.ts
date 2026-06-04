export const SCHEDULE_START = 8;
export const SCHEDULE_END = 23;

export const TIME_SLOTS = Array.from(
  { length: SCHEDULE_END - SCHEDULE_START + 1 },
  (_, i) => SCHEDULE_START + i
);

/** Parse "8:00 AM" / "12:00 PM" into 24h hour (0–23). */
export function parseHour(time: string): number {
  const trimmed = time.trim();
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) {
    const h = parseInt(trimmed.split(":")[0], 10);
    return Number.isNaN(h) ? SCHEDULE_START : h;
  }

  let hour = parseInt(match[1], 10);
  const suffix = match[3]?.toUpperCase();

  if (suffix === "PM" && hour !== 12) hour += 12;
  if (suffix === "AM" && hour === 12) hour = 0;
  if (!suffix && hour >= 1 && hour <= 7) hour += 12;

  return hour;
}

export function formatTime(hour: number): string {
  const h = ((hour % 24) + 24) % 24;
  const suffix = h >= 12 ? "PM" : "AM";
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}:00 ${suffix}`;
}

export function getEndTime(start: string, duration: number): string {
  return formatTime(parseHour(start) + duration);
}

export function getOccupiedHours(startTime: string, duration: number): number[] {
  const start = parseHour(startTime);
  return Array.from({ length: duration }, (_, i) => start + i);
}

function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}

/** Whether an activity fits entirely inside the visible grid (8 AM–11 PM). */
export function canPlaceAt(startTime: string, duration: number): boolean {
  const start = parseHour(startTime);
  return (
    start >= SCHEDULE_START && start + duration - 1 <= SCHEDULE_END
  );
}

export function findOverlap(
  items: { startTime: string; activity: { duration: number }; id?: string }[],
  startTime: string,
  duration: number,
  excludeId?: string
): boolean {
  const newStart = parseHour(startTime);
  const newEnd = newStart + duration;

  return items.some((item) => {
    if (excludeId && item.id === excludeId) return false;
    const existingStart = parseHour(item.startTime);
    const existingEnd = existingStart + item.activity.duration;
    return rangesOverlap(newStart, newEnd, existingStart, existingEnd);
  });
}

/** Push overlapping items forward; drop items that no longer fit. */
export function resolveOverlaps<T extends { id: string; startTime: string; activity: { duration: number } }>(
  items: T[],
  newStartTime: string,
  newDuration: number,
  excludeId?: string
): T[] {
  const newStartHour = parseHour(newStartTime);
  const newEndHour = newStartHour + newDuration;

  let updated = items.map((item) => {
    if (excludeId && item.id === excludeId) return item;

    const existingStart = parseHour(item.startTime);
    const existingEnd = existingStart + item.activity.duration;

    if (
      rangesOverlap(newStartHour, newEndHour, existingStart, existingEnd)
    ) {
      const shiftedStart = newEndHour;
      if (!canPlaceAt(formatTime(shiftedStart), item.activity.duration)) {
        return null;
      }
      return { ...item, startTime: formatTime(shiftedStart) };
    }
    return item;
  });

  return updated.filter((i): i is T => i !== null);
}
