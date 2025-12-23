/**
 * Accessibility utility functions for focus management and screen reader announcements
 */

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
  );
}

/**
 * Create a focus trap within a container element
 * Returns a cleanup function to remove the trap
 */
export function createFocusTrap(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.key !== "Tab") {
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab: if on first element, go to last
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab: if on last element, go to first
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }

  container.addEventListener("keydown", handleKeyDown);

  // Focus the first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener("keydown", handleKeyDown);
  };
}

/**
 * Create a live region announcer for screen readers
 * Returns announce function and cleanup function
 */
export function createAnnouncer(
  politeness: "polite" | "assertive" = "polite"
): {
  announce: (message: string) => void;
  cleanup: () => void;
} {
  const announcer = document.createElement("div");
  announcer.setAttribute("role", "status");
  announcer.setAttribute("aria-live", politeness);
  announcer.setAttribute("aria-atomic", "true");
  announcer.className = "sr-only";
  // Visually hidden styles inline for reliability
  announcer.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;

  document.body.appendChild(announcer);

  function announce(message: string): void {
    // Clear and set message to ensure announcement
    announcer.textContent = "";
    // Use setTimeout to ensure the screen reader picks up the change
    setTimeout(() => {
      announcer.textContent = message;
    }, 100);
  }

  function cleanup(): void {
    announcer.remove();
  }

  return { announce, cleanup };
}

/**
 * Focus the main content area (for skip link functionality)
 */
export function focusMainContent(): void {
  const main = document.getElementById("main-content");
  if (main) {
    main.setAttribute("tabindex", "-1");
    main.focus();
    // Remove tabindex after focus to maintain natural tab order
    main.addEventListener(
      "blur",
      () => {
        main.removeAttribute("tabindex");
      },
      { once: true }
    );
  }
}
