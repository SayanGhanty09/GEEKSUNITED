"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, ArrowRight, Sparkles, CheckCircle2, Film } from "lucide-react";

export default function KeyframeShowcase({
  onSelectFrame,
}: {
  onSelectFrame?: (frameIdx: number) => void;
}) {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  const stages = [
    {
      frameNum: 0,
      title: "STAGE 01: MATRIX INGRESS",
      source: "IMAGE 1 STARTING SCENE",
      badge: "FRAME 001 // PROGRESS 0%",
      imageSrc: "/sequence/frame_000.webp",
      desc: "Starts exactly from the visual world of IMAGE 1. A dark cyberpunk digital environment filled with glowing cyan-blue numbers, code particles, digital rain, neural-like structures and a mysterious technological atmosphere.",
      technical: [
        "Identical baseline to Reference Image 1",
        "Floating cyan streams with depth-of-field separation",
        "Neural network branching patterns in volumetric fog",
      ],
    },
    {
      frameNum: 60,
      title: "STAGE 02: DATA VORTEX TUNNEL",
      source: "IMAGE 2 DATA VORTEX",
      badge: "FRAME 060 // PROGRESS 33%",
      imageSrc: "/sequence/frame_060.webp",
      desc: "As the camera moves forward, the surrounding numbers and particles flow toward the lens and stretch with subtle cinematic motion blur, creating the feeling that the viewer is travelling through a digital data tunnel with concentric vortex rings.",
      technical: [
        "Continuous forward camera acceleration without cut",
        "Multi-tap radial motion blur along optical velocity vectors",
        "Energy concentration into the central cyan singularity",
      ],
    },
    {
      frameNum: 120,
      title: "STAGE 03: CIRCUIT TRACE IGNITION",
      source: "TRANSFORMATION PHASE",
      badge: "FRAME 120 // PROGRESS 66%",
      imageSrc: "/sequence/frame_120.webp",
      desc: "Digital particles and numbers transform into tiny glowing electronic particles and circuit fragments. As the camera emerges from the digital tunnel, the glowing particles settle into circuit traces, illuminating motherboard pathways with intense electric-blue energy.",
      technical: [
        "Quantum data particles crystallizing into conductor lines",
        "Radial electric wavefront propagating through PCB traces",
        "Volumetric bloom and dark titanium component emergence",
      ],
    },
    {
      frameNum: 179,
      title: "STAGE 04: CPU DIE LOCK-IN",
      source: "IMAGE 3 ENDING SCENE",
      badge: "FRAME 180 // PROGRESS 100%",
      imageSrc: "/sequence/frame_179.webp",
      desc: "Slow forward push directly toward the CPU die at the center. Ends in a dramatic, ultra-detailed cinematic close-up of the CPU die, matching IMAGE 2 [Motherboard] in composition, lighting, perspective, and electric-blue circuit illumination.",
      technical: [
        "Exact 1:1 match with Ending Reference Image",
        "Macro perspective on titanium CPU heat spreader",
        "Electric-blue trace stability and cryogenic ambient shadows",
      ],
    },
  ];

  return (
    <section id="stages-section" className="relative py-28 px-6 bg-[#030712] border-t border-cyan-500/20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>CONTINUOUS CAMERA TIMELINE</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white mb-4">
            THE 4-STAGE <span className="text-cyan-400 glow-cyan">TRANSITION JOURNEY</span>
          </h2>
          <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
            Zero hard cuts. Zero crossfades. Zero camera shake. A single physical camera trajectory connecting cyberspace directly into microscopic silicon.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stages.map((stage, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={stage.title}
                onClick={() => {
                  setSelectedIdx(idx);
                  if (onSelectFrame) onSelectFrame(stage.frameNum);
                }}
                className={`group relative rounded-xl border overflow-hidden cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "border-cyan-400 bg-cyan-950/30 shadow-[0_0_25px_rgba(0,240,255,0.25)] translate-y--1"
                    : "border-slate-800 bg-slate-950/60 hover:border-cyan-500/40 hover:bg-slate-900/50"
                }`}
              >
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-black">
                  <img
                    src={stage.imageSrc}
                    alt={stage.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded text-[10px] font-mono text-cyan-300">
                    {stage.badge}
                  </div>
                </div>

                <div className="p-5">
                  <div className="text-[10px] font-mono text-cyan-500 font-semibold mb-1">
                    {stage.source}
                  </div>
                  <h3 className="text-sm font-mono font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed line-clamp-3">
                    {stage.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Expanded Showcase */}
        <div className="relative p-6 md:p-8 rounded-2xl border border-cyan-500/30 bg-black/70 backdrop-blur-xl shadow-2xl">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* High-res Image Preview */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              <img
                src={stages[selectedIdx].imageSrc}
                alt={stages[selectedIdx].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md border border-cyan-500/40 rounded text-xs font-mono text-cyan-300">
                {stages[selectedIdx].badge}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="text-xs font-mono text-cyan-400 mb-1">
                {stages[selectedIdx].source}
              </div>
              <h3 className="text-2xl font-mono font-bold text-white mb-4">
                {stages[selectedIdx].title}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed font-sans mb-6">
                {stages[selectedIdx].desc}
              </p>

              <div className="space-y-2 mb-6">
                <div className="text-xs font-mono text-cyan-300 font-semibold">
                  CINEMATIC RENDER SPECIFICATIONS:
                </div>
                {stages[selectedIdx].technical.map((tech) => (
                  <div key={tech} className="flex items-center gap-2 text-xs text-gray-300 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{tech}</span>
                  </div>
                ))}
              </div>

              <a
                href="#transition-section"
                className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-cyan-200 transition-colors"
              >
                <span>Scrub to this frame in Hero Transition</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
