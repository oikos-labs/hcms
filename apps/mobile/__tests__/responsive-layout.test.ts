import {
  DESKTOP_BREAKPOINT,
  getResponsiveLayout,
  TABLET_BREAKPOINT,
} from "../hooks/useResponsiveLayout";

describe("getResponsiveLayout", () => {
  it("classifies widths below 768 as mobile", () => {
    expect(getResponsiveLayout(TABLET_BREAKPOINT - 1, 900)).toMatchObject({
      isDesktop: false,
      isMobile: true,
      isTablet: false,
      usesSidebar: false,
    });
  });

  it("uses a collapsible drawer for tablet portrait", () => {
    expect(getResponsiveLayout(TABLET_BREAKPOINT, 1024)).toMatchObject({
      isDesktop: false,
      isLandscape: false,
      isMobile: false,
      isTablet: true,
      usesCollapsibleSidebar: true,
      usesPermanentSidebar: false,
    });
  });

  it("uses a permanent sidebar for tablet landscape", () => {
    expect(getResponsiveLayout(DESKTOP_BREAKPOINT - 1, 768)).toMatchObject({
      isDesktop: false,
      isLandscape: true,
      isMobile: false,
      isTablet: true,
      usesCollapsibleSidebar: false,
      usesPermanentSidebar: true,
    });
  });

  it("uses a permanent sidebar for desktop", () => {
    expect(getResponsiveLayout(DESKTOP_BREAKPOINT, 1366)).toMatchObject({
      isDesktop: true,
      isMobile: false,
      isTablet: false,
      usesPermanentSidebar: true,
    });
  });
});
