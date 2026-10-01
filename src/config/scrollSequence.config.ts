/**
 * Scroll Sequence Configuration for GEEKS UNITED Cinematic Hero
 * 240 Continuous High-Definition Frames extracted directly from geeks video.mp4
 */
export interface ScrollSequenceConfig {
  FRAME_PATH: string;
  FRAME_COUNT: number;
  SCROLL_DISTANCE: number;
  FRAME_EXTENSION: string;
  PAD_LENGTH: number;
  POSTER_FRAME: string;
  FPS_TARGET: number;
}

export const SEQUENCE_CONFIG: ScrollSequenceConfig = {
  FRAME_PATH: "/frames/frame_",
  FRAME_COUNT: 240,
  SCROLL_DISTANCE: 1900, // Faster, highly responsive scroll travel (1.9x viewport)
  FRAME_EXTENSION: ".webp",
  PAD_LENGTH: 3,
  POSTER_FRAME: "/frames/frame_000.webp",
  FPS_TARGET: 60,
};

