import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { IActivity } from "@/types";
import type { WeekendState } from "@/lib/plannerActions";
import type { PlannerTab } from "@/components/ActivityPage/PlannerTabs";
import { loadWeekendFromStorage } from "./storage";

export type Theme = "light" | "dark";

const weekendStorage = {
  getItem: (_key: string, initialValue: WeekendState): WeekendState => {
    if (typeof localStorage === "undefined") return initialValue;
    return loadWeekendFromStorage();
  },
  setItem: (_key: string, value: WeekendState): void => {
    localStorage.setItem("saturday", JSON.stringify(value.saturday));
    localStorage.setItem("sunday", JSON.stringify(value.sunday));
  },
  removeItem: (): void => {
    localStorage.removeItem("saturday");
    localStorage.removeItem("sunday");
  },
};

export const themeAtom = atomWithStorage<Theme>("theme", "dark");

export const weekendStateAtom = atomWithStorage<WeekendState>(
  "weekendState",
  { saturday: [], sunday: [] },
  weekendStorage
);

export const selectedActivityAtom = atom<IActivity | null>(null);

export const plannerTabAtom = atom<PlannerTab>("library");

export const dragLabelAtom = atom<string | null>(null);

export const scheduleCountAtom = atom((get) => {
  const { saturday, sunday } = get(weekendStateAtom);
  return saturday.length + sunday.length;
});
