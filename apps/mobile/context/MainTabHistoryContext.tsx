import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

export type MainTabRoute = "index" | "mokwon" | "nanum" | "menu";

type MainTabHistoryContextValue = {
  getPreviousMainTab: () => MainTabRoute;
  rememberMainTab: (route: MainTabRoute) => void;
};

const MainTabHistoryContext = createContext<
  MainTabHistoryContextValue | undefined
>(undefined);

export function MainTabHistoryProvider({ children }: PropsWithChildren) {
  const previousMainTabRef = useRef<MainTabRoute>("index");

  const rememberMainTab = useCallback((route: MainTabRoute) => {
    previousMainTabRef.current = route;
  }, []);

  const getPreviousMainTab = useCallback(() => previousMainTabRef.current, []);

  const value = useMemo(
    () => ({ getPreviousMainTab, rememberMainTab }),
    [getPreviousMainTab, rememberMainTab],
  );

  return (
    <MainTabHistoryContext.Provider value={value}>
      {children}
    </MainTabHistoryContext.Provider>
  );
}

export function useMainTabHistory() {
  const context = useContext(MainTabHistoryContext);

  if (!context) {
    throw new Error(
      "useMainTabHistory must be used within a MainTabHistoryProvider.",
    );
  }

  return context;
}
