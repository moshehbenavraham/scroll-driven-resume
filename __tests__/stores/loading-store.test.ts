/**
 * Unit tests for loading store.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useLoadingStore } from "@/stores/loading-store";

describe("useLoadingStore", () => {
  // Reset store before each test
  beforeEach(() => {
    useLoadingStore.getState().reset();
  });

  describe("initial state", () => {
    it("starts with isLoading true", () => {
      const state = useLoadingStore.getState();
      expect(state.isLoading).toBe(true);
    });

    it("starts with isComplete false", () => {
      const state = useLoadingStore.getState();
      expect(state.isComplete).toBe(false);
    });

    it("starts with progress 0", () => {
      const state = useLoadingStore.getState();
      expect(state.progress).toBe(0);
    });

    it("starts with error null", () => {
      const state = useLoadingStore.getState();
      expect(state.error).toBe(null);
    });
  });

  describe("setProgress", () => {
    it("updates progress value correctly", () => {
      useLoadingStore.getState().setProgress(50);
      expect(useLoadingStore.getState().progress).toBe(50);
    });

    it("clamps progress to minimum 0", () => {
      useLoadingStore.getState().setProgress(-10);
      expect(useLoadingStore.getState().progress).toBe(0);
    });

    it("clamps progress to maximum 100", () => {
      useLoadingStore.getState().setProgress(150);
      expect(useLoadingStore.getState().progress).toBe(100);
    });

    it("handles decimal values", () => {
      useLoadingStore.getState().setProgress(33.33);
      expect(useLoadingStore.getState().progress).toBe(33.33);
    });

    it("handles multiple updates", () => {
      useLoadingStore.getState().setProgress(25);
      useLoadingStore.getState().setProgress(50);
      useLoadingStore.getState().setProgress(75);
      expect(useLoadingStore.getState().progress).toBe(75);
    });
  });

  describe("setComplete", () => {
    it("sets isComplete to true", () => {
      useLoadingStore.getState().setComplete();
      expect(useLoadingStore.getState().isComplete).toBe(true);
    });

    it("sets isLoading to false", () => {
      useLoadingStore.getState().setComplete();
      expect(useLoadingStore.getState().isLoading).toBe(false);
    });

    it("sets progress to 100", () => {
      useLoadingStore.getState().setProgress(50);
      useLoadingStore.getState().setComplete();
      expect(useLoadingStore.getState().progress).toBe(100);
    });
  });

  describe("setError", () => {
    it("sets error message", () => {
      useLoadingStore.getState().setError("Network error");
      expect(useLoadingStore.getState().error).toBe("Network error");
    });

    it("sets isLoading to false", () => {
      useLoadingStore.getState().setError("Error occurred");
      expect(useLoadingStore.getState().isLoading).toBe(false);
    });

    it("does not set isComplete", () => {
      useLoadingStore.getState().setError("Error occurred");
      expect(useLoadingStore.getState().isComplete).toBe(false);
    });
  });

  describe("reset", () => {
    it("returns store to initial state", () => {
      // Modify state
      useLoadingStore.getState().setProgress(75);
      useLoadingStore.getState().setComplete();
      useLoadingStore.getState().setError("Some error");

      // Reset
      useLoadingStore.getState().reset();

      // Verify initial state
      const state = useLoadingStore.getState();
      expect(state.isLoading).toBe(true);
      expect(state.isComplete).toBe(false);
      expect(state.progress).toBe(0);
      expect(state.error).toBe(null);
    });

    it("can be called multiple times", () => {
      useLoadingStore.getState().reset();
      useLoadingStore.getState().reset();
      useLoadingStore.getState().reset();

      const state = useLoadingStore.getState();
      expect(state.isLoading).toBe(true);
      expect(state.progress).toBe(0);
    });
  });

  describe("state transitions", () => {
    it("follows loading lifecycle correctly", () => {
      const store = useLoadingStore.getState();

      // Initial state
      expect(store.isLoading).toBe(true);
      expect(store.progress).toBe(0);

      // Progress updates
      store.setProgress(25);
      expect(useLoadingStore.getState().progress).toBe(25);

      store.setProgress(50);
      expect(useLoadingStore.getState().progress).toBe(50);

      store.setProgress(100);
      expect(useLoadingStore.getState().progress).toBe(100);

      // Complete
      store.setComplete();
      expect(useLoadingStore.getState().isLoading).toBe(false);
      expect(useLoadingStore.getState().isComplete).toBe(true);
    });

    it("handles error during loading", () => {
      const store = useLoadingStore.getState();

      store.setProgress(50);
      store.setError("Network failed");

      const state = useLoadingStore.getState();
      expect(state.isLoading).toBe(false);
      expect(state.isComplete).toBe(false);
      expect(state.error).toBe("Network failed");
      expect(state.progress).toBe(50); // Progress preserved
    });
  });
});
