import { useWindowDimensions } from "react-native";

/** Minimum viewport width, in pixels, for the tablet layout. */
export const TABLET_BREAKPOINT = 768;

/** Minimum viewport width, in pixels, for the desktop layout. */
export const DESKTOP_BREAKPOINT = 1024;

/** Responsive state derived from the current viewport dimensions. */
export type ResponsiveLayout = {
  height: number;
  isDesktop: boolean;
  isLandscape: boolean;
  isMobile: boolean;
  isPortrait: boolean;
  isTablet: boolean;
  usesCollapsibleSidebar: boolean;
  usesPermanentSidebar: boolean;
  usesSidebar: boolean;
  width: number;
};

/**
 * Derives layout and sidebar behavior from viewport dimensions.
 *
 * Tablet landscape uses a permanent sidebar, while tablet portrait uses a
 * collapsible sidebar. Mobile layouts do not use a sidebar.
 *
 * @param width - Viewport width in pixels.
 * @param height - Viewport height in pixels.
 * @returns Responsive flags and the source dimensions.
 */
export function getResponsiveLayout(
  width: number,
  height: number,
): ResponsiveLayout {
  const isDesktop = width >= DESKTOP_BREAKPOINT;
  const isLandscape = width > height;
  const isMobile = width < TABLET_BREAKPOINT;
  const isTablet = width >= TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT;
  const usesPermanentSidebar = isDesktop || (isTablet && isLandscape);
  const usesCollapsibleSidebar = isTablet && !isLandscape;

  return {
    height,
    isDesktop,
    isLandscape,
    isMobile,
    isPortrait: !isLandscape,
    isTablet,
    usesCollapsibleSidebar,
    usesPermanentSidebar,
    usesSidebar: usesCollapsibleSidebar || usesPermanentSidebar,
    width,
  };
}

/** Returns responsive layout state that updates with window dimensions. */
export function useResponsiveLayout(): ResponsiveLayout {
  const { height, width } = useWindowDimensions();

  return getResponsiveLayout(width, height);
}
