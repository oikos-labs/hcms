import { act, renderHook } from "@testing-library/react-native";

import {
  MainTabHistoryProvider,
  useMainTabHistory,
} from "../context/MainTabHistoryContext";

describe("MainTabHistoryProvider", () => {
  it("returns home before another main tab has been visited", async () => {
    const { result } = await renderHook(() => useMainTabHistory(), {
      wrapper: MainTabHistoryProvider,
    });

    expect(result.current.getPreviousMainTab()).toBe("index");
  });

  it("remembers the last non-diary main tab", async () => {
    const { result } = await renderHook(() => useMainTabHistory(), {
      wrapper: MainTabHistoryProvider,
    });

    await act(() => result.current.rememberMainTab("nanum"));

    expect(result.current.getPreviousMainTab()).toBe("nanum");
  });

  it("returns the diary index before another diary tab has been visited", async () => {
    const { result } = await renderHook(() => useMainTabHistory(), {
      wrapper: MainTabHistoryProvider,
    });

    expect(result.current.getLastDiaryTab()).toBe("index");
  });

  it("remembers the last focused diary tab", async () => {
    const { result } = await renderHook(() => useMainTabHistory(), {
      wrapper: MainTabHistoryProvider,
    });

    await act(() => result.current.rememberDiaryTab("prayer"));

    expect(result.current.getLastDiaryTab()).toBe("prayer");
  });
});
