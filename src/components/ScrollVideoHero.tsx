"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Download, 
  Sliders, 
  Maximize2, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Radio,
  ChevronDown
} from "lucide-react";
import { cyberAudio } from "./AudioEngine";

interface ScrollVideoHeroProps {
  totalFrames?: number;
  onOpenVideoModal?: () => void;
}

export default function ScrollVideoHero({
  totalFrames = 180,
  onOpenVideoModal,
}: ScrollVideoHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Images cache
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Animation state
  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  // Playback mode: 'scroll' or 'autoplay'
  const [playbackMode, setPlaybackMode] = useState<"scroll" | "autoplay">("scroll");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(true);
  const [currentProgress, setCurrentProgress] = useState<number>(0);

  // Scroll speed tracking
  const lastScrollYRef = useRef<number>(0);
  const lastScrollTimeRef = useRef<number>(0);

  // Preload all 180 frames
  useEffect(() => {
    let mounted = true;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const paddedIndex = String(i).padStart(3, "0");
      img.src = `/sequence/frame_${paddedIndex}.webp`;

      img.onload = () => {
        if (!mounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (i === 0) {
          renderFrame(0);
        }
        if (loaded >= 5 || loaded === totalFrames) {
          setIsReady(true);
        }
      };

      img.onerror = () => {
        if (!mounted) return;
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= 5 || loaded === totalFrames) {
          setIsReady(true);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;

    return () => {
      mounted = false;
    };
  }, [totalFrames]);

  // Canvas drawing function with Retina DPI and Aspect Fill / Fit
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIndex = Math.min(Math.max(0, Math.round(frameIndex)), totalFrames - 1);
    const img = imagesRef.current[clampedIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);

    // Compute aspect cover
    const cw = rect.width;
    const ch = rect.height;
    const iw = img.naturalWidth || 1024;
    const ih = img.naturalHeight || 576;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
    ctx.restore();
  }, [totalFrames]);

  // Main Animation / Render Loop (LERP physics for ultra-smooth 60fps motion)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (playbackMode === "autoplay" && isPlaying) {
        // Increment target frame automatically
        const frameStep = 30 * playbackSpeed * delta;
        targetFrameRef.current = (targetFrameRef.current + frameStep) % totalFrames;
      }

      // Smooth LERP interpolation
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        // Adaptive lerp factor: tighter at low differences, responsive at high
        const lerpFactor = playbackMode === "autoplay" ? 0.35 : 0.16;
        currentFrameRef.current += diff * lerpFactor;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      renderFrame(currentFrameRef.current);
      const progress = currentFrameRef.current / (totalFrames - 1);
      setCurrentProgress(progress);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [playbackMode, isPlaying, playbackSpeed, totalFrames, renderFrame]);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      renderFrame(currentFrameRef.current);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame]);

  // Scroll Listener (Only active in 'scroll' mode)
  useEffect(() => {
    if (playbackMode !== "scroll") return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      // Calculate progress from 0.0 to 1.0 within container
      const scrolled = -containerTop;
      const progress = Math.min(Math.max(0, scrolled / totalScrollableDistance), 1.0);

      targetFrameRef.current = progress * (totalFrames - 1);

      // Track scroll velocity for procedural audio whoosh
      const now = performance.now();
      const dt = Math.max(now - lastScrollTimeRef.current, 16);
      const dy = Math.abs(window.scrollY - lastScrollYRef.current);
      const speed = (dy / dt) * 1000; // px/sec

      lastScrollYRef.current = window.scrollY;
      lastScrollTimeRef.current = now;

      if (cyberAudio) {
        cyberAudio.updateScrollDynamics(progress, speed);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [playbackMode, totalFrames]);

  // Manual scrubber jump
  const handleSeek = (newProgress: number) => {
    const target = newProgress * (totalFrames - 1);
    targetFrameRef.current = target;
    if (playbackMode === "scroll" && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const containerTop = window.scrollY + rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;
      window.scrollTo({
        top: containerTop + newProgress * totalScrollableDistance,
        behavior: "smooth",
      });
    }
    if (cyberAudio) {
      cyberAudio.playHudBeep(1400);
    }
  };

  const toggleAudio = () => {
    if (!cyberAudio) return;
    const nextMuted = !isAudioMuted;
    cyberAudio.setMuted(nextMuted);
    setIsAudioMuted(nextMuted);
    if (!nextMuted) {
      cyberAudio.playHudBeep(980);
    }
  };

  const togglePlayPause = () => {
    if (playbackMode !== "autoplay") {
      setPlaybackMode("autoplay");
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
    if (cyberAudio) {
      cyberAudio.playHudBeep(1100);
    }
  };

  // Chapter Jump Helper
  const jumpToChapter = (chapterProgress: number) => {
    handleSeek(chapterProgress);
  };

  // Dynamic Phase Info based on progress
  const getPhaseData = (p: number) => {
    if (p < 0.28) {
      return {
        id: "STAGE 01",
        title: "QUANTUM MATRIX INGRESS",
        tag: "CIPHER STREAM ACTIVE",
        desc: "Penetrating dark cyberpunk encryption lattice. Digital rain flowing across neural node boundaries.",
        metric1: { label: "STREAM FLUX", val: "4.8 TB/s" },
        metric2: { label: "ENTROPY", val: "0.042" },
        metric3: { label: "OPTICAL BIAS", val: "CYAN 490nm" },
        accent: "text-cyan-400 border-cyan-500/40 bg-cyan-950/20",
      };
    } else if (p < 0.58) {
      return {
        id: "STAGE 02",
        title: "DATA VORTEX ACCELERATION",
        tag: "RELATIVISTIC WARP",
        desc: "Camera diving into concentric data tunnel vortex. Glyphs stretching along radial optic vectors with motion blur.",
        metric1: { label: "WARP FACTOR", val: "0.92c" },
        metric2: { label: "CORE FOCUS", val: "SINGULARITY" },
        metric3: { label: "SPECTRAL SHIFT", val: "+14.2 GHz" },
        accent: "text-blue-400 border-blue-500/40 bg-blue-950/20",
      };
    } else if (p < 0.82) {
      return {
        id: "STAGE 03",
        title: "CIRCUIT TRACE IGNITION",
        tag: "SILICON LITHOGRAPHY",
        desc: "Data particles crystallizing into conductor lines. High-energy electric blue wavefront lighting motherboard traces.",
        metric1: { label: "BUS VOLTAGE", val: "1.25 V" },
        metric2: { label: "CONDUCTANCE", val: "99.98%" },
        metric3: { label: "PROPAGATION", val: "LIGHT-SPEED" },
        accent: "text-sky-300 border-sky-400/40 bg-sky-950/20",
      };
    } else {
      return {
        id: "STAGE 04",
        title: "QUANTUM CPU DIE LOCK-IN",
        tag: "ARCHITECTURE READY",
        desc: "Macro cinematic close-up on central CPU die. All circuit traces energized with electric-blue cryogenic glow.",
        metric1: { label: "CLOCK SPEED", val: "6.84 GHz" },
        metric2: { label: "NEURAL CORES", val: "128 QUANTUM" },
        metric3: { label: "CRYO TEMP", val: "-196 °C" },
        accent: "text-teal-300 border-teal-400/40 bg-teal-950/20",
      };
    }
  };

  const phase = getPhaseData(currentProgress);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030712] shrink-0"
      style={{ height: "400vh", minHeight: "400vh" }}
      id="transition-section"
    >
      {/* Sticky Viewport Container */}
      <div 
        className="sticky top-0 w-full flex items-center justify-center overflow-hidden"
        style={{ height: "100vh", minHeight: "100vh" }}
      >
        {/* Canvas for zero-latency frame scrubbing */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ width: "100%", height: "100%" }}
        />

        {/* Ambient Vignette for cinematic focus */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(3,7,18,0.6)_95%,#030712_100%)]" />



        {/* BOTTOM RIGHT SCROLL DOWN NOTATION (Visible at start, fades smoothly as user scrolls) */}
        <div
          className={`absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-center gap-2.5 pointer-events-none transition-all duration-500 ${
            currentProgress > 0.12 ? "opacity-0 translate-y-4 pointer-events-none" : "opacity-100 translate-y-0"
          }`}
        >
          <span className="text-xs md:text-sm font-mono tracking-[0.28em] text-cyan-300 font-extrabold glow-cyan uppercase drop-shadow-[0_0_15px_rgba(0,240,255,0.9)]">
            SCROLL DOWN
          </span>
          <div className="w-7 h-12 border-2 border-cyan-400 rounded-full flex justify-center pt-2 shadow-[0_0_18px_rgba(0,240,255,0.6)] bg-black/50 backdrop-blur-sm">
            <div className="w-1.5 h-3.5 bg-cyan-300 rounded-full animate-bounce shadow-[0_0_12px_#00f0ff]" />
          </div>
        </div>

        {/* NEXT SECTION CUE (Appears gently at the end of the journey) */}
        <div
          className={`absolute bottom-8 right-8 md:bottom-12 md:right-12 z-20 flex flex-col items-center gap-2 pointer-events-none transition-all duration-500 ${
            currentProgress > 0.94 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
        >
          <span className="text-xs font-mono tracking-[0.22em] text-cyan-300 font-bold glow-cyan uppercase drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-5 h-5 text-cyan-400 animate-bounce" />
        </div>

        {/* Subtle Loading Screen (Only visible during initial buffering) */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030712]">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-100"
                style={{ width: `${(loadedCount / totalFrames) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
