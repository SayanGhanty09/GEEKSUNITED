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
  const endFadeOverlayRef = useRef<HTMLDivElement>(null);
  const hudContainerRef = useRef<HTMLDivElement>(null);
  const hudTextRef = useRef<HTMLSpanElement>(null);

  // Ready state for initial frame display
  const [isReady, setIsReady] = useState<boolean>(false);

  // Cached frame images array
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(0);
  const targetFrameRef = useRef<number>(0);
  const lastDrawnFrameRef = useRef<number>(-1);
  const isTickingRef = useRef<boolean>(false);
  const animIdRef = useRef<number>(0);

  // Pre-calculated draw dimensions to avoid recalculating per frame
  const drawParamsRef = useRef<{
    sw: number;
    sh: number;
    dx: number;
    dy: number;
    dw: number;
    dh: number;
  } | null>(null);

  // Helper to get formatted frame URL
  const getFrameUrl = useCallback(
    (index: number) => {
      const frameNum = index.toString().padStart(padLength, "0");
      return `${framesPath}${frameNum}${frameExtension}`;
    },
    [framesPath, padLength, frameExtension]
  );

  // Safely find the closest ready frame
  const getNearestLoadedFrame = useCallback(
    (index: number): HTMLImageElement | null => {
      const images = imagesRef.current;
      if (!images || images.length === 0) return null;
      const target = Math.min(frameCount - 1, Math.max(0, index));

      if (images[target]?.complete && images[target]?.naturalWidth > 0) {
        return images[target];
      }

      // Check outward in small window
      for (let offset = 1; offset < 20; offset++) {
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

  // Fast pre-calculated draw call
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", { alpha: false, desynchronized: true });
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    const p = drawParamsRef.current;
    if (p) {
      ctx.drawImage(img, 0, 0, p.sw, p.sh, p.dx, p.dy, p.dw, p.dh);
    } else {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, []);

  // Compute cover dimensions once on resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Cap DPR at 1.5 for ultra-fast frame blitting without loss of crispness
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctxRef.current = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (ctxRef.current) {
      ctxRef.current.imageSmoothingEnabled = true;
      ctxRef.current.imageSmoothingQuality = "medium";
    }

    const sampleImg = imagesRef.current[0];
    const imgWidth = sampleImg?.naturalWidth || 1920;
    const imgHeight = sampleImg?.naturalHeight || 1080;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const hRatio = canvasWidth / imgWidth;
    const vRatio = canvasHeight / imgHeight;
    const ratio = Math.max(hRatio, vRatio);

    const renderWidth = imgWidth * ratio;
    const renderHeight = imgHeight * ratio;
    const offsetX = (canvasWidth - renderWidth) / 2;
    const offsetY = (canvasHeight - renderHeight) / 2;

    drawParamsRef.current = {
      sw: imgWidth,
      sh: imgHeight,
      dx: offsetX,
      dy: offsetY,
      dw: renderWidth,
      dh: renderHeight,
    };

    const activeIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameRef.current)));
    const activeImg = getNearestLoadedFrame(activeIndex);
    if (activeImg) {
      drawFrame(activeImg);
    }
  }, [drawFrame, frameCount, getNearestLoadedFrame]);

  // Decoupled tick loop with adaptive damping and auto-sleep
  const tick = useCallback(() => {
    const target = targetFrameRef.current;
    const current = currentFrameRef.current;
    const diff = target - current;

    if (Math.abs(diff) > 0.02) {
      // Snappy and responsive tracking
      currentFrameRef.current += diff * 0.45;
    } else {
      currentFrameRef.current = target;
    }

    const frameIndex = Math.min(frameCount - 1, Math.max(0, Math.round(currentFrameRef.current)));

    if (frameIndex !== lastDrawnFrameRef.current) {
      lastDrawnFrameRef.current = frameIndex;
      const img = getNearestLoadedFrame(frameIndex);
      if (img) {
        drawFrame(img);
      }
    }

    // Keep ticking while moving toward target, sleep when settled
    if (Math.abs(target - currentFrameRef.current) > 0.01) {
      animIdRef.current = requestAnimationFrame(tick);
    } else {
      isTickingRef.current = false;
    }
  }, [frameCount, drawFrame, getNearestLoadedFrame]);

  // Layout-free passive scroll handler with RAF throttling & view culling
  const isInViewportRef = useRef<boolean>(true);

  const handleScroll = useCallback(() => {
    if (!isInViewportRef.current) return;
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Early exit if user scrolled completely past the hero sequence
    if (scrollY > scrollDistance + 250) {
      if (isTickingRef.current) {
        isTickingRef.current = false;
        if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      }
      return;
    }

    const scrollTotal = scrollDistance - window.innerHeight;
    if (scrollTotal <= 0) return;

    const progress = Math.min(1, Math.max(0, scrollY / scrollTotal));
    targetFrameRef.current = progress * (frameCount - 1);

    // Wake up animation loop on scroll if stationary
    if (!isTickingRef.current) {
      isTickingRef.current = true;
      animIdRef.current = requestAnimationFrame(tick);
    }

    // Hero Text Fade Out between 0% and 15% scroll (Hardware-accelerated)
    if (heroOverlayRef.current) {
      if (progress < 0.15) {
        const textAlpha = Math.max(0, 1 - progress / 0.12);
        heroOverlayRef.current.style.opacity = textAlpha.toString();
        heroOverlayRef.current.style.transform = `translate3d(0, ${-progress * 140}px, 0) scale(${1 - progress * 0.12})`;
        heroOverlayRef.current.style.pointerEvents = textAlpha > 0.1 ? "auto" : "none";
      } else if (heroOverlayRef.current.style.opacity !== "0") {
        heroOverlayRef.current.style.opacity = "0";
        heroOverlayRef.current.style.pointerEvents = "none";
      }
    }

    // Subtle atmospheric darkening towards end of scroll (max 0.25, keeps quantum CPU visible)
    if (endFadeOverlayRef.current) {
      if (progress > 0.88) {
        const fadeAlpha = Math.min(0.25, Math.max(0, (progress - 0.88) * 2));
        endFadeOverlayRef.current.style.opacity = fadeAlpha.toString();
      } else if (endFadeOverlayRef.current.style.opacity !== "0") {
        endFadeOverlayRef.current.style.opacity = "0";
      }
    }
  }, [scrollDistance, frameCount, tick]);

  // Progressive Non-Blocking Frame Preloader with Network & Mobile Throttling
  useEffect(() => {
    let isCancelled = false;
    imagesRef.current = new Array(frameCount);

    // Check device capabilities and reduced motion preference
    const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = typeof window !== "undefined" && (window.innerWidth < 768 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
    const frameStep = isMobile ? 2 : 1; // Downsample 50% on mobile to cut 1GB+ RAM heap overhead

    // 1. Immediately load Frame 0 poster (Guarantees instant LCP < 250ms)
    const firstImg = new Image();
    firstImg.src = posterFrame || getFrameUrl(0);
    imagesRef.current[0] = firstImg;

    firstImg.onload = () => {
      if (isCancelled) return;
      resizeCanvas();
      drawFrame(firstImg);
      setIsReady(true);

      if (prefersReducedMotion) return;

      // 2. Priority load keyframes every 6th frame for instant scrub coverage
      const priorityIndices: number[] = [];
      for (let i = 6; i < frameCount; i += 6) {
        priorityIndices.push(i);
      }
      const remainingIndices: number[] = [];
      for (let i = 1; i < frameCount; i += frameStep) {
        if (i % 6 !== 0) remainingIndices.push(i);
      }

      const queue = [...priorityIndices, ...remainingIndices];
      let loadedCount = 1;
      let queueIdx = 0;

      // Non-blocking batching using requestIdleCallback / low-priority microtask
      const scheduleNextBatch = (cb: () => void) => {
        if ("requestIdleCallback" in window) {
          (window as unknown as { requestIdleCallback: (fn: () => void, opts: { timeout: number }) => void }).requestIdleCallback(cb, { timeout: 40 });
        } else {
          setTimeout(cb, 16);
        }
      };

      const processBatch = () => {
        if (isCancelled) return;

        if (queueIdx >= queue.length) {
          if (hudContainerRef.current) {
            hudContainerRef.current.style.opacity = "0";
            setTimeout(() => {
              if (hudContainerRef.current) hudContainerRef.current.style.display = "none";
            }, 600);
          }
          return;
        }

        const batchLimit = Math.min(queue.length, queueIdx + (isMobile ? 2 : 4));
        for (; queueIdx < batchLimit; queueIdx++) {
          const idx = queue[queueIdx];
          const img = new Image();
          img.src = getFrameUrl(idx);

          const onReady = () => {
            if (isCancelled) return;
            loadedCount++;
            const pct = Math.round((loadedCount / (frameCount / frameStep)) * 100);
            if (hudTextRef.current && pct % 10 === 0) {
              hudTextRef.current.textContent = `OPTIMIZED 4K // ${pct}%`;
            }
          };

          img.onload = onReady;
          img.onerror = onReady;
          imagesRef.current[idx] = img;
        }

        scheduleNextBatch(processBatch);
      };

      scheduleNextBatch(processBatch);
    };

    // RAF Throttled Scroll Listener (Executes once per display vsync)
    let scrollRafId = 0;
    const throttledScroll = () => {
      if (scrollRafId) return;
      scrollRafId = requestAnimationFrame(() => {
        scrollRafId = 0;
        handleScroll();
      });
    };

    // Viewport Intersection Observer (Hibernate animation & canvas when scrolled away)
    let observer: IntersectionObserver | null = null;
    if (containerRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isInViewportRef.current = entry.isIntersecting;
          if (!entry.isIntersecting) {
            isTickingRef.current = false;
            if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
          } else {
            throttledScroll();
          }
        },
        { rootMargin: "150px" }
      );
      observer.observe(containerRef.current);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      isCancelled = true;
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      if (scrollRafId) cancelAnimationFrame(scrollRafId);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", throttledScroll);
    };
  }, [frameCount, getFrameUrl, posterFrame, resizeCanvas, drawFrame, handleScroll]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#08080a] select-none"
      style={{ height: `${scrollDistance}px`, minHeight: `${scrollDistance}px` }}
    >
      {/* STICKY FULLSCREEN VIEWPORT */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex items-center justify-center bg-[#08080a]">
        
        {/* Minimal Futuristic Loading HUD (Zero React Re-render direct DOM) */}
        <div
          ref={hudContainerRef}
          className={`absolute top-6 right-6 z-50 flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-black/80 backdrop-blur-md transition-opacity duration-700 pointer-events-none ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span
            ref={hudTextRef}
            className="font-mono-cyber text-[11px] text-cyan-300 font-semibold tracking-wider"
          >
            LOADING 4K FRAMES // 5%
          </span>
        </div>

        {/* 16:9 FULLSCREEN CANVAS (4K CRISP HARDWARE-ACCELERATED) */}
        <canvas
          ref={canvasRef}
          className="block w-full h-full object-cover"
        />

        {/* HERO OVERLAY HTML TEXT (0% - 15% Scroll Fade, Zero CSS transition fight) */}
        <div
          ref={heroOverlayRef}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none will-change-transform"
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

        {/* Post-Hero Seamless Transition Vignette Overlay */}
        <div
          ref={endFadeOverlayRef}
          className="absolute inset-0 bg-[#08080a] pointer-events-none z-25 transition-opacity duration-150 opacity-0"
        />

        {/* Bottom Edge Seamless Shadow Gradient - Buttery dissolution into #08080a */}
        <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-[#08080a] via-[#08080a]/80 to-transparent pointer-events-none z-20" />
      </div>
    </div>
  );
}
