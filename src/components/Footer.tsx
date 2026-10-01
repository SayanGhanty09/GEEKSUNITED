"use client";

import React from "react";
import { Cpu, Terminal, ArrowUp, Shield } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative py-16 px-6 bg-black border-t border-cyan-500/20 text-gray-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-white tracking-widest">
              GEEKS UNITED // QUANTUM SILICON
            </div>
            <div className="text-[10px] text-gray-400">
              NEXT.JS 15 // WEB AUDIO API // HTML5 CANVAS FRAME PIPELINE
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 text-gray-400">
          <span>LATENCY: 0.12ms</span>
          <span className="text-cyan-500">•</span>
          <span>180 FRAMES 60FPS</span>
          <span className="text-cyan-500">•</span>
          <span>16:9 CINEMATIC</span>
        </div>

        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-cyan-500/40 hover:text-cyan-300 transition-all cursor-pointer"
        >
          <span>TOP</span>
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      </div>
    </footer>
  );
}
