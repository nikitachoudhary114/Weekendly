import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { themeAtom } from "@/recoil/atoms";

export function useTheme() {
  const [theme, setTheme] = useRecoilState(themeAtom);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggleTheme, isDark: theme === "dark" };
}

/** @deprecated Use useTheme() — kept for gradual migration */
export const useThemeContext = useTheme;
