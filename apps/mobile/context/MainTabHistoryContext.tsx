import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type PropsWithChildren,
} from "react";

export type MainTabRoute = "index" | "mokwon" | "nanum" | "menu";
export type DiaryTabRoute = "index" | "review" | "prayer" | "mission";

type MainTabHistoryContextValue = {
  getLastDiaryTab: () => DiaryTabRoute;
  getPreviousMainTab: () => MainTabRoute;
  rememberDiaryTab: (route: DiaryTabRoute) => void;
  rememberMainTab: (route: MainTabRoute) => void;
};

const MainTabHistoryContext = createContext<
  MainTabHistoryContextValue | undefined
>(undefined);

export function MainTabHistoryProvider({ children }: PropsWithChildren) {
  const lastDiaryTabRef = useRef<DiaryTabRoute>("index");
  const previousMainTabRef = useRef<MainTabRoute>("index");

  const rememberDiaryTab = useCallback((route: DiaryTabRoute) => {
    lastDiaryTabRef.current = route;
  }, []);

  const rememberMainTab = useCallback((route: MainTabRoute) => {
    previousMainTabRef.current = route;
  }, []);

  const getLastDiaryTab = useCallback(() => lastDiaryTabRef.current, []);
  const getPreviousMainTab = useCallback(() => previousMainTabRef.current, []);

  const value = useMemo(
    () => ({
      getLastDiaryTab,
      getPreviousMainTab,
      rememberDiaryTab,
      rememberMainTab,
    }),
    [getLastDiaryTab, getPreviousMainTab, rememberDiaryTab, rememberMainTab],
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
