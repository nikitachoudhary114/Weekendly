import { selector } from "recoil";
import { weekendStateAtom } from "./atoms";

export const scheduleCountSelector = selector<number>({
  key: "scheduleCountSelector",
  get: ({ get }) => {
    const { saturday, sunday } = get(weekendStateAtom);
    return saturday.length + sunday.length;
  },
});
