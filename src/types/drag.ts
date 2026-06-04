import type { IActivity } from "@/types";

export type DragPayload =
  | { type: "activity"; activity: IActivity }
  | { type: "schedule"; id: string; fromDay: "saturday" | "sunday" };

export function parseDragData(raw: string): DragPayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DragPayload;
    if (parsed.type === "activity" && parsed.activity?.id) return parsed;
    if (parsed.type === "schedule" && parsed.id) return parsed;
    return null;
  } catch {
    return null;
  }
}

export function writeDragData(e: React.DragEvent, payload: DragPayload) {
  const json = JSON.stringify(payload);
  e.dataTransfer.setData("text/plain", json);
  e.dataTransfer.setData("application/x-weekendly", json);
  e.dataTransfer.effectAllowed =
    payload.type === "activity" ? "copy" : "move";
}
