import { create } from "zustand";
import type { FrameSequenceId, ScrollDirection } from "@/types/animation";

/**
 * State for a single frame sequence.
 */
interface SequenceState {
  /** Current frame index (0-based) */
  currentFrame: number;
  /** Total frames in the sequence */
  totalFrames: number;
  /** Whether the sequence is actively animating */
  isActive: boolean;
  /** Preload progress (0-100) */
  loadProgress: number;
  /** Whether preloading is complete */
  isLoaded: boolean;
  /** Current scroll direction */
  direction: ScrollDirection;
}

/**
 * Default state for a sequence.
 */
const createSequenceState = (totalFrames: number): SequenceState => ({
  currentFrame: 0,
  totalFrames,
  isActive: false,
  loadProgress: 0,
  isLoaded: false,
  direction: null,
});

interface AnimationState {
  // Loading state
  isLoading: boolean;
  loadProgress: number;
  loadMessage: string;

  // Animation preferences
  prefersReducedMotion: boolean;
  animationsEnabled: boolean;

  // Legacy frame animation state (deprecated, use sequences)
  currentFrame: number;
  totalFrames: number;
  isPlaying: boolean;

  // Sequence-specific state (T009)
  sequences: Record<FrameSequenceId, SequenceState>;

  // Actions
  setLoading: (isLoading: boolean) => void;
  setLoadProgress: (progress: number, message?: string) => void;
  setPrefersReducedMotion: (prefers: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setCurrentFrame: (frame: number) => void;
  setTotalFrames: (total: number) => void;
  setIsPlaying: (playing: boolean) => void;
  reset: () => void;

  // Sequence actions (T009)
  setSequenceFrame: (id: FrameSequenceId, frame: number) => void;
  setSequenceActive: (id: FrameSequenceId, active: boolean) => void;
  setSequenceLoadProgress: (id: FrameSequenceId, progress: number) => void;
  setSequenceLoaded: (id: FrameSequenceId, loaded: boolean) => void;
  setSequenceDirection: (id: FrameSequenceId, direction: ScrollDirection) => void;
  getSequence: (id: FrameSequenceId) => SequenceState;
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
  sequences: {
    hero: createSequenceState(192),
    product: createSequenceState(144),
  } as Record<FrameSequenceId, SequenceState>,
};

export const useAnimationStore = create<AnimationState>((set, get) => ({
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

  // Sequence actions (T009)
  setSequenceFrame: (id, frame) =>
    set((state) => ({
      sequences: {
        ...state.sequences,
        [id]: {
          ...state.sequences[id],
          currentFrame: frame,
        },
      },
    })),

  setSequenceActive: (id, active) =>
    set((state) => ({
      sequences: {
        ...state.sequences,
        [id]: {
          ...state.sequences[id],
          isActive: active,
        },
      },
    })),

  setSequenceLoadProgress: (id, progress) =>
    set((state) => ({
      sequences: {
        ...state.sequences,
        [id]: {
          ...state.sequences[id],
          loadProgress: Math.min(100, Math.max(0, progress)),
        },
      },
    })),

  setSequenceLoaded: (id, loaded) =>
    set((state) => ({
      sequences: {
        ...state.sequences,
        [id]: {
          ...state.sequences[id],
          isLoaded: loaded,
          loadProgress: loaded ? 100 : state.sequences[id].loadProgress,
        },
      },
    })),

  setSequenceDirection: (id, direction) =>
    set((state) => ({
      sequences: {
        ...state.sequences,
        [id]: {
          ...state.sequences[id],
          direction,
        },
      },
    })),

  getSequence: (id) => get().sequences[id],
}));

export type { AnimationState, SequenceState };
