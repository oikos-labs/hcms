import { useWindowDimensions } from "react-native";

export const TABLET_BREAKPOINT = 768;
export const DESKTOP_BREAKPOINT = 1024;

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

export function useResponsiveLayout(): ResponsiveLayout {
  const { height, width } = useWindowDimensions();

  return getResponsiveLayout(width, height);
}
