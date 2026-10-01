"use client";

import React, { useState } from "react";
import { Activity, Gauge, Cpu, Zap, Sliders, ShieldCheck } from "lucide-react";

export default function TelemetryBenchmarks() {
  const [clockMhz, setClockMhz] = useState<number>(6840);
  const [cryoMode, setCryoMode] = useState<boolean>(true);

  // Derived metrics
  const flops = ((clockMhz / 1000) * 128 * (cryoMode ? 1.4 : 1.0)).toFixed(1);
  const powerW = Math.round(45 + (clockMhz / 7000) ** 2 * (cryoMode ? 50 : 120));
  const tempC = cryoMode ? Math.round(-196 + (clockMhz - 5000) * 0.008) : Math.round(35 + (clockMhz - 5000) * 0.025);

  return (
    <section id="telemetry-section" className="relative py-28 px-6 bg-[#030712] border-t border-cyan-500/20 cyber-grid-dense">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-cyan-950/30 text-cyan-300 text-xs font-mono mb-4 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>REAL-TIME HARDWARE SIMULATOR</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-mono font-bold tracking-tight text-white mb-4">
            QUANTUM DIE <span className="text-cyan-400 glow-cyan">TELEMETRY</span>
          </h2>
          <p className="max-w-2xl text-gray-400 text-sm md:text-base leading-relaxed">
            Simulate operational frequencies, cryogenic thermal dissipation, and tensor throughput across all 128 quantum arithmetic logic units.
          </p>
        </div>

        {/* Dashboard Frame */}
        <div className="relative p-8 rounded-2xl border border-cyan-500/30 bg-slate-950/80 backdrop-blur-xl shadow-2xl">
          <div className="hud-corner-tl" />
          <div className="hud-corner-tr" />
          <div className="hud-corner-bl" />
          <div className="hud-corner-br" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Interactive Sliders */}
            <div className="lg:col-span-1 space-y-6">
              <h3 className="text-base font-mono font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>OVERCLOCK & INJECTION</span>
              </h3>

              {/* Frequency Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Core Frequency:</span>
                  <span className="text-cyan-300 font-bold">{(clockMhz / 1000).toFixed(2)} GHz</span>
                </div>
                <input
                  type="range"
                  min="4000"
                  max="8000"
                  step="50"
                  value={clockMhz}
                  onChange={(e) => setClockMhz(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>4.0 GHz</span>
                  <span>6.84 GHz (Base)</span>
                  <span>8.0 GHz (Peak)</span>
                </div>
              </div>

              {/* Cryo Mode Toggle */}
              <div className="p-4 rounded-xl border border-cyan-500/20 bg-black/40 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-white">Liquid Nitrogen Cryo-Armor</div>
                  <div className="text-[10px] text-gray-400 font-sans">Superconducting zero-resistance mode</div>
                </div>
                <button
                  onClick={() => setCryoMode(!cryoMode)}
                  className={`px-3 py-1 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                    cryoMode
                      ? "bg-cyan-500/30 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                      : "bg-slate-800 text-gray-400 border-slate-700"
                  }`}
                >
                  {cryoMode ? "ENGAGED" : "OFFLINE"}
                </button>
              </div>

              {/* Status pill */}
              <div className="p-3 rounded-lg border border-cyan-500/20 bg-cyan-950/20 text-[11px] font-mono text-cyan-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>DIE INTERLOCK: 100% NOMINAL</span>
              </div>
            </div>

            {/* Gauge Displays */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Flops */}
              <div className="p-6 rounded-xl border border-cyan-500/30 bg-black/60 flex flex-col justify-between">
                <div className="text-xs font-mono text-gray-400">QUANTUM THROUGHPUT</div>
                <div className="my-4">
                  <span className="text-4xl font-mono font-bold text-white glow-cyan">{flops}</span>
                  <span className="text-sm font-mono text-cyan-400 ml-1">PFLOPS</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-500">
                  +38% vs Standard Silicon
                </div>
              </div>

              {/* Power */}
              <div className="p-6 rounded-xl border border-blue-500/30 bg-black/60 flex flex-col justify-between">
                <div className="text-xs font-mono text-gray-400">THERMAL ENVELOPE (TDP)</div>
                <div className="my-4">
                  <span className="text-4xl font-mono font-bold text-white glow-blue">{powerW}</span>
                  <span className="text-sm font-mono text-blue-400 ml-1">WATTS</span>
                </div>
                <div className="text-[10px] font-mono text-blue-400">
                  Adaptive Power Delivery
                </div>
              </div>

              {/* Temp */}
              <div className="p-6 rounded-xl border border-sky-500/30 bg-black/60 flex flex-col justify-between">
                <div className="text-xs font-mono text-gray-400">JUNCTION DIE TEMP</div>
                <div className="my-4">
                  <span className="text-4xl font-mono font-bold text-white glow-cyan">{tempC}</span>
                  <span className="text-sm font-mono text-cyan-400 ml-1">°C</span>
                </div>
                <div className="text-[10px] font-mono text-cyan-400">
                  {cryoMode ? "Superconducting State" : "Air Cooled"}
                </div>
              </div>

              {/* Circuit Bus Status Bar */}
              <div className="sm:col-span-3 p-5 rounded-xl border border-cyan-500/20 bg-black/50">
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-gray-400">MOTHERBOARD TRACE DENSITY UTILIZATION</span>
                  <span className="text-cyan-300 font-bold">{Math.round((clockMhz / 8000) * 100)}% ACTIVE</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-cyan-500/30">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-sky-400 transition-all duration-300"
                    style={{ width: `${(clockMhz / 8000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
