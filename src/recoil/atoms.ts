import { atom } from "recoil";
import type { IActivity } from "@/types";
import type { WeekendState } from "@/lib/plannerActions";
import type { PlannerTab } from "@/components/ActivityPage/PlannerTabs";
import { loadWeekendFromStorage } from "./storage";

export type Theme = "light" | "dark";

const savedTheme =
  typeof localStorage !== "undefined"
    ? (localStorage.getItem("theme") as Theme | null)
    : null;

export const themeAtom = atom<Theme>({
  key: "themeAtom",
  default: savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark",
});

export const weekendStateAtom = atom<WeekendState>({
  key: "weekendStateAtom",
  default: { saturday: [], sunday: [] },
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof localStorage === "undefined") return;
      setSelf(loadWeekendFromStorage());
      onSet((newValue) => {
        localStorage.setItem("saturday", JSON.stringify(newValue.saturday));
        localStorage.setItem("sunday", JSON.stringify(newValue.sunday));
      });
    },
  ],
});

export const selectedActivityAtom = atom<IActivity | null>({
  key: "selectedActivityAtom",
  default: null,
});

export const plannerTabAtom = atom<PlannerTab>({
  key: "plannerTabAtom",
  default: "library",
});

export const dragLabelAtom = atom<string | null>({
  key: "dragLabelAtom",
  default: null,
});
