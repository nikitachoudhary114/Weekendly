import { useCallback } from "react";
import Header from "@/components/ActivityPage/Header";
import ActivityLibrary from "@/components/ActivityPage/ActivityLibrary";
import { activities } from "@/data/activities";
import WeekendSchedule from "@/components/ActivityPage/WeekendSchedule";
import WeekendSummary from "@/components/ActivityPage/WeekendSummary";
import PlanActions from "@/components/ActivityPage/PlanActions";
import LiveInsights from "@/components/ActivityPage/LiveInsights";
import PlannerHowTo from "@/components/ActivityPage/PlannerHowTo";
import PlannerTabs from "@/components/ActivityPage/PlannerTabs";
import { useTheme } from "@/hooks/useTheme";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";
import { usePlannerActions } from "@/hooks/usePlannerActions";
import * as htmlToImage from "html-to-image";
import { motion } from "framer-motion";
import { useAtom, useAtomValue } from "jotai";
import { dragLabelAtom, plannerTabAtom, scheduleCountAtom } from "@/store/atoms";
import { useToast } from "@/components/ui/toaster";
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
import type { DragPayload } from "@/types/drag";
import { parseSlotId } from "@/lib/parseSlotId";

function Activity() {
  const { isDark } = useTheme();
  const isTouch = useIsTouchDevice();
  const { toast } = useToast();

  const [mobileTab, setMobileTab] = useAtom(plannerTabAtom);
  const [dragLabel, setDragLabel] = useAtom(dragLabelAtom);
  const scheduleCount = useAtomValue(scheduleCountAtom);

  const {
    selectedActivity,
    applyPayload,
    handleSlotTap,
    handleSelectActivity,
    handleMoveSchedule,
    handleResizeSchedule,
    handleRemove,
    handleClear,
    handleSave,
  } = usePlannerActions();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    })
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

  const exportPoster = useCallback(() => {
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
  }, [isDark, toast]);

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
                isTouch={isTouch}
                onSelectActivity={(a) => handleSelectActivity(a, isTouch)}
              />
            </div>
            <div className={`${panelClass} hidden lg:block`}>
              <WeekendSummary />
            </div>
          </div>

          <div
            className={`flex-1 flex flex-col gap-4 lg:gap-6 ${
              showSchedule ? "block" : "hidden lg:flex"
            }`}
          >
            <div id="schedule-export-all" className={panelClass}>
              <WeekendSchedule
                isTouch={isTouch}
                onSlotTap={handleSlotTap}
                onRemoveActivity={handleRemove}
                onMoveSchedule={handleMoveSchedule}
                onResizeSchedule={handleResizeSchedule}
              />
            </div>
            <PlanActions
              onClear={handleClear}
              onSave={handleSave}
              onExport={exportPoster}
            />
          </div>

          <div
            className={`lg:hidden ${showSummary ? "block" : "hidden"} ${panelClass}`}
          >
            <WeekendSummary />
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
