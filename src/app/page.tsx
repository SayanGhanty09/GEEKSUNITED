"use client";

import React from "react";
import dynamic from "next/dynamic";
import ScrollSequence from "@/components/ScrollSequence";
import { SEQUENCE_CONFIG } from "@/config/scrollSequence.config";
import { Sparkles } from "lucide-react";

// Code-split GeeksCommunity to reduce initial bundle and optimize TBT / LCP
const GeeksCommunity = dynamic(() => import("@/components/GeeksCommunity"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#08080a] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-[#E8D5B5]/20 border-t-[#E8D5B5] animate-spin" />
    </div>
  ),
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080a] text-[#f5efeb] flex flex-col selection:bg-[#E8D5B5]/25 selection:text-[#FAF6F0]">
      {/* 1. CINEMATIC SCROLL-DRIVEN SEQUENCE HERO (UNCHANGED) */}
      <ScrollSequence
        framesPath={SEQUENCE_CONFIG.FRAME_PATH}
        frameCount={SEQUENCE_CONFIG.FRAME_COUNT}
        scrollDistance={SEQUENCE_CONFIG.SCROLL_DISTANCE}
        posterFrame={SEQUENCE_CONFIG.POSTER_FRAME}
        frameExtension={SEQUENCE_CONFIG.FRAME_EXTENSION}
        padLength={SEQUENCE_CONFIG.PAD_LENGTH}
      />

      {/* 2. LUXURY EDITORIAL TRANSITION BANNER ("MORE THAN A COLLECTIVE.") */}
      <section className="relative w-full bg-gradient-to-b from-transparent via-[#08080a]/95 to-[#08080a] pt-16 pb-20 px-4 sm:px-6 border-b border-white/[0.06] z-20 -mt-24 sm:-mt-36">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E8D5B5]/25 bg-[#121215]/80 backdrop-blur-md text-[#E8D5B5] text-[11px] font-mono tracking-widest uppercase shadow-[0_0_20px_rgba(232,213,181,0.12)]">
            <Sparkles className="w-3.5 h-3.5 text-[#E8D5B5]" />
            <span>COMMUNITY // ELEVATING INNOVATION</span>
          </div>

          <h2 className="font-sans font-light text-4xl sm:text-6xl md:text-7xl text-[#F5EFEB] tracking-tight leading-[1.1]">
            More Than A <span className="font-serif italic font-normal text-[#E8D5B5]">Collective.</span>
          </h2>

          <p className="font-sans text-base sm:text-lg text-[#A39F99] max-w-2xl mx-auto font-normal leading-relaxed">
            We build. We experiment. We compete. We master the craft.
          </p>

          {/* Quick Metrics & Society Pillars (Inspired by luxury brand bar) */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-[#8E8A84] border-t border-white/[0.06] max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5B5]" />
              <span className="text-[#FAF6F0] font-semibold">500+</span> ACTIVE MEMBERS
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5B5]" />
              <span className="text-[#FAF6F0] font-semibold">24+</span> ANNUAL HACKATHONS
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8D5B5]" />
              <span className="text-[#FAF6F0] font-semibold">100%</span> PEER MENTORSHIP
            </div>
          </div>
        </div>
      </section>

      {/* 3. GEEKS UNITED COMMUNITY HUB & SECTIONS */}
      <GeeksCommunity />
    </main>
  );
}
