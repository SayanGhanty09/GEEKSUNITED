"use client";

import React, { useState } from "react";
import { Cpu, Zap, Activity, Shield, Terminal, Microchip, Layers, Sparkles } from "lucide-react";

export default function ArchitectureSection() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const modules = [
    {
      name: "NEURAL QUANTUM CORE MATRIX",
      icon: Cpu,
      clock: "6.84 GHz Cryo-Boost",
      density: "128 Quantum Arithmetic Units",
      desc: "Fabricated on a 1.2nm sub-atomic lithography process with atomic-level circuit trace deposition. Capable of real-time quantum matrix transforms and tensor flow calculations.",
      stats: [
        { label: "IPC THROUGHPUT", val: "14.2x Gen-Previous" },
        { label: "QUANTUM EFFICIENCY", val: "99.8%" },
        { label: "TDP ENVELOPE", val: "95 Watts (Cryo)" },
      ],
    },
    {
      name: "PHOTONIC CIRCUIT BUS INTERCONNECT",
      icon: Zap,
      clock: "128 TB/s Bi-Directional",
      density: "Electric-Blue Superconducting Traces",
      desc: "Zero-latency optical waveguide paths etched into dark PCB substrate. Glowing electric-cyan pathways conduct quantum coherent data streams without capacitive degradation.",
      stats: [
        { label: "BANDWIDTH DENSITY", val: "1.2 Petabytes/sec" },
        { label: "SIGNAL LATENCY", val: "< 0.12 Picoseconds" },
        { label: "IMPEDANCE", val: "Near-Zero Superconducting" },
      ],
    },
    {
      name: "3D STACKED NEUROMORPHIC CACHE",
      icon: Layers,
      clock: "512 MB High-Bandwidth L3",
      density: "Through-Silicon Optical Vias (TSV)",
      desc: "Stacked directly beneath the CPU socket die, distributing instant memory access across all 128 cores with optical routing and dynamic phase-change persistence.",
      stats: [
        { label: "ACCESS CYCLE", val: "0.2 Clock Cycles" },
        { label: "STACK LAYERS", val: "16 Die Micro-Pillars" },
        { label: "THERMAL SPREAD", val: "Liquid-Diamond Vapor" },
      ],
    },
    {
      name: "TITANIUM CRYOGENIC DIE HOUSING",
      icon: Shield,
      clock: "-196 °C Liquid Nitrogen Rated",
      density: "Hermetic Vacuum Sealed Lid",
      desc: "Precision CNC milled dark alloy lid that seals the microscopic quantum dies from electromagnetic noise and ambient thermal drift, as highlighted in the ending macro shot.",
      stats: [
        { label: "THERMAL CONDUCTIVITY", val: "2200 W/m·K" },
        { label: "EMI SHIELDING", val: "> 120 dB Isolation" },
        { label: "STRUCTURAL RIGIDITY", val: "Titanium-Boron Alloy" },
      ],
    },
  ];

  return (
    <section id="architecture-section" className="relative py-28 px-6 bg-[#030712] border-t border-cyan-500/20 cyber-grid">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Microchip className="w-3.5 h-3.5 text-cyan-400" />
            <span>HARDWARE ARCHITECTURE // IMAGE 02 SPECIFICATIONS</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white mb-4">
            THE QUANTUM DIE <span className="text-cyan-400 glow-cyan">BREAKDOWN</span>
          </h2>
          <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
            The destination of the camera journey: a high-density, cryogenic quantum CPU mounted on a dark textured motherboard with illuminated electric-blue PCB traces.
          </p>
        </div>

        {/* Interactive Module Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            const isSelected = activeTab === idx;
            return (
              <div
                key={mod.name}
                onClick={() => setActiveTab(idx)}
                className={`relative p-6 rounded-xl border backdrop-blur-md cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? "bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.25)] translate-y--1"
                    : "bg-slate-950/60 border-cyan-500/20 hover:border-cyan-500/50 hover:bg-slate-900/40"
                }`}
              >
                <div className="hud-corner-tl" />
                <div className="hud-corner-tr" />
                <div className="hud-corner-bl" />
                <div className="hud-corner-br" />

                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg border ${isSelected ? "border-cyan-400 bg-cyan-500/20 text-cyan-300" : "border-slate-800 bg-slate-900 text-gray-400"}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">
                    0{idx + 1} // SYS
                  </span>
                </div>

                <h3 className="text-sm font-mono font-bold text-white mb-2 tracking-wide">
                  {mod.name}
                </h3>
                <div className="text-xs font-mono text-cyan-300 mb-3">{mod.clock}</div>
                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-4">
                  {mod.desc}
                </p>

                <div className="space-y-1.5 pt-3 border-t border-cyan-500/20">
                  {mod.stats.map((s) => (
                    <div key={s.label} className="flex justify-between text-[10px] font-mono">
                      <span className="text-gray-400">{s.label}:</span>
                      <span className="text-cyan-300 font-semibold">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Focus Detail Hero Banner */}
        <div className="relative p-8 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-950/90 via-cyan-950/30 to-slate-950/90 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                <span>ACTIVE SUBSYSTEM TELEMETRY</span>
              </div>
              <h3 className="text-2xl font-mono font-bold text-white mb-3">
                {modules[activeTab].name}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed mb-6 font-sans">
                {modules[activeTab].desc} Engineered for high-frequency quantum matrix computations, this architectural layer seamlessly links the mathematical cyberspace from Image 1 with the physical silicon hardware of Image 2.
              </p>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <div className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-black/50 text-cyan-300">
                  METRIC: <strong className="text-white">{modules[activeTab].density}</strong>
                </div>
                <div className="px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-black/50 text-cyan-300">
                  CLOCK: <strong className="text-white">{modules[activeTab].clock}</strong>
                </div>
              </div>
            </div>

            <div className="bg-black/60 p-6 rounded-xl border border-cyan-500/20 font-mono text-xs space-y-3">
              <div className="flex justify-between border-b border-slate-800 pb-2 text-gray-400">
                <span>DIAGNOSTIC CHANNEL</span>
                <span className="text-cyan-400">STATUS // NOMINAL</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Silicon Voltage:</span>
                  <span className="text-cyan-300">1.254 V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Density:</span>
                  <span className="text-cyan-300">48.2 A/cm²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Photonic Efficiency:</span>
                  <span className="text-cyan-300">99.98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Junction Temp:</span>
                  <span className="text-cyan-300">-195.4 °C</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
