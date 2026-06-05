import { useCallback } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  weekendStateAtom,
  selectedActivityAtom,
  plannerTabAtom,
} from "@/recoil/atoms";
import {
  addActivityToPlan,
  moveScheduleItem,
  resizeScheduleItem,
} from "@/lib/plannerActions";
import type { DragPayload } from "@/types/drag";
import type { IActivity } from "@/types";
import { useToast } from "@/components/ui/toaster";

export function usePlannerActions() {
  const [weekend, setWeekend] = useRecoilState(weekendStateAtom);
  const [selectedActivity, setSelectedActivity] =
    useRecoilState(selectedActivityAtom);
  const setPlannerTab = useSetRecoilState(plannerTabAtom);
  const { toast } = useToast();

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
    [setWeekend, setSelectedActivity, toast]
  );

  const handleSlotTap = useCallback(
    (day: "saturday" | "sunday", time: string) => {
      if (!selectedActivity) {
        toast({
          title: "Pick an activity first",
          description: "Tap one in the Activities tab, then tap a time slot.",
        });
        setPlannerTab("library");
        return;
      }
      applyPayload(
        { type: "activity", activity: selectedActivity },
        day,
        time
      );
    },
    [selectedActivity, applyPayload, toast, setPlannerTab]
  );

  const handleSelectActivity = useCallback(
    (activity: IActivity, isTouch: boolean) => {
      setSelectedActivity((prev) =>
        prev?.id === activity.id ? null : activity
      );
      if (isTouch) setPlannerTab("schedule");
    },
    [setSelectedActivity, setPlannerTab]
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
    [setWeekend, toast]
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
          description:
            "Not enough room before 11 PM or another event is in the way.",
        });
      }
    },
    [setWeekend, toast]
  );

  const handleRemove = useCallback(
    (id: string) => {
      setWeekend((prev) => ({
        saturday: prev.saturday.filter((i) => i.id !== id),
        sunday: prev.sunday.filter((i) => i.id !== id),
      }));
    },
    [setWeekend]
  );

  const handleClear = useCallback(() => {
    setWeekend({ saturday: [], sunday: [] });
    setSelectedActivity(null);
    toast({ title: "Plan cleared", description: "Your schedule is empty." });
  }, [setWeekend, setSelectedActivity, toast]);

  const handleSave = useCallback(
    () =>
      toast({
        title: "Plan saved",
        description: "Auto-saved to this browser.",
      }),
    [toast]
  );

  return {
    weekend,
    selectedActivity,
    applyPayload,
    handleSlotTap,
    handleSelectActivity,
    handleMoveSchedule,
    handleResizeSchedule,
    handleRemove,
    handleClear,
    handleSave,
  };
}
