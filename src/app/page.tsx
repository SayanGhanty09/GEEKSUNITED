"use client";

import React from "react";
import ScrollSequence from "@/components/ScrollSequence";
import GeeksCommunity from "@/components/GeeksCommunity";
import { SEQUENCE_CONFIG } from "@/config/scrollSequence.config";
import { Terminal, Sparkles, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 1. CINEMATIC SCROLL-DRIVEN SEQUENCE HERO */}
      <ScrollSequence
        framesPath={SEQUENCE_CONFIG.FRAME_PATH}
        frameCount={SEQUENCE_CONFIG.FRAME_COUNT}
        scrollDistance={SEQUENCE_CONFIG.SCROLL_DISTANCE}
        posterFrame={SEQUENCE_CONFIG.POSTER_FRAME}
        frameExtension={SEQUENCE_CONFIG.FRAME_EXTENSION}
        padLength={SEQUENCE_CONFIG.PAD_LENGTH}
      />

      {/* 2. SEAMLESS POST-HERO TRANSITION BANNER ("MORE THAN A CLUB.") */}
      <section className="relative w-full bg-black py-20 px-4 sm:px-6 border-b border-cyan-500/20 z-20">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono-cyber tracking-widest uppercase">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYSTEM READY // ENTERING COMMUNITY HUB</span>
          </div>

          <h2 className="font-orbitron font-black text-3xl sm:text-5xl md:text-6xl text-white tracking-wide">
            MORE THAN A <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">CLUB.</span>
          </h2>

          <p className="font-space text-base sm:text-xl text-neutral-300 max-w-2xl mx-auto font-medium leading-relaxed">
            We build. We experiment. We compete. We learn.
          </p>
        </div>
      </section>

      {/* 3. GEEKS UNITED COMMUNITY HUB & SECTIONS */}
      <GeeksCommunity />
    </main>
  );
}
