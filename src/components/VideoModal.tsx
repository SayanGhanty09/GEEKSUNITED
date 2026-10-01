"use client";

import React, { useEffect } from "react";
import { X, Download, Film, Sparkles } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl rounded-2xl border border-cyan-500/40 bg-slate-950/95 overflow-hidden shadow-[0_0_50px_rgba(0,240,255,0.3)]">
        <div className="hud-corner-tl" />
        <div className="hud-corner-tr" />
        <div className="hud-corner-bl" />
        <div className="hud-corner-br" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-black/60">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-cyan-400" />
            <span className="font-mono text-sm font-bold text-white tracking-wider">
              CINEMATIC TRANSITION MASTER // 1080p 16:9
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/cinematic_transition.mp4"
              download="geeks_united_cyber_transition.mp4"
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 text-cyan-200 text-xs font-mono rounded-lg transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD MP4 (9.5MB)</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video w-full bg-black">
          <video
            src="/cinematic_transition.mp4"
            controls
            autoPlay
            loop
            playsInline
            className="w-full h-full object-contain"
          />
        </div>

        {/* Video Specs Footer */}
        <div className="p-4 bg-black/80 border-t border-cyan-500/20 flex flex-wrap items-center justify-between text-xs font-mono text-gray-400 gap-2">
          <div className="flex items-center gap-4">
            <span>CODEC: <strong className="text-cyan-300">MP4 / AVC1</strong></span>
            <span>ASPECT: <strong className="text-cyan-300">16:9</strong></span>
            <span>FRAMERATE: <strong className="text-cyan-300">30 FPS (60Hz Scaled)</strong></span>
          </div>
          <div className="text-[11px] text-cyan-500">
            RENDERED WITH OPEN-CV & NUMPY 3D OPTICAL PIPELINE
          </div>
        </div>
      </div>
    </div>
  );
}
