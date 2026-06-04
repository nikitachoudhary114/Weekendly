import { useState, useEffect, useCallback } from "react";
import type { IActivity, ScheduleItem } from "@/types";
import Header from "@/components/ActivityPage/Header";
import ActivityLibrary from "@/components/ActivityPage/ActivityLibrary";
import { activities } from "@/data/activities";
import WeekendSchedule from "@/components/ActivityPage/WeekendSchedule";
import WeekendSummary from "@/components/ActivityPage/WeekendSummary";
import PlanActions from "@/components/ActivityPage/PlanActions";
import LiveInsights from "@/components/ActivityPage/LiveInsights";
import PlannerHowTo from "@/components/ActivityPage/PlannerHowTo";
import PlannerTabs, { type PlannerTab } from "@/components/ActivityPage/PlannerTabs";
import { useToast } from "@/components/ui/toaster";
import { useThemeContext } from "@/context/ThemeProvider";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import * as htmlToImage from "html-to-image";
import { motion } from "framer-motion";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  addActivityToPlan,
  moveScheduleItem,
  resizeScheduleItem,
  type WeekendState,
} from "@/lib/plannerActions";
import type { DragPayload } from "@/types/drag";
import { parseSlotId } from "@/lib/parseSlotId";

function parseStoredSchedule(raw: string | null): ScheduleItem[] {
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

function Activity() {
  const [weekend, setWeekend] = useState<WeekendState>({
    saturday: [],
    sunday: [],
  });
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [mobileTab, setMobileTab] = useState<PlannerTab>("library");
  const [dragLabel, setDragLabel] = useState<string | null>(null);

  const { toast } = useToast();
  const { theme } = useThemeContext();
  const isDark = theme === "dark";
  const isTouch = useIsTouchDevice();

  const { saturday, sunday } = weekend;
  const scheduleCount = saturday.length + sunday.length;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    })
  );

  useEffect(() => {
    setWeekend({
      saturday: parseStoredSchedule(localStorage.getItem("saturday")),
      sunday: parseStoredSchedule(localStorage.getItem("sunday")),
    });
  }, []);

  useEffect(() => {
    localStorage.setItem("saturday", JSON.stringify(saturday));
    localStorage.setItem("sunday", JSON.stringify(sunday));
  }, [saturday, sunday]);

  const applyPayload = useCallback(
    (payload: DragPayload, day: "saturday" | "sunday", time: string) => {
      let success = false;

      setWeekend((prev) => {
        if (payload.type === "schedule") {
          const next = moveScheduleItem(prev, payload.id, day, time);
          if (!next) return prev;
          success = true;
          return next;
        }

        const next = addActivityToPlan(prev, payload.activity, day, time);
        if (!next) return prev;
        success = true;
        return next;
      });

      if (!success) {
        toast({
          title: "Can't place here",
          description:
            payload.type === "activity"
              ? `${payload.activity.name} doesn't fit at ${time}.`
              : "Must end by 11 PM — try an earlier slot.",
        });
        return false;
      }

      if (payload.type === "activity") {
        setSelectedActivity(null);
        toast({
          title: "Added!",
          description: `${payload.activity.name} on ${day} at ${time}.`,
        });
      } else {
        toast({
          title: "Moved",
          description: `Rescheduled to ${day} at ${time}.`,
        });
      }
      return true;
    },
    [toast]
  );

  const handleDndDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as
      | { label?: string; type?: string }
      | undefined;
    if (data?.label) setDragLabel(data.label);
    if (data?.type === "activity") setMobileTab("schedule");
  };

  const handleDndDragEnd = (event: DragEndEvent) => {
    setDragLabel(null);
    const { active, over } = event;
    if (!over) return;

    const slot = parseSlotId(String(over.id));
    if (!slot) return;

    const data = active.data.current as DragPayload | undefined;
    if (!data) return;

    if (data.type === "activity") {
      applyPayload(
        { type: "activity", activity: data.activity },
        slot.day,
        slot.time
      );
    } else if (data.type === "schedule") {
      applyPayload(
        { type: "schedule", id: data.id, fromDay: data.fromDay },
        slot.day,
        slot.time
      );
    }
  };

  const handleSlotTap = useCallback(
    (day: "saturday" | "sunday", time: string) => {
      if (!selectedActivity) {
        toast({
          title: "Pick an activity first",
          description: "Tap one in the Activities tab, then tap a time slot.",
        });
        setMobileTab("library");
        return;
      }
      applyPayload(
        { type: "activity", activity: selectedActivity },
        day,
        time
      );
    },
    [selectedActivity, applyPayload, toast]
  );

  const handleSelectActivity = useCallback(
    (activity: IActivity) => {
      setSelectedActivity((prev) =>
        prev?.id === activity.id ? null : activity
      );
      if (isTouch) setMobileTab("schedule");
    },
    [isTouch]
  );

  const handleMoveSchedule = useCallback(
    (id: string, day: "saturday" | "sunday", time: string) => {
      let success = false;
      setWeekend((prev) => {
        const next = moveScheduleItem(prev, id, day, time);
        if (!next) return prev;
        success = true;
        return next;
      });
      if (!success) {
        toast({
          title: "Can't move here",
          description: "Doesn't fit before 11 PM or overlaps another event.",
        });
      }
    },
    [toast]
  );

  const handleResizeSchedule = useCallback(
    (id: string, newDuration: number) => {
      let success = false;
      setWeekend((prev) => {
        const next = resizeScheduleItem(prev, id, newDuration);
        if (!next) return prev;
        success = true;
        return next;
      });
      if (!success) {
        toast({
          title: "Can't extend",
          description: "Not enough room before 11 PM or another event is in the way.",
        });
      }
    },
    [toast]
  );

  const handleRemove = (id: string) => {
    setWeekend((prev) => ({
      saturday: prev.saturday.filter((i) => i.id !== id),
      sunday: prev.sunday.filter((i) => i.id !== id),
    }));
  };

  const handleClear = () => {
    setWeekend({ saturday: [], sunday: [] });
    setSelectedActivity(null);
    toast({ title: "Plan cleared", description: "Your schedule is empty." });
  };

  const handleSave = () =>
    toast({
      title: "Plan saved",
      description: "Auto-saved to this browser.",
    });

  const exportPoster = () => {
    const schedule = document.getElementById("schedule-export-all");
    if (!schedule) return;

    htmlToImage
      .toPng(schedule, {
        pixelRatio: 2,
        backgroundColor: isDark ? "#111827" : "#ffffff",
      })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "weekend-plan.png";
        link.href = dataUrl;
        link.click();
        toast({ title: "Exported", description: "Poster downloaded as PNG." });
      })
      .catch(() =>
        toast({
          title: "Export failed",
          description: "Try again or reduce schedule size.",
        })
      );
  };

  const panelClass = `rounded-2xl p-4 sm:p-6 backdrop-blur-md border transition-colors ${
    isDark
      ? "bg-gray-900/80 border-gray-800"
      : "bg-white/70 border-gray-200 shadow-sm"
  }`;

  const showLibrary = mobileTab === "library";
  const showSchedule = mobileTab === "schedule";
  const showSummary = mobileTab === "summary";

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDndDragStart}
      onDragEnd={handleDndDragEnd}
    >
      <div
        className={`relative min-h-screen container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 transition-colors duration-300 mt-16 ${
          selectedActivity && isTouch ? "pb-24" : ""
        }`}
      >
        <Header />

        <div className="mb-4 space-y-3">
          <PlannerHowTo
            isTouch={isTouch}
            hasSelection={!!selectedActivity}
          />
          <PlannerTabs
            active={mobileTab}
            onChange={setMobileTab}
            scheduleCount={scheduleCount}
          />
        </div>

        <motion.div
          className="mb-4 lg:mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <LiveInsights activities={activities} />
        </motion.div>

        <motion.div
          className="flex flex-col lg:flex-row gap-4 lg:gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className={`flex-1 flex flex-col gap-4 lg:gap-6 ${
              showLibrary ? "block" : "hidden lg:flex"
            }`}
          >
            <div className={panelClass}>
              <ActivityLibrary
                activities={activities}
                selectedId={selectedActivity?.id ?? null}
                isTouch={isTouch}
                onSelectActivity={handleSelectActivity}
              />
            </div>
            <div className={`${panelClass} hidden lg:block`}>
              <WeekendSummary saturday={saturday} sunday={sunday} />
            </div>
          </div>

          <div
            className={`flex-1 flex flex-col gap-4 lg:gap-6 ${
              showSchedule ? "block" : "hidden lg:flex"
            }`}
          >
            <div id="schedule-export-all" className={panelClass}>
              <WeekendSchedule
                saturday={saturday}
                sunday={sunday}
                selectedActivity={selectedActivity}
                isTouch={isTouch}
                onSlotTap={handleSlotTap}
                onRemoveActivity={handleRemove}
                onMoveSchedule={handleMoveSchedule}
                onResizeSchedule={handleResizeSchedule}
              />
            </div>
            <PlanActions
              saturday={saturday}
              sunday={sunday}
              onClear={handleClear}
              onSave={handleSave}
              onExport={exportPoster}
            />
          </div>

          <div
            className={`lg:hidden ${showSummary ? "block" : "hidden"} ${panelClass}`}
          >
            <WeekendSummary saturday={saturday} sunday={sunday} />
          </div>
        </motion.div>

        {selectedActivity && isTouch && (
          <div
            className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3 border-t shadow-lg ${
              isDark
                ? "bg-gray-900 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <p className="text-sm text-center">
              <span className="font-semibold">
                {selectedActivity.icon} {selectedActivity.name}
              </span>{" "}
              — tap a time slot above to schedule
            </p>
          </div>
        )}
      </div>

      <DragOverlay dropAnimation={null}>
        {dragLabel ? (
          <div className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold shadow-xl text-sm pointer-events-none">
            {dragLabel}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default Activity;
