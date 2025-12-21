/**
 * Loading store for managing loading screen state.
 * Tracks preload progress and controls loading overlay visibility.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Loading state interface.
 */
export interface LoadingState {
  // State
  isLoading: boolean;
  isComplete: boolean;
  progress: number;
  error: string | null;

  // Actions
  setProgress: (progress: number) => void;
  setComplete: () => void;
  setError: (error: string) => void;
  reset: () => void;
}

/**
 * Initial loading state.
 * isLoading starts true to prevent FOUC on initial render.
 */
const initialState = {
  isLoading: true,
  isComplete: false,
  progress: 0,
  error: null,
};

/**
 * Loading store for global loading state management.
 * Used by LoadingProvider and LoadingScreen components.
 */
export const useLoadingStore = create<LoadingState>()(
  devtools(
    (set) => ({
      ...initialState,

      /**
       * Updates the loading progress (0-100).
       * Clamps value to valid range.
       */
      setProgress: (progress: number) =>
        set(
          { progress: Math.min(100, Math.max(0, progress)) },
          false,
          "setProgress"
        ),

      /**
       * Marks loading as complete.
       * Sets isComplete to true and isLoading to false.
       */
      setComplete: () =>
        set(
          { isComplete: true, isLoading: false, progress: 100 },
          false,
          "setComplete"
        ),

      /**
       * Sets an error message.
       * Marks loading as not loading but not complete.
       */
      setError: (error: string) =>
        set({ error, isLoading: false }, false, "setError"),

      /**
       * Resets the store to initial state.
       */
      reset: () => set(initialState, false, "reset"),
    }),
    { name: "loading-store" }
  )
);

export default useLoadingStore;
