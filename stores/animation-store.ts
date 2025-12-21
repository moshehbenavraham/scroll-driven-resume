import { create } from "zustand";

interface AnimationState {
  // Loading state
  isLoading: boolean;
  loadProgress: number;
  loadMessage: string;

  // Animation preferences
  prefersReducedMotion: boolean;
  animationsEnabled: boolean;

  // Frame animation state (for future use)
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;

  // Actions
  setLoading: (isLoading: boolean) => void;
  setLoadProgress: (progress: number, message?: string) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setCurrentFrame: (frame: number) => void;
  setTotalFrames: (total: number) => void;
  setIsPlaying: (playing: boolean) => void;
  reset: () => void;
}

const initialState = {
  isLoading: true,
  loadProgress: 0,
  loadMessage: "",
  prefersReducedMotion: false,
  animationsEnabled: true,
  currentFrame: 0,
  totalFrames: 0,
  isPlaying: false,
};

export const useAnimationStore = create<AnimationState>((set) => ({
  ...initialState,

  setLoading: (isLoading) => set({ isLoading }),

  setLoadProgress: (progress, message) =>
    set({
      loadProgress: Math.min(100, Math.max(0, progress)),
      ...(message !== undefined && { loadMessage: message }),
    }),

  setPrefersReducedMotion: (prefers) =>
    set({
      prefersReducedMotion: prefers,
      animationsEnabled: !prefers,
    }),

  setAnimationsEnabled: (enabled) => set({ animationsEnabled: enabled }),

  setCurrentFrame: (frame) => set({ currentFrame: frame }),

  setTotalFrames: (total) => set({ totalFrames: total }),

  setIsPlaying: (playing) => set({ isPlaying: playing }),

  reset: () => set(initialState),
}));

export type { AnimationState };
