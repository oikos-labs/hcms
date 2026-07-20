/**
 * Applies a color mode directly to the document root.
 *
 * This function is serialized into an inline script by the web provider, so it
 * must remain self-contained and browser-safe.
 *
 * @param mode - A concrete color mode or `system` to follow the media query.
 */
export const script = (mode: string) => {
  const documentElement = document.documentElement;

  function getSystemColorMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  try {
    const isSystem = mode === "system";
    const theme = isSystem ? getSystemColorMode() : mode;
    documentElement.classList.remove(theme === "light" ? "dark" : "light");
    documentElement.classList.add(theme);
    documentElement.style.colorScheme = theme;
  } catch (e) {
    console.error(e);
  }
};
