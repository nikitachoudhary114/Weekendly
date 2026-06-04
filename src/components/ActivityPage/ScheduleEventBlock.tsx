import React, { useRef, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Minus,
  Plus,
} from "lucide-react";
import type { ScheduleItem } from "@/types";
import { getScheduleDuration } from "@/types";
import { getEndTime, parseHour, canPlaceAt, formatTime } from "@/lib/time";

interface Props {
  event: ScheduleItem;
  day: "saturday" | "sunday";
  isDark: boolean;
  moodClass: string;
  maxDuration: number;
  onRemove: (id: string) => void;
  onMove: (id: string, day: "saturday" | "sunday", hour: number) => void;
  onResize: (id: string, duration: number) => void;
}

const ScheduleEventBlock: React.FC<Props> = ({
  event,
  day,
  isDark,
  moodClass,
  maxDuration,
  onRemove,
  onMove,
  onResize,
}) => {
  const duration = getScheduleDuration(event);
  const endTime = getEndTime(event.startTime, duration);
  const startHour = parseHour(event.startTime);
  const canMoveUp = canPlaceAt(formatTime(startHour - 1), duration);
  const canMoveDown = canPlaceAt(formatTime(startHour + 1), duration);

  const resizeStartY = useRef(0);
  const resizeStartDuration = useRef(duration);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `schedule-${event.id}`,
      data: {
        type: "schedule" as const,
        id: event.id,
        fromDay: day,
        label: `${event.activity.icon} ${event.activity.name}`,
      },
    });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation();
      resizeStartY.current = e.clientY;
      resizeStartDuration.current = duration;

      const onMove = (ev: PointerEvent) => {
        const deltaHours = Math.round(
          (ev.clientY - resizeStartY.current) / 44
        );
        resizeStartDuration.current = Math.min(
          maxDuration,
          Math.max(1, duration + deltaHours)
        );
      };

      const onUp = () => {
        onResize(event.id, resizeStartDuration.current);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [duration, event.id, maxDuration, onResize]
  );

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, minHeight: `${Math.max(duration * 2.75, 3.5)}rem` }}
      className={`relative border rounded-lg shadow-sm flex flex-col ${moodClass} ${
        isDragging ? "opacity-40 z-50" : "opacity-100"
      }`}
    >
      <div className="flex items-start gap-1 px-2 pt-2 pb-1">
        <button
          type="button"
          aria-label="Drag to move"
          className="shrink-0 p-1.5 rounded-md cursor-grab active:cursor-grabbing touch-none hover:bg-black/5 dark:hover:bg-white/10"
          {...listeners}
          {...attributes}
        >
          <GripVertical className="w-4 h-4 opacity-50" />
        </button>

        <div className="flex-1 min-w-0 pointer-events-none">
          <span className="font-semibold text-sm block truncate">
            {event.activity.icon} {event.activity.name}
          </span>
          <span className="text-xs opacity-75">
            {event.startTime} → {endTime}
          </span>
        </div>

        <div className="flex flex-col gap-0.5 shrink-0">
          <button
            type="button"
            aria-label="Move earlier"
            disabled={!canMoveUp}
            onClick={() => onMove(event.id, day, startHour - 1)}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30 touch-manipulation"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Move later"
            disabled={!canMoveDown}
            onClick={() => onMove(event.id, day, startHour + 1)}
            className="p-1 rounded hover:bg-black/5 disabled:opacity-30 touch-manipulation"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Remove"
          onClick={() => onRemove(event.id)}
          className="shrink-0 p-1.5 rounded-md hover:bg-red-500/15 hover:text-red-500 touch-manipulation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-2 pb-2 mt-auto gap-2">
        <span className="text-xs opacity-60">Duration</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Shorter"
            disabled={duration <= 1}
            onClick={() => onResize(event.id, duration - 1)}
            className="p-1 rounded border border-current/20 disabled:opacity-30 touch-manipulation"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-bold min-w-[2ch] text-center">
            {duration}h
          </span>
          <button
            type="button"
            aria-label="Longer"
            disabled={duration >= maxDuration}
            onClick={() => onResize(event.id, duration + 1)}
            className="p-1 rounded border border-current/20 disabled:opacity-30 touch-manipulation"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        role="separator"
        aria-label="Drag to resize duration"
        onPointerDown={onResizePointerDown}
        className={`h-3 mx-2 mb-1.5 rounded-full cursor-ns-resize touch-none flex items-center justify-center ${
          isDark ? "bg-white/15 hover:bg-white/25" : "bg-black/10 hover:bg-black/15"
        }`}
      >
        <div className="w-8 h-0.5 rounded-full bg-current opacity-40" />
      </div>
    </div>
  );
};

export default ScheduleEventBlock;
