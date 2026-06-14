import { useAtom } from "jotai";
import { useEffect } from "react";
import { themeAtom } from "@/store/atoms";

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, isDark: theme === "dark" };
}

/** @deprecated Use useTheme() */
export const useThemeContext = useTheme;
