"use client";

import { Cpu, Terminal, Download, ShieldCheck } from "lucide-react";

interface NavbarProps {
  onOpenVideoModal: () => void;
}

export default function Navbar({ onOpenVideoModal }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-lg border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-bold tracking-widest text-sm text-white flex items-center gap-1.5">
              GEEKS UNITED <span className="text-[10px] px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 rounded font-normal">v2.4</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-500 tracking-wider">
              QUANTUM SILICON TRANSITION
            </span>
          </div>
        </div>

        {/* Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono text-gray-400">
          <a
            href="#transition-section"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span className="text-cyan-500">//</span> 01. TRANSITION
          </a>
          <a
            href="#architecture-section"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span className="text-cyan-500">//</span> 02. ARCHITECTURE
          </a>
          <a
            href="#telemetry-section"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span className="text-cyan-500">//</span> 03. BENCHMARKS
          </a>
          <a
            href="#stages-section"
            className="hover:text-cyan-300 transition-colors flex items-center gap-1"
          >
            <span className="text-cyan-500">//</span> 04. KEYFRAMES
          </a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenVideoModal}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-400/50 rounded-lg text-xs font-mono transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.25)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-semibold">EXPORT MP4</span>
          </button>
        </div>
      </div>
    </header>
  );
}
