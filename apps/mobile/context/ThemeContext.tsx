import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useColorScheme } from "react-native";
import { Uniwind } from "uniwind";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = Exclude<ThemeMode, "system">;

const THEME_STORAGE_KEY = "@hcms/theme-mode";
const DEFAULT_THEME: ThemeMode = "light";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  isHydrated: boolean;
  setTheme: (theme: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>(DEFAULT_THEME);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function hydrateTheme() {
      let storedTheme: string | null = null;

      try {
        storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      } catch (error) {
        console.warn("Unable to read the saved theme preference.", error);
      }

      if (!isMounted) return;

      const nextTheme = isThemeMode(storedTheme) ? storedTheme : DEFAULT_THEME;

      Uniwind.setTheme(nextTheme);
      setThemeState(nextTheme);
      setIsHydrated(true);
    }

    void hydrateTheme();

    return () => {
      isMounted = false;
    };
  }, []);

  const setTheme = useCallback(async (nextTheme: ThemeMode) => {
    Uniwind.setTheme(nextTheme);
    setThemeState(nextTheme);

    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch (error) {
      console.warn("Unable to save the theme preference.", error);
    }
  }, []);

  const resolvedTheme: ResolvedTheme =
    theme === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : theme;

  const value = useMemo(
    () => ({ theme, resolvedTheme, isHydrated, setTheme }),
    [isHydrated, resolvedTheme, setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider.");
  }

  return context;
}
