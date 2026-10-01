"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { SEQUENCE_CONFIG } from "@/config/scrollSequence.config";
import { ChevronDown } from "lucide-react";

export interface ScrollSequenceProps {
  framesPath?: string;
  frameCount?: number;
  scrollDistance?: number;
  posterFrame?: string;
  frameExtension?: string;
  padLength?: number;
}

export default function ScrollSequence({
  framesPath = SEQUENCE_CONFIG.FRAME_PATH,
  frameCount = SEQUENCE_CONFIG.FRAME_COUNT,
  scrollDistance = SEQUENCE_CONFIG.SCROLL_DISTANCE,
  posterFrame = SEQUENCE_CONFIG.POSTER_FRAME,
  frameExtension = SEQUENCE_CONFIG.FRAME_EXTENSION,
  padLength = SEQUENCE_CONFIG.PAD_LENGTH,
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);

  // Loading state
  const [loadPercent, setLoadPercent] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Cached frame images array (all 240 frames from gemini video)
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);

  // Helper to get formatted frame URL (0-indexed: frame_000 to frame_239)
  const getFrameUrl = useCallback(
    (index: number) => {
      const frameNum = index.toString().padStart(padLength, "0");
      return `${framesPath}${frameNum}${frameExtension}`;
    },
    [framesPath, padLength, frameExtension]
  );

  // Safely find the closest ready frame to prevent any blank frames during fast scrubbing
  const getNearestLoadedFrame = useCallback(
    (index: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      if (!images || images.length === 0) return null;
      const target = Math.min(frameCount - 1, Math.max(0, index));

      if (images[target]?.complete && images[target]?.naturalWidth > 0) {
        return images[target];
      }

      // Look backward then forward for closest loaded frame
      for (let offset = 1; offset < frameCount; offset++) {
        const prev = target - offset;
        if (prev >= 0 && images[prev]?.complete && images[prev]?.naturalWidth > 0) {
          return images[prev];
        }
        const next = target + offset;
        if (next < frameCount && images[next]?.complete && images[next]?.naturalWidth > 0) {
          return images[next];
        }
      }
      return images[0] || null;
    },
    [frameCount]
  );

  // Draw a specific frame directly to canvas maintaining cover aspect ratio
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", { alpha: false });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth || img.width;
    const imgHeight = img.naturalHeight || img.height;

    if (!imgWidth || !imgHeight) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Aspect ratio cover math (no distortion, subject centered)
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    ctx.drawImage(img, 0, 0, imgWidth, imgHeight, offsetX, offsetY, renderWidth, renderHeight);
  }, []);

  // Resize canvas for device pixel ratio
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Reset cached context on resize
    ctxRef.current = canvas.getContext("2d", { alpha: false });

    const activeIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameRef.current)));
    const activeImg = getNearestLoadedFrame(activeIndex);
    if (activeImg) {
      drawFrame(activeImg);
    }
  }, [drawFrame, frameCount, getNearestLoadedFrame]);

  // 1. Decoupled 60fps/120fps Smooth Animation Loop
  useEffect(() => {
    let animId: number;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      // Snappy and buttery smooth damping: tracks user scroll instantly with zero lag
      if (Math.abs(diff) > 0.0005) {
        currentFrameRef.current += diff * 0.38;
        const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameRef.current)));

        if (frameIndex !== lastDrawnFrameRef.current) {
          lastDrawnFrameRef.current = frameIndex;
          const img = getNearestLoadedFrame(frameIndex);
          if (img) {
            drawFrame(img);
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [frameCount, drawFrame, getNearestLoadedFrame]);

  // 2. High-Performance Passive Scroll Listener
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollTotal = container.offsetHeight - window.innerHeight;
    if (scrollTotal <= 0) return;

    const currentScroll = -rect.top;
    const progress = Math.min(1, Math.max(0, currentScroll / scrollTotal));

    // Target frame updated in ref (zero React state re-render lag)
    targetFrameRef.current = progress * (frameCount - 1);

    // Hero Text Fade Out between 0% and 15% scroll
    if (heroOverlayRef.current) {
      if (progress < 0.15) {
        const textAlpha = 1 - progress / 0.12;
        heroOverlayRef.current.style.opacity = Math.max(0, textAlpha).toString();
        heroOverlayRef.current.style.transform = `translateY(${-progress * 140}px) scale(${1 - progress * 0.15})`;
        heroOverlayRef.current.style.pointerEvents = textAlpha > 0.1 ? "auto" : "none";
      } else {
        heroOverlayRef.current.style.opacity = "0";
        heroOverlayRef.current.style.pointerEvents = "none";
      }
    }
  }, [frameCount]);

  // 3. Preload all 240 4K frames with GPU decode
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(frameCount);

    // Load Frame 0 immediately
    const firstImg = new Image();
    firstImg.src = posterFrame || getFrameUrl(0);
    imagesRef.current[0] = firstImg;

    firstImg.onload = () => {
      if (isCancelled) return;
      resizeCanvas();
      drawFrame(firstImg);
      setIsReady(true);
      setLoadPercent(5);

      // Pre-decode remaining frames progressively
      let loadedCount = 1;
      const loadNextFrame = (index: number) => {
        if (index >= frameCount || isCancelled) return;
        const img = new Image();
        img.src = getFrameUrl(index);

        const onImageReady = () => {
          if (isCancelled) return;
          loadedCount++;
          const pct = Math.round((loadedCount / frameCount) * 100);
          setLoadPercent(pct);
        };

        if (typeof img.decode === "function") {
          img.decode().then(onImageReady).catch(onImageReady);
        } else {
          img.onload = onImageReady;
          img.onerror = onImageReady;
        }

        imagesRef.current[index] = img;
      };

      // Load initial batch of 30 frames immediately for instant responsiveness
      for (let i = 1; i < Math.min(30, frameCount); i++) {
        loadNextFrame(i);
      }

      // Load the rest smoothly in micro-batches
      let currentIdx = 30;
      const batchSize = 15;
      const batchInterval = setInterval(() => {
        if (isCancelled || currentIdx >= frameCount) {
          clearInterval(batchInterval);
          return;
        }
        for (let b = 0; b < batchSize && currentIdx < frameCount; b++) {
          loadNextFrame(currentIdx++);
        }
      }, 50);
    };

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [frameCount, getFrameUrl, posterFrame, resizeCanvas, drawFrame, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black select-none"
      style={{ height: `${scrollDistance}px`, minHeight: `${scrollDistance}px` }}
    >
      {/* STICKY FULLSCREEN VIEWPORT */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-black">
        
        {/* Minimal Futuristic Loading HUD */}
        {(!isReady || loadPercent < 100) && (
          <div
            className={`absolute top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-black/80 backdrop-blur-md transition-opacity duration-700 pointer-events-none ${
              loadPercent === 100 ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono-cyber text-[11px] text-cyan-300 font-semibold tracking-wider">
              LOADING 4K FRAMES // {loadPercent}%
            </span>
          </div>
        )}

        {/* 16:9 FULLSCREEN CANVAS (4K CRISP RENDERING) */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />

        {/* HERO OVERLAY HTML TEXT (0% - 15% Scroll Fade) */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none transition-all duration-75"
        >
          {/* Official GEEKS UNITED Logo Badge with Cyan Glow */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-black/80 border border-cyan-400/60 p-3.5 mb-6 shadow-[0_0_35px_rgba(0,240,255,0.4)] backdrop-blur-xl">
            <img
              src="/geeks_united_logo_cyan.png"
              alt="Geeks United Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_#00f0ff]"
            />
          </div>

          {/* Brand Title */}
          <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wider text-white mb-4 drop-shadow-[0_0_30px_rgba(0,240,255,0.45)]">
            GEEKS <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">UNITED</span>
          </h1>

          {/* Club Tagline */}
          <div className="flex items-center gap-3 sm:gap-6 font-space font-semibold tracking-[0.25em] text-xs sm:text-sm md:text-base text-cyan-300 uppercase mb-8">
            <span>BUILD</span>
            <span className="text-cyan-500/60">•</span>
            <span>CREATE</span>
            <span className="text-cyan-500/60">•</span>
            <span>INNOVATE</span>
          </div>

          {/* Cinematic Scroll Indicator */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/30 bg-black/60 text-cyan-400 text-xs font-mono-cyber tracking-widest shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-bounce">
            <span>SCROLL TO ENTER</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Bottom Edge Seamless Shadow Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}
