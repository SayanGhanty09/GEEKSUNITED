"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Users, 
  Calendar, 
  Award, 
  Mail, 
  Code, 
  Sparkles, 
  MapPin, 
  Clock, 
  Cpu, 
  Terminal, 
  Layers, 
  Radio, 
  Compass,
  ArrowUpRight,
  Shield,
  Activity
} from "lucide-react";

// Safe inline SVG icons for social links
function GithubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

/* ========================================================================= */
/* 1. EXACT 3D FORWARD-FLYING HYPERSPACE STARFIELD (HIGH CONTRAST PURE BLACK)*/
/* ========================================================================= */
function Cosmic3DStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Dynamic mouse parallax influence
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouse.targetX = (e.clientX - cx) * 0.12;
      mouse.targetY = (e.clientY - cy) * 0.12;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // -----------------------------------------------------------
    // Heavy 3D Starfield: High-density crisp stars flying towards you
    // -----------------------------------------------------------
    const STAR_COUNT = 2200;
    const MAX_DEPTH = 1200;
    const FOV = 320;
    const SPEED = 3.2;

    const stars: Array<{
      x: number;
      y: number;
      z: number;
      prevZ: number;
      speed: number;
      color: string;
      baseSize: number;
      brightness: number;
    }> = [];

    const starShades = [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#f8fafc",
      "#f1f5f9",
      "#e2e8f0",
      "#e0f2fe",
      "#38bdf8",
      "#00f0ff",
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * MAX_DEPTH + 1;
      stars.push({
        x: (Math.random() - 0.5) * 3600,
        y: (Math.random() - 0.5) * 3600,
        z: z,
        prevZ: z,
        speed: Math.random() * 3.5 + SPEED,
        color: starShades[Math.floor(Math.random() * starShades.length)],
        baseSize: Math.random() * 1.5 + 0.4,
        brightness: Math.random() * 0.5 + 0.5,
      });
    }

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Pure pitch black deep space background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + mouse.x;
      const cy = height / 2 + mouse.y;

      for (let i = 0; i < STAR_COUNT; i++) {
        const star = stars[i];

        star.prevZ = star.z;
        // Fly forward towards viewer
        star.z -= star.speed;

        // Reset if passed viewer
        if (star.z <= 1) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 3600;
          star.y = (Math.random() - 0.5) * 3600;
          star.speed = Math.random() * 3.5 + SPEED;
        }

        const k = FOV / star.z;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        const prevK = FOV / star.prevZ;
        const px = star.x * prevK + cx;
        const py = star.y * prevK + cy;

        // Check if out of screen bounds
        if (sx < -40 || sx > width + 40 || sy < -40 || sy > height + 40) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 3600;
          star.y = (Math.random() - 0.5) * 3600;
          continue;
        }

        const depthRatio = 1 - star.z / MAX_DEPTH;
        const alpha = Math.min(1, Math.max(0.15, depthRatio * 1.6 * star.brightness));
        const currentSize = Math.max(0.45, depthRatio * star.baseSize * 2.4);

        // Motion trailing streak
        ctx.strokeStyle = star.color;
        ctx.globalAlpha = alpha * 0.8;
        ctx.lineWidth = Math.max(0.5, currentSize * 0.7);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Glowing core
        ctx.fillStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(sx, sy, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Subtle soft bloom for close stars
        if (star.z < 300) {
          const glowRad = currentSize * 3;
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, glowRad);
          grad.addColorStop(0, "rgba(255, 255, 255, 0.7)");
          grad.addColorStop(0.4, "rgba(0, 240, 255, 0.3)");
          grad.addColorStop(1, "transparent");

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, glowRad, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ========================================================================= */
/* 2. INTERACTIVE 3D PERSPECTIVE TILT CARD WITH CYBER MATRIX DOT-GRID HOVER */
/* ========================================================================= */
function TiltCard3D({
  children,
  className = "",
  onClick,
  showGrid = false,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  showGrid?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>("");
  const [specularStyle, setSpecularStyle] = useState<string>("none");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );

    setSpecularStyle(
      `radial-gradient(circle 280px at ${x}px ${y}px, rgba(0, 240, 255, 0.22), transparent 70%)`
    );
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
    setSpecularStyle("none");
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: transformStyle ? "transform 0.12s ease-out" : "transform 0.4s ease-out",
        transformStyle: "preserve-3d",
      }}
      className={`relative group rounded-3xl border border-white/10 bg-[#07090e]/90 backdrop-blur-xl hover:border-cyan-400/90 shadow-[0_4px_24px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(0,240,255,0.35),inset_0_0_20px_rgba(0,240,255,0.1)] transition-all cursor-pointer overflow-hidden ${className}`}
    >
      {/* Exact Cyber Dot-Matrix Grid overlay on Hover (matching user reference) */}
      {showGrid && (
        <>
          <div className="absolute inset-0 cyber-matrix-grid opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.15)_0%,transparent_75%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
        </>
      )}

      {/* 3D Dynamic Specular Light Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{ background: specularStyle }}
      />

      {/* Sci-Fi HUD Corner Brackets */}
      <div className="hud-corner-tl opacity-40 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_#00f0ff] transition-all z-20" />
      <div className="hud-corner-br opacity-40 group-hover:opacity-100 group-hover:drop-shadow-[0_0_6px_#00f0ff] transition-all z-20" />

      {/* Shimmer Light Beam */}
      <div className="nssc-shimmer z-20" />

      {/* Card Content with 3D Popout Depth */}
      <div style={{ transform: "translateZ(24px)" }} className="relative z-30 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
}

export default function GeeksCommunity() {
  const [activeTab, setActiveTab] = useState<string>("Home");

  // Exact navigation tabs matching the reference image
  const tabs = [
    "Home",
    "About",
    "Events",
    "Team",
    "Past Members",
    "Photo Gallery",
    "Join Us",
    "Contact",
  ];

  return (
    <section 
      id="community-section" 
      className="relative w-full bg-black text-neutral-100 min-h-screen pb-24 overflow-hidden selection:bg-cyan-500/30 selection:text-cyan-200"
    >
      {/* 1. EXACT 3D FORWARD-FLYING SPACE BACKGROUND */}
      <Cosmic3DStarfield />

      {/* ============================================================== */}
      {/* HORIZONTAL NAVBAR WITH GEEKS UNITED LOGO & BRAND NAME           */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4 relative z-10">
          
          {/* Left: Geeks United Logo + Brand Name */}
          <div 
            onClick={() => setActiveTab("Home")}
            className="flex items-center gap-3 shrink-0 cursor-pointer group select-none"
          >
            <div className="relative w-9 h-9 rounded-lg bg-black border border-cyan-500/50 group-hover:border-cyan-400 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_15px_rgba(0,240,255,0.3)] group-hover:shadow-[0_0_22px_rgba(0,240,255,0.6)] transition-all duration-300">
              <img
                src="/geeks_united_logo_cyan.png"
                alt="Geeks United Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_#00f0ff]"
              />
            </div>
            <span className="font-orbitron font-extrabold tracking-wider text-base sm:text-lg bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300 bg-clip-text text-transparent group-hover:drop-shadow-[0_0_14px_rgba(0,240,255,0.7)] transition-all">
              GEEKS UNITED
            </span>
          </div>

          {/* Center / Right: Horizontal Nav Tabs (Matching screenshot) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm md:text-[14px] font-space font-medium tracking-wide transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? "text-white bg-[#101626] rounded-t-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                      : "text-neutral-400 hover:text-cyan-300 hover:bg-neutral-900/60 rounded-md"
                  }`}
                >
                  <span className="relative z-10">{tab}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#00f0ff] shadow-[0_0_14px_#00f0ff]" />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* MAIN TAB CONTENT - NATURAL VERTICAL SCROLLING (UP & DOWN)       */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 relative z-10">

        {/* ==================== TAB: EVENTS ==================== */}
        {activeTab === "Events" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header */}
            <div className="border-b border-cyan-500/20 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono-cyber mb-2 tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                <span>ANNUAL CALENDAR // 2026 - 2027</span>
              </div>
              <h2 className="font-orbitron text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                Upcoming & Flagship Events
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Explore our 24-hour national hackathon, embedded avionics workshops, and algorithmic duels.
              </p>
            </div>

            {/* Vertical Responsive Grid of 3D Tilt Event Cards (Scrolls Up & Down) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 pb-8">
              {[
                {
                  id: "hackunited-26",
                  type: "ANNUAL HACKATHON",
                  status: "REGISTRATIONS LIVE",
                  title: "HackUnited '26: 24-Hour National Hackathon",
                  date: "OCTOBER 17 - 18, 2026",
                  venue: "Campus Main Auditorium & Labs",
                  perk: "₹1,00,000 Cash Pool + Cloud Credits",
                  desc: "Our flagship 24-hour hackathon. 80+ shortlisted teams competing across 4 tracks: Full-Stack Web, AI/ML Applications, Hardware & Robotics, and Open Innovation.",
                  cta: "Register Team",
                  tagColor: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
                },
                {
                  id: "embedded-jam",
                  type: "HARDWARE WORKSHOP",
                  status: "SEATS FILLING FAST",
                  title: "Embedded Systems & Drone Telemetry Jam",
                  date: "NOVEMBER 07, 2026",
                  venue: "Robotics & Electronics Lab 304",
                  perk: "ESP32 & Sensor Kits Provided",
                  desc: "Hands-on session using ESP32, ultrasonic distance sensors, and brushless motor ESCs. Program flight stabilization logic in C++ and test autonomous line rovers.",
                  cta: "Reserve Seat",
                  tagColor: "text-blue-400 bg-blue-950/40 border-blue-500/30",
                },
                {
                  id: "git-jumpstart",
                  type: "BEGINNER BOOTCAMP",
                  status: "OPEN TO ALL",
                  title: "Git, GitHub & Open Source Jumpstart",
                  date: "NOVEMBER 21, 2026",
                  venue: "Seminar Hall 2 & Discord Stage",
                  perk: "Free Entry & Digital Certificate",
                  desc: "Zero prerequisites required. Learn the terminal, staging files, branching strategies, resolving real merge conflicts, and making your first pull request.",
                  cta: "RSVP Free",
                  tagColor: "text-teal-400 bg-teal-950/40 border-teal-500/30",
                },
                {
                  id: "codeclash",
                  type: "CP CONTEST",
                  status: "RATED CONTEST",
                  title: "CodeClash: Algorithmic Duel v4",
                  date: "DECEMBER 05, 2026",
                  venue: "Computer Lab 4 & HackerEarth",
                  perk: "Mechanical Keyboards for Top 3",
                  desc: "A 2.5-hour competitive programming duel. 5 algorithmic challenges covering graphs, dynamic programming, number theory, and data structures.",
                  cta: "View Problems",
                  tagColor: "text-sky-400 bg-sky-950/40 border-sky-500/30",
                },
                {
                  id: "fastapi-docker",
                  type: "DEV TALK",
                  status: "UPCOMING",
                  title: "Building Production Backends with FastAPI & Docker",
                  date: "JANUARY 09, 2027",
                  venue: "Smart Classroom 102",
                  perk: "Live Code Walkthrough",
                  desc: "Writing asynchronous Python APIs, managing migrations with Alembic, containerizing multi-service architectures, and setting up automated GitHub Actions CI/CD.",
                  cta: "Add to Calendar",
                  tagColor: "text-cyan-300 bg-cyan-950/30 border-cyan-400/30",
                },
                {
                  id: "cyber-defense",
                  type: "SECURITY LAB",
                  status: "UPCOMING",
                  title: "Network Penetration & Web Security Workshop",
                  date: "FEBRUARY 14, 2027",
                  venue: "Cyber Lab Room 208",
                  perk: "Hands-on CTF Sandbox",
                  desc: "Packet sniffing with Wireshark, exploiting OWASP Top 10 vulnerabilities in a sandbox environment, and writing defensive security patches.",
                  cta: "Notify Me",
                  tagColor: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
                }
              ].map((ev) => (
                <TiltCard3D
                  key={ev.id}
                  className="p-6 h-full"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-mono-cyber font-bold px-2.5 py-0.5 rounded border tracking-wider ${ev.tagColor}`}>
                        {ev.type}
                      </span>
                      <span className="text-[10px] font-mono-cyber text-emerald-400 bg-emerald-950/30 border border-emerald-500/30 px-2 py-0.5 rounded">
                        {ev.status}
                      </span>
                    </div>

                    <h3 className="font-space text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                      {ev.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-neutral-400 font-mono-cyber pt-1">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{ev.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="truncate">{ev.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-cyan-300 font-semibold pt-0.5">
                        <Award className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{ev.perk}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans pt-2">
                      {ev.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-neutral-800/80 flex items-center justify-between">
                    <button
                      onClick={() => alert(`Registered interest for ${ev.title}!`)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-space text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_24px_rgba(0,240,255,0.6)] cursor-pointer"
                    >
                      {ev.cta}
                    </button>
                    <span className="text-[11px] font-mono-cyber text-neutral-500">Student Entry</span>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: TEAM ==================== */}
        {activeTab === "Team" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono-cyber mb-2 tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>STUDENT EXECUTIVE BOARD // 2026-2027</span>
              </div>
              <h2 className="font-orbitron text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                Core Leads & Domain Mentors
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Meet the student engineers managing our software repositories, robotics lab, and weekly community sessions.
              </p>
            </div>

            {/* Vertical Responsive Grid of 3D Tilt Team Cards (Scrolls Up & Down) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-2 pb-8">
              {[
                {
                  name: "Suvam Ghosh",
                  role: "Tech Team",
                  email: "suvam@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://github.com",
                  avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Vinamra Agrawal",
                  role: "Sponsorship Team",
                  email: "vinamra@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://facebook.com",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Aanya Singhal",
                  role: "Public Relations Head",
                  email: "aanya@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://facebook.com",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Abhinam Dutta",
                  role: "Design and Media Head",
                  email: "abhinam@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://facebook.com",
                  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Abhinav Singh",
                  role: "Events Management Head",
                  email: "abhinav@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://facebook.com",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Aman Mukherjee",
                  role: "President / Club Lead",
                  email: "aman@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://github.com",
                  avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Ritika Sengupta",
                  role: "Technical Lead (Web)",
                  email: "ritika@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://github.com",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
                },
                {
                  name: "Soumyadeep Das",
                  role: "Robotics & Drone IoT Lead",
                  email: "soumya@geeksunited.org",
                  linkedin: "https://linkedin.com",
                  social: "https://github.com",
                  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
                },
              ].map((member) => (
                <TiltCard3D
                  key={member.name}
                  showGrid={true}
                  className="p-7 flex flex-col items-center text-center h-full rounded-3xl"
                >
                  <div className="flex flex-col items-center w-full">
                    {/* Circular Avatar with Glowing Neon Halo on Hover */}
                    <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full mb-5 p-1 border-2 border-white/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_24px_rgba(0,240,255,0.85)] group-hover:scale-105 transition-all duration-300">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>

                    {/* Member Name with Vibrant Cyan Glow on Hover */}
                    <h3 className="font-space font-bold text-lg sm:text-xl text-white group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_14px_rgba(0,240,255,0.85)] transition-all duration-300">
                      {member.name}
                    </h3>

                    {/* Member Role / Domain */}
                    <div className="font-space text-xs sm:text-sm text-neutral-400 group-hover:text-cyan-200 transition-colors duration-300 mt-1">
                      {member.role}
                    </div>

                    {/* Subtle Horizontal Divider */}
                    <div className="w-full h-px bg-white/10 group-hover:bg-cyan-500/30 my-5 transition-colors duration-300" />

                    {/* 3 Frosted Circular Action Buttons: Email, LinkedIn, Social */}
                    <div className="flex items-center gap-3.5 justify-center w-full">
                      <a
                        href={`mailto:${member.email}`}
                        className="w-10 h-10 rounded-full border border-white/15 bg-black/50 flex items-center justify-center text-neutral-300 group-hover:border-cyan-500/40 hover:!border-cyan-400 hover:!text-cyan-300 hover:!bg-cyan-500/20 hover:!shadow-[0_0_16px_rgba(0,240,255,0.6)] transition-all duration-200 cursor-pointer"
                        title="Email"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-white/15 bg-black/50 flex items-center justify-center text-neutral-300 group-hover:border-cyan-500/40 hover:!border-cyan-400 hover:!text-cyan-300 hover:!bg-cyan-500/20 hover:!shadow-[0_0_16px_rgba(0,240,255,0.6)] transition-all duration-200 cursor-pointer"
                        title="LinkedIn"
                      >
                        <LinkedinIcon className="w-4 h-4" />
                      </a>
                      <a
                        href={member.social}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-white/15 bg-black/50 flex items-center justify-center text-neutral-300 group-hover:border-cyan-500/40 hover:!border-cyan-400 hover:!text-cyan-300 hover:!bg-cyan-500/20 hover:!shadow-[0_0_16px_rgba(0,240,255,0.6)] transition-all duration-200 cursor-pointer"
                        title="Social Profile"
                      >
                        <FacebookIcon className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: HOME ==================== */}
        {activeTab === "Home" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Real Club Welcome Banner with 3D Aesthetics */}
            <TiltCard3D className="p-8 sm:p-12">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-400 text-xs font-mono-cyber mb-4">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CAMPUS TECHNICAL SOCIETY // GEEKS UNITED</span>
                </div>
                <h2 className="font-orbitron text-2xl sm:text-4xl font-extrabold tracking-wide text-white mb-4 leading-tight">
                  We write code, build hardware, and win hackathons.
                </h2>
                <p className="font-space text-sm sm:text-base text-neutral-300 leading-relaxed mb-6">
                  Geeks United is the premier student-led technical community on campus. We bridge the gap between classroom theory and industry engineering through collaborative projects, drone workshops, algorithmic contests, and hackathons.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab("Events")}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-space font-bold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] cursor-pointer"
                  >
                    View Upcoming Events
                  </button>
                  <button
                    onClick={() => setActiveTab("Join Us")}
                    className="px-6 py-3 bg-[#0d1424] hover:bg-[#152038] text-white font-space font-medium text-xs rounded-lg border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer"
                  >
                    Apply for 2026 Cohort
                  </button>
                </div>
              </div>
            </TiltCard3D>

            {/* Highlights & Metrics with 3D Tilt (Scrolls Up & Down) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Student Members", val: "450+" },
                { label: "Inter-College Hackathon Wins", val: "28" },
                { label: "Hardware & Drone Prototypes", val: "14" },
                { label: "Hands-on Tech Workshops", val: "36" },
              ].map((s) => (
                <TiltCard3D key={s.label} className="p-6 text-center">
                  <div className="font-orbitron text-2xl sm:text-3xl font-extrabold text-cyan-400 mb-1 drop-shadow-[0_0_12px_rgba(0,240,255,0.5)]">
                    {s.val}
                  </div>
                  <div className="text-[11px] font-mono-cyber text-neutral-400 uppercase tracking-wider">{s.label}</div>
                </TiltCard3D>
              ))}
            </div>

            {/* Featured Student Repos with 3D Tilt */}
            <div className="space-y-4">
              <h3 className="font-orbitron text-lg font-bold text-white tracking-wide">Featured Community Repos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    name: "campus-nav-3d",
                    desc: "Interactive 3D indoor map of academic buildings with shortest path routing for freshers.",
                    stack: "Three.js • Next.js • Python",
                    stars: "142 stars",
                  },
                  {
                    name: "esp32-drone-telemetry",
                    desc: "Custom lightweight flight controller and telemetry dashboard built for quadcopter testing.",
                    stack: "C++ • FreeRTOS • WebSockets",
                    stars: "89 stars",
                  },
                  {
                    name: "geek-judge-bot",
                    desc: "Discord bot running sandboxed code execution for competitive programming practice.",
                    stack: "Go • Docker • SQLite",
                    stars: "215 stars",
                  },
                ].map((repo) => (
                  <TiltCard3D key={repo.name} className="p-6">
                    <div>
                      <div className="font-mono-cyber text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2 group-hover:text-cyan-200">
                        <Code className="w-4 h-4 text-cyan-400" />
                        <span>{repo.name}</span>
                      </div>
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans">{repo.desc}</p>
                    </div>
                    <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] font-mono-cyber text-neutral-400">
                      <span>{repo.stack}</span>
                      <span className="text-cyan-400 font-bold">{repo.stars}</span>
                    </div>
                  </TiltCard3D>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: ABOUT ==================== */}
        {activeTab === "About" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
                About Geeks United
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Founded in 2018 by college seniors passionate about peer-to-peer learning outside the regular syllabus.
              </p>
            </div>

            {/* Our Core Wings - 3D Tilt Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 pb-8">
              {[
                {
                  title: "Software & Open Source Wing",
                  icon: Code,
                  desc: "Building production web apps, command-line developer tools, and contributing to open-source software like Linux, Next.js, and Supabase.",
                },
                {
                  title: "Robotics & Drone IoT Wing",
                  icon: Cpu,
                  desc: "Hands-on microcontroller programming with ESP32 and Arduino. Building custom quadcopters, autonomous rovers, and sensor telemetry arrays.",
                },
                {
                  title: "Competitive Programming Wing",
                  icon: Terminal,
                  desc: "Weekly algorithm problem sets, Codeforces contests, ICPC regional preparation, and peer code reviews covering dynamic programming and graphs.",
                },
                {
                  title: "Machine Learning & Vision Wing",
                  icon: Layers,
                  desc: "Exploring PyTorch architectures, computer vision pipelines, open-weights LLMs, and real-time edge inference for student research projects.",
                },
                {
                  title: "Cybersecurity & CTF Wing",
                  icon: Radio,
                  desc: "Offensive security practice, reverse engineering, web exploitation, and representing our college in inter-university CTF competitions.",
                },
                {
                  title: "UI/UX & Creative Wing",
                  icon: Compass,
                  desc: "Crafting beautiful, accessible user interfaces, component design systems, motion graphics, and visual branding for hackathons.",
                },
              ].map((wing) => {
                const Icon = wing.icon;
                return (
                  <TiltCard3D key={wing.title} className="p-6 h-full">
                    <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 mb-4 group-hover:shadow-[0_0_16px_rgba(0,240,255,0.4)] transition-all inline-block w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-space font-bold text-base text-white mb-2 group-hover:text-cyan-300 transition-colors">
                      {wing.title}
                    </h3>
                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">{wing.desc}</p>
                  </TiltCard3D>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB: PAST MEMBERS ==================== */}
        {activeTab === "Past Members" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
                Alumni & Past Coordinators
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                See past club leaders who guided junior batches and are now working across top engineering teams.
              </p>
            </div>

            {/* Vertical Responsive Grid of 3D Tilt Alumni Cards (Scrolls Up & Down) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 pb-8">
              {[
                {
                  name: "Sayan Sen",
                  grad: "Batch of 2023 • CSE",
                  roleNow: "Software Engineer at Microsoft (Azure Cloud)",
                  avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
                  quote: "Geeks United was where I spent 80% of my college life. Fixing bugs with batchmates until 2 AM taught me more practical engineering than any lecture ever could.",
                },
                {
                  name: "Pooja Sharma",
                  grad: "Batch of 2024 • IT",
                  roleNow: "Frontend Engineer at Razorpay",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
                  quote: "Leading the UI and design wing taught me how to take a rough whiteboard sketch and turn it into polished production code that thousands of students used.",
                },
                {
                  name: "Subham Dey",
                  grad: "Batch of 2022 • ECE",
                  roleNow: "Robotics Engineer at Skyroot Aerospace",
                  avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
                  quote: "Building quadcopter flight stabilization controllers in the college lab in 2021 was the exact spark that launched my career in aerospace telemetry.",
                },
                {
                  name: "Aniket Ghosh",
                  grad: "Batch of 2023 • CSE",
                  roleNow: "Security Engineer at Palo Alto Networks",
                  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
                  quote: "Our weekend CTF war rooms were intense. The habit of auditing code line-by-line for vulnerabilities became second nature to me.",
                },
              ].map((alumni) => (
                <TiltCard3D
                  key={alumni.name}
                  showGrid={true}
                  className="p-6 h-full rounded-2xl"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-white/10 group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.7)] transition-all duration-300">
                        <img src={alumni.avatar} alt={alumni.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-space font-bold text-base text-white group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.7)] transition-all">{alumni.name}</h3>
                        <div className="text-[11px] font-mono-cyber text-cyan-400 font-semibold">{alumni.grad}</div>
                        <div className="text-[11px] text-neutral-400">{alumni.roleNow}</div>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-300 italic leading-relaxed font-sans pt-1 border-t border-white/5 group-hover:border-cyan-500/20 transition-colors">
                      "{alumni.quote}"
                    </p>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: PHOTO GALLERY ==================== */}
        {activeTab === "Photo Gallery" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
                Campus Moments & Hackathon Snaps
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Snapshots from our annual hackathon nights, lab workshops, and project showcases.
              </p>
            </div>

            {/* Vertical Responsive Grid of 3D Tilt Gallery Images (Scrolls Up & Down) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2 pb-8">
              {[
                {
                  title: "HackUnited 2025 Midnight Sprint",
                  sub: "Final 6 hours before judging, Lab 201",
                  img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
                },
                {
                  title: "Hands-on Microcontroller Soldering",
                  sub: "Freshers IoT & Drone Assembly Workshop",
                  img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                },
                {
                  title: "Smart India Hackathon Podium Victory",
                  sub: "1st place winners representing the college",
                  img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
                },
                {
                  title: "Induction Orientation in Auditorium",
                  sub: "Welcoming 200+ first-year student developers",
                  img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
                },
                {
                  title: "Late Night Code Reviews & Pizza",
                  sub: "Pre-fest deployment session",
                  img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
                },
                {
                  title: "Annual Tech Fest Exhibition",
                  sub: "Live quadcopter demonstration stall",
                  img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
                },
              ].map((pic) => (
                <TiltCard3D
                  key={pic.title}
                  className="aspect-[4/3] h-full"
                >
                  <img
                    src={pic.img}
                    alt={pic.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent flex flex-col justify-end p-4 rounded-lg">
                    <h3 className="font-space font-bold text-white text-sm group-hover:text-cyan-300 transition-colors">{pic.title}</h3>
                    <p className="text-[11px] text-cyan-300 font-mono-cyber mt-0.5">{pic.sub}</p>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: JOIN US ==================== */}
        {activeTab === "Join Us" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
                Join the Geeks United Cohort
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Open to all enrolled college students (1st, 2nd, and 3rd year). No gatekeeping—just genuine curiosity to build.
              </p>
            </div>

            <TiltCard3D className="max-w-2xl mx-auto p-8">
              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Thanks for applying! Check your college email for Discord onboarding link."); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">FULL NAME</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Suman Roy"
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">COLLEGE ROLL / EMAIL</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 12621001045 or college email"
                      className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">YEAR OF STUDY</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors">
                      <option>1st Year (Fresher)</option>
                      <option>2nd Year (Sophomore)</option>
                      <option>3rd Year (Junior)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">PRIMARY DOMAIN OF INTEREST</label>
                    <select className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors">
                      <option>Software & Web Development</option>
                      <option>Robotics, Drone IoT & Embedded Systems</option>
                      <option>Competitive Programming & DSA</option>
                      <option>Artificial Intelligence & Data Science</option>
                      <option>Cybersecurity & Ethical Hacking</option>
                      <option>UI/UX Design & Video Editing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">GITHUB / LEETCODE / PORTFOLIO LINK (OPTIONAL)</label>
                  <input
                    type="url"
                    placeholder="https://github.com/yourhandle"
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-cyber text-neutral-300 mb-1 tracking-wider">PROJECT EXPERIENCE OR WHAT YOU WANT TO BUILD</label>
                  <textarea
                    rows={3}
                    placeholder="Built a small Discord bot, wired up an Arduino LED circuit, or want to learn full-stack web dev..."
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-800 bg-[#060810] text-white text-xs focus:outline-none focus:border-cyan-400 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-space font-bold text-xs rounded-lg transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] cursor-pointer"
                >
                  Submit Application
                </button>
              </form>
            </TiltCard3D>
          </div>
        )}

        {/* ==================== TAB: CONTACT ==================== */}
        {activeTab === "Contact" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="border-b border-cyan-500/20 pb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-white tracking-wide">
                Get in Touch
              </h2>
              <p className="font-space text-sm text-neutral-400 mt-1 max-w-xl">
                Have questions about hackathon sponsorships, guest speaker sessions, or club inductions?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto pb-8">
              <TiltCard3D className="p-6 text-center">
                <Mail className="w-6 h-6 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-sm text-white mb-1">Email</h3>
                <p className="text-xs text-neutral-400 mb-2 font-sans">Official club correspondence</p>
                <a href="mailto:team@geeksunited.org" className="text-xs font-mono-cyber text-cyan-400 hover:underline">
                  team@geeksunited.org
                </a>
              </TiltCard3D>

              <TiltCard3D className="p-6 text-center">
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-sm text-white mb-1">Discord Server</h3>
                <p className="text-xs text-neutral-400 mb-2 font-sans">Active student discussions & doubts</p>
                <a href="https://discord.gg" target="_blank" rel="noreferrer" className="text-xs font-mono-cyber text-cyan-400 hover:underline">
                  discord.gg/geeksunited
                </a>
              </TiltCard3D>

              <TiltCard3D className="p-6 text-center">
                <MapPin className="w-6 h-6 text-cyan-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-space font-bold text-sm text-white mb-1">Campus Hub</h3>
                <p className="text-xs text-neutral-400 mb-2 font-sans">Student Activity Center</p>
                <span className="text-xs font-mono-cyber text-neutral-300">
                  SAC Room 204, Tech Wing
                </span>
              </TiltCard3D>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
