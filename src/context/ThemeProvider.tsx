import type { ReactNode } from "react";

/** Theme state lives in Recoil — see useTheme() and themeAtom. */
export { useTheme, useThemeContext } from "@/hooks/useTheme";

export const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);
