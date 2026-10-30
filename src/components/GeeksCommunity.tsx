"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { 
  Users, 
  Calendar, 
  Award, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  Camera, 
  Cpu, 
  ArrowUpRight,
  MessageSquare,
  CheckCircle2,
  Send,
  Terminal,
  Plus,
  X,
  Upload,
  Trash2,
  Filter,
  Image as ImageIcon,
  Shield,
  Edit3,
  LogOut,
  Lock,
  Eye,
  LogIn,
  ExternalLink,
  UserCheck,
  UserX,
  KeyRound,
  Bell,
  AlertTriangle,
  Check,
  UserPlus,
} from "lucide-react";
import {
  supabase,
  getEventsFromDb,
  insertEventToDb,
  deleteEventFromDb,
  insertJoinApplicationToDb,
  getJoinApplicationsFromDb,
  updateJoinApplicationStatusInDb,
  deleteJoinApplicationFromDb,
  insertContactMessageToDb,
  getCoordinatorsFromDb,
  upsertCoordinatorToDb,
  deleteCoordinatorFromDb,
  signInWithEmailPassword,
  signUpWithEmailPassword,
  signOutUser,
  isAuthorizedCoordinator,
  isMasterAdmin,
  MASTER_ADMIN_EMAIL,
  DbCoordinator,
  DbJoinApplication,
  DbCoordinatorRequest,
  submitCoordinatorRequest,
  getCoordinatorRequestsFromDb,
  updateCoordinatorRequestStatus,
  deleteCoordinatorRequestFromDb,
  getApprovedCoordinatorEmailsFromDb,
  compressImage,
} from "@/lib/supabase";

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

function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

/* ========================================================================= */
/* 1. HIGH-PERFORMANCE 3D WARP STARFIELD (GPU-ACCELERATED & BATCHED)        */
/* ========================================================================= */
const Cosmic3DStarfield = React.memo(function Cosmic3DStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    let animId: number;
    let isRunning = false;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Dynamic density: 110 stars on mobile, 220 on desktop
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const STAR_COUNT = isMobile ? 110 : 220;
    const MAX_DEPTH = 1100;
    const FOV = 320;
    const SPEED = 2.8;

    // Pre-render soft warm champagne glow sprite once
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 24;
    glowCanvas.height = 24;
    const gctx = glowCanvas.getContext("2d");
    if (gctx) {
      const g = gctx.createRadialGradient(12, 12, 0, 12, 12, 12);
      g.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      g.addColorStop(0.3, "rgba(232, 213, 181, 0.45)");
      g.addColorStop(0.8, "rgba(203, 178, 138, 0.12)");
      g.addColorStop(1, "transparent");
      gctx.fillStyle = g;
      gctx.beginPath();
      gctx.arc(12, 12, 12, 0, Math.PI * 2);
      gctx.fill();
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // RAF Throttled mouse parallax
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let mouseRafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseRafId) return;
      mouseRafId = requestAnimationFrame(() => {
        mouseRafId = 0;
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        mouse.targetX = (e.clientX - cx) * 0.06;
        mouse.targetY = (e.clientY - cy) * 0.06;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const starShades = [
      "#ffffff",
      "#faf6f0",
      "#f3e8d0",
      "#e8d5b5",
      "#d8c3a5",
      "#cbb28a",
    ];

    const stars: Array<{
      x: number;
      y: number;
      z: number;
      prevZ: number;
      speed: number;
      color: string;
      colorIdx: number;
      baseSize: number;
      brightness: number;
    }> = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      const z = Math.random() * MAX_DEPTH + 1;
      const colorIdx = Math.floor(Math.random() * starShades.length);
      stars.push({
        x: (Math.random() - 0.5) * 3600,
        y: (Math.random() - 0.5) * 3600,
        z: z,
        prevZ: z,
        speed: Math.random() * 2.8 + SPEED,
        color: starShades[colorIdx],
        colorIdx,
        baseSize: Math.random() * 1.3 + 0.4,
        brightness: Math.random() * 0.4 + 0.6,
      });
    }

    const render = () => {
      if (!isRunning) return;

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Obsidian deep background
      ctx.fillStyle = "#08080a";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2 + mouse.x;
      const cy = height / 2 + mouse.y;

      ctx.lineCap = "round";

      for (let i = 0; i < STAR_COUNT; i++) {
        const star = stars[i];

        star.prevZ = star.z;
        star.z -= star.speed;

        if (star.z <= 1) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 3600;
          star.y = (Math.random() - 0.5) * 3600;
          star.speed = Math.random() * 3.2 + SPEED;
        }

        const k = FOV / star.z;
        const sx = star.x * k + cx;
        const sy = star.y * k + cy;

        if (sx < -30 || sx > width + 30 || sy < -30 || sy > height + 30) {
          star.z = MAX_DEPTH;
          star.prevZ = MAX_DEPTH;
          star.x = (Math.random() - 0.5) * 3600;
          star.y = (Math.random() - 0.5) * 3600;
          continue;
        }

        const prevK = FOV / star.prevZ;
        const px = star.x * prevK + cx;
        const py = star.y * prevK + cy;

        const depthRatio = 1 - star.z / MAX_DEPTH;
        const alpha = Math.min(1, Math.max(0.18, depthRatio * 1.5 * star.brightness));
        const currentSize = Math.max(0.6, depthRatio * star.baseSize * 2.2);

        // Single optimized stroke call per star with rounded caps
        ctx.strokeStyle = star.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = currentSize;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Sprite bloom for near stars
        if (star.z < 200) {
          const glowRad = currentSize * 2.4;
          ctx.globalAlpha = alpha * 0.45;
          ctx.drawImage(glowCanvas, sx - glowRad, sy - glowRad, glowRad * 2, glowRad * 2);
        }
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    // Pause RAF when community section is scrolled out of viewport
    const communitySection = document.getElementById("community-section");
    let observer: IntersectionObserver | null = null;

    if (communitySection && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (!isRunning) {
              isRunning = true;
              animId = requestAnimationFrame(render);
            }
          } else {
            setIsVisible(false);
            isRunning = false;
            cancelAnimationFrame(animId);
          }
        },
        { rootMargin: "150px" }
      );
      observer.observe(communitySection);
    } else {
      isRunning = true;
      setIsVisible(true);
      animId = requestAnimationFrame(render);
    }

    // Auto-sleep when tab is hidden or minimized
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(animId);
      } else if (isVisible) {
        isRunning = true;
        animId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animId);
      if (mouseRafId) cancelAnimationFrame(mouseRafId);
      if (observer) observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVisible]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.4s ease",
        willChange: "opacity",
      }}
    />
  );
});

/* ========================================================================= */
/* 2. ZERO-REFLOW 3D PERSPECTIVE TILT CARD (CACHED RECT + MEMOIZED)          */
/* ========================================================================= */
const TiltCard3D = React.memo(function TiltCard3D({
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
  const specularRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const cachedRectRef = useRef<DOMRect | null>(null);

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cachedRectRef.current = cardRef.current.getBoundingClientRect();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cachedRectRef.current || cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6.5;
    const rotateY = ((x - centerX) / centerX) * 6.5;

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => {
      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
      }
      if (specularRef.current) {
        specularRef.current.style.background = `radial-gradient(circle 260px at ${x}px ${y}px, rgba(232, 213, 181, 0.14), transparent 70%)`;
      }
    });
  };

  const handleMouseLeave = () => {
    cachedRectRef.current = null;
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    }
    if (specularRef.current) {
      specularRef.current.style.background = "none";
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
        transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative group rounded-2xl border border-white/[0.07] bg-[#101013] hover:border-[#E8D5B5]/40 shadow-[0_8px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_16px_50px_rgba(0,0,0,0.95),0_0_25px_rgba(232,213,181,0.08)] cursor-pointer overflow-hidden transition-colors ${className}`}
    >
      {/* Dynamic Specular Light Layer */}
      <div
        ref={specularRef}
        className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-10"
        style={{ background: "none" }}
      />

      {/* Luxury Shimmer Beam */}
      <div className="luxury-shimmer z-20" />

      {/* Card Content */}
      <div style={{ transform: "translateZ(15px)" }} className="relative z-30 h-full flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
});

/* ========================================================================= */
/* DEFAULT SEED COORDINATORS (3 TEACHERS + 6 STUDENTS)                     */
/* ========================================================================= */
const DEFAULT_COORDINATORS: DbCoordinator[] = [
  // 3 Faculty Coordinators
  {
    id: "teacher-1",
    type: "teacher",
    name: "Dr. Subhashish Roy",
    role: "Chief Faculty Coordinator",
    dept_or_domain: "Dept. of Computer Science & Engineering",
    email: "subhashish.roy@college.edu",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    bio: "Guiding student initiatives in distributed systems, AI labs, and national hackathon delegations.",
    display_order: 1,
  },
  {
    id: "teacher-2",
    type: "teacher",
    name: "Prof. Debolina Banerjee",
    role: "Faculty Coordinator (Hardware & IoT)",
    dept_or_domain: "Dept. of Electronics & Communication",
    email: "debolina.banerjee@college.edu",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80",
    bio: "Overseeing robotics avionics, drone hardware testbenches, and embedded telemetry projects.",
    display_order: 2,
  },
  {
    id: "teacher-3",
    type: "teacher",
    name: "Dr. Arindam Mukherjee",
    role: "Faculty Mentor (Competitive & Research)",
    dept_or_domain: "Dept. of Information Technology",
    email: "arindam.mukherjee@college.edu",
    linkedin: "https://linkedin.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    bio: "Mentoring students in algorithmic contests, academic research publications, and open-source systems.",
    display_order: 3,
  },
  // 6 Student Coordinators
  {
    id: "student-1",
    type: "student",
    name: "ANANYO DASGUPTA",
    role: "Lead Student Coordinator",
    dept_or_domain: "Core Leadership & Hackathon Lead",
    email: "ananyo@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80",
    display_order: 4,
  },
  {
    id: "student-2",
    type: "student",
    name: "AVIJNAN PURKAIT",
    role: "Technical Coordinator",
    dept_or_domain: "Systems Architecture & Cloud Infra",
    email: "avijnan@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80",
    display_order: 5,
  },
  {
    id: "student-3",
    type: "student",
    name: "SAYAN GHANTY",
    role: "Core Coordinator & Software Lead",
    dept_or_domain: "Full-Stack Web & Platform Systems",
    email: "sayan@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=500&auto=format&fit=crop&q=80",
    display_order: 6,
  },
  {
    id: "student-4",
    type: "student",
    name: "ANVESHA",
    role: "Public Relations Coordinator",
    dept_or_domain: "Sponsorships, Branding & Media",
    email: "anvesha@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    display_order: 7,
  },
  {
    id: "student-5",
    type: "student",
    name: "ANAKANA BANU",
    role: "Events & Operations Coordinator",
    dept_or_domain: "Hackathon Logistics & Community",
    email: "anakana@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    display_order: 8,
  },
  {
    id: "student-6",
    type: "student",
    name: "SAPTARSHI KAR",
    role: "Hardware & Robotics Coordinator",
    dept_or_domain: "Drone Telemetry & Embedded IoT",
    email: "saptarshi@geeksunited.org",
    linkedin: "https://linkedin.com",
    social: "https://github.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80",
    display_order: 9,
  },
];

/* ========================================================================= */
/* 3. MAIN GEEKS COMMUNITY HUB: TABS (EVENTS, GALLERY, TEAM, JOIN US, CONTACT)*/
/* ========================================================================= */
export default function GeeksCommunity() {
  type TabType = "EVENTS" | "GALLERY" | "TEAM" | "JOIN US" | "CONTACT";
  const tabs: TabType[] = ["EVENTS", "GALLERY", "TEAM", "JOIN US", "CONTACT"];

  const [activeTab, setActiveTab] = useState<TabType>("EVENTS");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isContactSubmitted, setIsContactSubmitted] = useState<boolean>(false);

  /* Coordinator Authentication & Admin Approval State */
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const [approvedCoordinators, setApprovedCoordinators] = useState<string[]>([
    MASTER_ADMIN_EMAIL.toLowerCase(),
  ]);
  const [coordRequests, setCoordRequests] = useState<DbCoordinatorRequest[]>([]);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestFilter, setRequestFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "request" | "signup">("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [authSuccessMsg, setAuthSuccessMsg] = useState("");

  /* Request Access Form State */
  const [reqName, setReqName] = useState("");
  const [reqEmail, setReqEmail] = useState("");
  const [reqPhone, setReqPhone] = useState("");
  const [reqRole, setReqRole] = useState("Student Coordinator");
  const [reqReason, setReqReason] = useState("");
  const [reqSubmitting, setReqSubmitting] = useState(false);

  /* Authorization Checks */
  const isCoordinator = isAuthorizedCoordinator(currentUserEmail, approvedCoordinators);
  const isAdmin = isMasterAdmin(currentUserEmail);
  const pendingRequestsCount = coordRequests.filter((r) => r.status === "pending").length;

  /* Coordinators State & Sync with Supabase */
  const [coordinators, setCoordinators] = useState<DbCoordinator[]>(DEFAULT_COORDINATORS);
  const [isCoordModalOpen, setIsCoordModalOpen] = useState(false);
  const [editingCoordId, setEditingCoordId] = useState<string | null>(null);

  /* Coordinator Modal Inputs */
  const [coordType, setCoordType] = useState<"teacher" | "student">("student");
  const [coordName, setCoordName] = useState("");
  const [coordRole, setCoordRole] = useState("");
  const [coordDept, setCoordDept] = useState("");
  const [coordEmail, setCoordEmail] = useState("");
  const [coordLinkedin, setCoordLinkedin] = useState("");
  const [coordSocial, setCoordSocial] = useState("");
  const [coordAvatar, setCoordAvatar] = useState("");
  const [coordBio, setCoordBio] = useState("");
  const [coordAvatarError, setCoordAvatarError] = useState("");

  /* Join Applications Review for Coordinators */
  const [joinViewMode, setJoinViewMode] = useState<"apply" | "review">("apply");
  const [applicantList, setApplicantList] = useState<DbJoinApplication[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

  /* Join Us Form State */
  const [joinName, setJoinName] = useState("");
  const [joinEmail, setJoinEmail] = useState("");
  const [joinYear, setJoinYear] = useState("1st Year (Fresher)");
  const [joinDomain, setJoinDomain] = useState("Software & Web Development");
  const [joinPortfolio, setJoinPortfolio] = useState("");
  const [joinSubmitting, setJoinSubmitting] = useState(false);

  /* Contact Relay Form State */
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);

  /* Event Item Interface */
  interface EventItem {
    id: string;
    title: string;
    category: "ongoing" | "upcoming" | "previous";
    date: string;
    venue: string;
    perk?: string;
    desc: string;
    photo?: string;
    tag?: string;
    createdAt?: number;
  }

  /* Events State - Initially Keep No Events */
  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventFilter, setEventFilter] = useState<"ALL" | "ONGOING" | "UPCOMING" | "PREVIOUS">("ALL");
  const [isAddEventOpen, setIsAddEventOpen] = useState<boolean>(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  /* Modal Form State for Adding/Editing an Event */
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<"ongoing" | "upcoming" | "previous">("upcoming");
  const [formDate, setFormDate] = useState("");
  const [formVenue, setFormVenue] = useState("");
  const [formTag, setFormTag] = useState("HACKATHON");
  const [formPerk, setFormPerk] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPhoto, setFormPhoto] = useState<string>("");
  const [photoError, setPhotoError] = useState("");

  /* Auth Session Detection & Coordinator Approval Sync on Mount */
  useEffect(() => {
    // 1. Check local session cache
    const savedEmail = localStorage.getItem("geeks_active_coordinator");
    if (savedEmail) {
      setCurrentUserEmail(savedEmail);
    }

    // 2. Check Supabase auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email);
        localStorage.setItem("geeks_active_coordinator", session.user.email);
      }
    });

    const { data: authSub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email) {
        setCurrentUserEmail(session.user.email);
        localStorage.setItem("geeks_active_coordinator", session.user.email);
      } else if (!localStorage.getItem("geeks_active_coordinator")) {
        setCurrentUserEmail(null);
      }
    });

    // 3. Sync list of approved coordinator emails from Supabase
    getApprovedCoordinatorEmailsFromDb().then((emails) => {
      if (emails && emails.length > 0) {
        setApprovedCoordinators(emails);
      }
    });

    // 4. Fetch coordinator access requests
    getCoordinatorRequestsFromDb().then(({ data }) => {
      if (data) {
        setCoordRequests(data);
      }
    });

    return () => {
      authSub.subscription.unsubscribe();
    };
  }, []);

  /* ============================================================== */
  /* UNIVERSAL REAL-TIME DATABASE SYNC (CHANGES APPLY TO ALL USERS) */
  /* ============================================================== */

  const fetchEventsFromDatabase = useCallback(async () => {
    try {
      const { data, error } = await getEventsFromDb();
      if (!error && data !== null) {
        setEvents(data);
        try {
          localStorage.setItem("geeks_united_events_v2", JSON.stringify(data));
        } catch (_) {}
      }
    } catch (err) {
      console.warn("Failed to fetch events from database:", err);
    }
  }, []);

  const fetchCoordinatorsFromDatabase = useCallback(async () => {
    try {
      const { data, error } = await getCoordinatorsFromDb();
      if (!error && data && data.length > 0) {
        setCoordinators(data);
        try {
          localStorage.setItem("geeks_coordinators_v1", JSON.stringify(data));
        } catch (_) {}
      } else if (!error && (!data || data.length === 0)) {
        // Seed default coordinators to Supabase so all new viewers see the team
        for (const c of DEFAULT_COORDINATORS) {
          await upsertCoordinatorToDb(c);
        }
        setCoordinators(DEFAULT_COORDINATORS);
      }
    } catch (err) {
      console.warn("Failed to fetch coordinators from database:", err);
    }
  }, []);

  /* Universal Realtime WebSockets, Cross-Tab Broadcast & Polling */
  useEffect(() => {
    // 1. Initial immediate database sync
    fetchEventsFromDatabase();
    fetchCoordinatorsFromDatabase();

    // 2. Real-time Supabase WebSocket Channel (Instantly updates all viewers when any coordinator makes a change)
    const liveSyncChannel = supabase
      .channel("geeks-live-sync-all")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          fetchEventsFromDatabase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "coordinators" },
        () => {
          fetchCoordinatorsFromDatabase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "coordinator_requests" },
        () => {
          loadCoordinatorRequests();
        }
      )
      .subscribe();

    // 3. Same-browser Cross-Tab Broadcast Channel (0ms instant sync across tabs)
    let broadcast: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        broadcast = new BroadcastChannel("geeks_community_sync");
        broadcast.onmessage = (msg) => {
          if (msg.data === "sync_events") fetchEventsFromDatabase();
          if (msg.data === "sync_coordinators") fetchCoordinatorsFromDatabase();
        };
      }
    } catch (_) {}

    // 4. Window Focus Re-sync (Syncs whenever user switches back to this tab)
    const handleWindowFocus = () => {
      fetchEventsFromDatabase();
      fetchCoordinatorsFromDatabase();
    };
    window.addEventListener("focus", handleWindowFocus);

    // 5. Periodic Background Polling (Syncs every 6 seconds as a bulletproof network fallback)
    const pollInterval = setInterval(() => {
      fetchEventsFromDatabase();
      fetchCoordinatorsFromDatabase();
    }, 6000);

    return () => {
      liveSyncChannel.unsubscribe();
      if (broadcast) broadcast.close();
      window.removeEventListener("focus", handleWindowFocus);
      clearInterval(pollInterval);
    };
  }, [fetchEventsFromDatabase, fetchCoordinatorsFromDatabase]);

  const saveEvents = (updated: EventItem[]) => {
    setEvents(updated);
    try {
      localStorage.setItem("geeks_united_events_v2", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save events to storage", e);
    }
  };

  const saveCoordinators = (updated: DbCoordinator[]) => {
    setCoordinators(updated);
    try {
      localStorage.setItem("geeks_coordinators_v1", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save coordinators to storage", e);
    }
  };

  /* Event Handlers */
  const openCreateEventModal = () => {
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingEventId(null);
    setFormTitle("");
    setFormCategory("upcoming");
    setFormDate("");
    setFormVenue("");
    setFormTag("HACKATHON");
    setFormPerk("");
    setFormDesc("");
    setFormPhoto("");
    setPhotoError("");
    setIsAddEventOpen(true);
  };

  const openEditEventModal = (ev: EventItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingEventId(ev.id);
    setFormTitle(ev.title);
    setFormCategory(ev.category);
    setFormDate(ev.date);
    setFormVenue(ev.venue);
    setFormTag(ev.tag || "HACKATHON");
    setFormPerk(ev.perk || "");
    setFormDesc(ev.desc);
    setFormPhoto(ev.photo || "");
    setPhotoError("");
    setIsAddEventOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setPhotoError("Image size must be under 10MB");
      return;
    }
    setPhotoError("");
    try {
      // Auto-compress photo to clean WebP/JPEG under 100KB for instant Supabase sync
      const compressed = await compressImage(file, 1000, 0.75);
      setFormPhoto(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setFormPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDesc.trim()) return;

    const newEv: EventItem = {
      id: editingEventId || `ev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: formTitle.trim(),
      category: formCategory,
      date: formDate.trim() || "TBA",
      venue: formVenue.trim() || "Campus Hub / Online",
      perk: formPerk.trim() || undefined,
      desc: formDesc.trim(),
      photo: formPhoto.trim() || undefined,
      tag: formTag.trim() || "TECH EVENT",
    };

    // Optimistic local update
    let updatedEvents: EventItem[];
    if (editingEventId) {
      updatedEvents = events.map((ev) => (ev.id === editingEventId ? newEv : ev));
    } else {
      updatedEvents = [newEv, ...events];
    }
    saveEvents(updatedEvents);

    // Universal Database Sync to Supabase
    const { error } = await insertEventToDb(newEv);
    if (error) {
      alert("Error saving event to shared database: " + (error.message || JSON.stringify(error)));
      return;
    }

    // Refresh directly from database to ensure all fields are synchronized
    await fetchEventsFromDatabase();

    // Broadcast change to other open browser tabs
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("geeks_community_sync");
        bc.postMessage("sync_events");
        bc.close();
      }
    } catch (_) {}

    // Reset modal
    setEditingEventId(null);
    setFormTitle("");
    setFormCategory("upcoming");
    setFormDate("");
    setFormVenue("");
    setFormTag("HACKATHON");
    setFormPerk("");
    setFormDesc("");
    setFormPhoto("");
    setPhotoError("");
    setIsAddEventOpen(false);
  };

  const handleDeleteEvent = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    if (confirm("Are you sure you want to remove this event?")) {
      const remaining = events.filter((ev) => ev.id !== id);
      saveEvents(remaining);
      const { error } = await deleteEventFromDb(id);
      if (error) {
        alert("Error deleting event from shared database: " + (error.message || JSON.stringify(error)));
        return;
      }
      await fetchEventsFromDatabase();

      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const bc = new BroadcastChannel("geeks_community_sync");
          bc.postMessage("sync_events");
          bc.close();
        }
      } catch (_) {}
    }
  };

  /* Coordinator Modal Handlers */
  const openCreateCoordModal = () => {
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingCoordId(null);
    setCoordType("student");
    setCoordName("");
    setCoordRole("");
    setCoordDept("");
    setCoordEmail("");
    setCoordLinkedin("https://linkedin.com");
    setCoordSocial("https://github.com");
    setCoordAvatar("");
    setCoordBio("");
    setCoordAvatarError("");
    setIsCoordModalOpen(true);
  };

  const openEditCoordModal = (coord: DbCoordinator, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setEditingCoordId(coord.id);
    setCoordType(coord.type);
    setCoordName(coord.name);
    setCoordRole(coord.role);
    setCoordDept(coord.dept_or_domain);
    setCoordEmail(coord.email);
    setCoordLinkedin(coord.linkedin || "");
    setCoordSocial(coord.social || "");
    setCoordAvatar(coord.avatar || "");
    setCoordBio(coord.bio || "");
    setCoordAvatarError("");
    setIsCoordModalOpen(true);
  };

  const handleCoordPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setCoordAvatarError("Photo must be less than 10MB");
      return;
    }
    setCoordAvatarError("");
    try {
      // Auto-compress avatar photo for instant Supabase sync
      const compressed = await compressImage(file, 800, 0.75);
      setCoordAvatar(compressed);
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCoordAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCoordinator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordName.trim() || !coordRole.trim()) return;

    const item: DbCoordinator = {
      id: editingCoordId || `coord-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: coordType,
      name: coordName.trim(),
      role: coordRole.trim(),
      dept_or_domain: coordDept.trim() || (coordType === "teacher" ? "Dept. of CSE" : "Technical Lead"),
      email: coordEmail.trim() || "coordinator@college.edu",
      linkedin: coordLinkedin.trim() || undefined,
      social: coordSocial.trim() || undefined,
      avatar: coordAvatar.trim() || (coordType === "teacher" 
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80" 
        : "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80"),
      bio: coordBio.trim() || undefined,
      display_order: editingCoordId
        ? (coordinators.find((c) => c.id === editingCoordId)?.display_order ?? 0)
        : coordinators.length + 1,
    };

    let updated: DbCoordinator[];
    if (editingCoordId) {
      updated = coordinators.map((c) => (c.id === editingCoordId ? item : c));
    } else {
      updated = [...coordinators, item];
    }

    saveCoordinators(updated);

    // Save to Supabase (Universal shared database)
    const { error } = await upsertCoordinatorToDb(item);
    if (error) {
      alert("Error saving coordinator to shared database: " + (error.message || JSON.stringify(error)));
      return;
    }

    // Refresh directly from database to ensure all fields are synchronized
    await fetchCoordinatorsFromDatabase();

    // Broadcast change to other open browser tabs
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        const bc = new BroadcastChannel("geeks_community_sync");
        bc.postMessage("sync_coordinators");
        bc.close();
      }
    } catch (_) {}

    setIsCoordModalOpen(false);
  };

  const handleDeleteCoordinator = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    if (confirm("Are you sure you want to remove this coordinator?")) {
      const remaining = coordinators.filter((c) => c.id !== id);
      saveCoordinators(remaining);
      const { error } = await deleteCoordinatorFromDb(id);
      if (error) {
        alert("Error deleting coordinator from shared database: " + (error.message || JSON.stringify(error)));
        return;
      }
      await fetchCoordinatorsFromDatabase();

      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const bc = new BroadcastChannel("geeks_community_sync");
          bc.postMessage("sync_coordinators");
          bc.close();
        }
      } catch (_) {}
    }
  };

  /* Join Application Submit to Supabase */
  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setJoinSubmitting(true);
    await insertJoinApplicationToDb({
      full_name: joinName,
      college_email: joinEmail,
      year_of_study: joinYear,
      primary_domain: joinDomain,
      portfolio_link: joinPortfolio || undefined,
    });
    setJoinSubmitting(false);
    setIsSubmitted(true);
  };

  /* Contact Message Submit to Supabase */
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);
    await insertContactMessageToDb({
      name: contactName,
      email: contactEmail,
      subject: contactSubject,
      message: contactMessage,
    });
    setContactSubmitting(false);
    setIsContactSubmitted(true);
  };

  /* Load Applicants for Coordinator */
  const handleToggleReviewMode = async (mode: "apply" | "review") => {
    if (mode === "review" && !isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setJoinViewMode(mode);
    if (mode === "review") {
      setIsLoadingApplicants(true);
      const { data } = await getJoinApplicationsFromDb();
      if (data) {
        setApplicantList(data);
      }
      setIsLoadingApplicants(false);
    }
  };

  const handleUpdateApplicantStatus = async (id?: string, newStatus?: string) => {
    if (!id || !newStatus) return;
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    setApplicantList((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    await updateJoinApplicationStatusInDb(id, newStatus);
  };

  const handleDeleteApplicant = async (id?: string) => {
    if (!id) return;
    if (!isCoordinator) {
      setIsLoginModalOpen(true);
      return;
    }
    if (confirm("Are you sure you want to remove this candidate application?")) {
      setApplicantList((prev) => prev.filter((app) => app.id !== id));
      await deleteJoinApplicationFromDb(id);
    }
  };

  /* Refresh Coordinator Requests & Approved List */
  const loadCoordinatorRequests = async () => {
    setIsLoadingRequests(true);
    const { data } = await getCoordinatorRequestsFromDb();
    if (data) {
      setCoordRequests(data);
    }
    const emails = await getApprovedCoordinatorEmailsFromDb();
    if (emails) {
      setApprovedCoordinators(emails);
    }
    setIsLoadingRequests(false);
  };

  /* Admin Approves Request */
  const handleApproveRequest = async (req: DbCoordinatorRequest) => {
    if (!req.id) return;
    const adminEmail = currentUserEmail || MASTER_ADMIN_EMAIL;
    await updateCoordinatorRequestStatus(req.id, "approved", adminEmail);
    const cleanEmail = req.email.trim().toLowerCase();
    setCoordRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "approved" } : r))
    );
    setApprovedCoordinators((prev) =>
      prev.includes(cleanEmail) ? prev : [...prev, cleanEmail]
    );
  };

  /* Admin Rejects Request */
  const handleRejectRequest = async (req: DbCoordinatorRequest) => {
    if (!req.id) return;
    const adminEmail = currentUserEmail || MASTER_ADMIN_EMAIL;
    await updateCoordinatorRequestStatus(req.id, "rejected", adminEmail);
    const cleanEmail = req.email.trim().toLowerCase();
    setCoordRequests((prev) =>
      prev.map((r) => (r.id === req.id ? { ...r, status: "rejected" } : r))
    );
    setApprovedCoordinators((prev) => prev.filter((e) => e !== cleanEmail));
  };

  /* Admin Deletes Request */
  const handleDeleteRequest = async (id?: string) => {
    if (!id) return;
    if (confirm("Are you sure you want to remove this coordinator request?")) {
      await deleteCoordinatorRequestFromDb(id);
      setCoordRequests((prev) => prev.filter((r) => r.id !== id));
    }
  };

  /* User Submits Request for Coordinator Access */
  const handleSubmitAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqName.trim() || !reqEmail.trim() || !reqReason.trim()) {
      setAuthError("Please provide your Name, Email, and Reason for coordinator access.");
      return;
    }
    setReqSubmitting(true);
    setAuthError("");
    setAuthSuccessMsg("");

    const { error } = await submitCoordinatorRequest({
      name: reqName.trim(),
      email: reqEmail.trim(),
      phone: reqPhone.trim(),
      role_requested: reqRole,
      reason: reqReason.trim(),
    });

    setReqSubmitting(false);
    if (error) {
      setAuthError(error.message || "Failed to submit request.");
    } else {
      setAuthSuccessMsg(
        "Request dispatched! A notification was routed to the administrator for review. Your coordinator rights will only be active after explicit approval."
      );
      setReqName("");
      setReqEmail("");
      setReqPhone("");
      setReqReason("");
      loadCoordinatorRequests();
    }
  };

  /* Supabase Manual Email & Password Authentication */
  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError("Please provide both email and password.");
      return;
    }

    setAuthLoading(true);
    setAuthError("");
    setAuthSuccessMsg("");

    if (authTab === "signin") {
      const { data, error } = await signInWithEmailPassword(loginEmail, loginPassword);
      if (error) {
        if (error.message?.toLowerCase().includes("invalid login credentials")) {
          setAuthError("Invalid credentials. If this email does not have a password set yet, use the 'Create Account' tab or 'Request Access' tab.");
        } else {
          setAuthError(error.message);
        }
        setAuthLoading(false);
        return;
      }
      if (data?.user?.email) {
        const userEmail = data.user.email.toLowerCase();
        setCurrentUserEmail(userEmail);
        localStorage.setItem("geeks_active_coordinator", userEmail);

        // Fetch latest approved coordinators from DB
        const latestApproved = await getApprovedCoordinatorEmailsFromDb();
        setApprovedCoordinators(latestApproved);

        const authorized = isAuthorizedCoordinator(userEmail, latestApproved);
        if (!authorized) {
          // Log an access request for them automatically
          await submitCoordinatorRequest({
            name: userEmail.split("@")[0],
            email: userEmail,
            role_requested: "Pending Coordinator Applicant",
            reason: "User signed in; awaiting administrator approval for editing rights.",
          });
          loadCoordinatorRequests();
          setAuthError(
            `ACCESS PENDING ADMIN APPROVAL: An access request notification has been sent to Master Admin (${MASTER_ADMIN_EMAIL}). You cannot edit website content until approved.`
          );
          setAuthLoading(false);
          return;
        }

        setIsLoginModalOpen(false);
        setLoginPassword("");
        setAuthError("");
      }
    } else if (authTab === "signup") {
      // Sign-up mode
      const { data, error } = await signUpWithEmailPassword(loginEmail, loginPassword);
      if (error) {
        setAuthError(error.message);
        setAuthLoading(false);
        return;
      }
      if (data?.user?.email) {
        const userEmail = data.user.email.toLowerCase();
        setCurrentUserEmail(userEmail);
        localStorage.setItem("geeks_active_coordinator", userEmail);

        // Automatically dispatch coordinator request to admin
        await submitCoordinatorRequest({
          name: userEmail.split("@")[0],
          email: userEmail,
          role_requested: "New Coordinator Applicant",
          reason: "Account created via Supabase portal; requesting coordinator permissions.",
        });
        loadCoordinatorRequests();

        setAuthSuccessMsg(
          `Account registered! An access message has been sent to Master Admin (${MASTER_ADMIN_EMAIL}). Editing rights will be granted once the admin approves.`
        );
        setLoginPassword("");
      } else {
        setAuthError("Registration submitted. Please check your email for Supabase confirmation.");
      }
    }
    setAuthLoading(false);
  };

  const handleSignOutCoordinator = async () => {
    await signOutUser();
    localStorage.removeItem("geeks_active_coordinator");
    setCurrentUserEmail(null);
  };

  const ongoingEvents = useMemo<EventItem[]>(() => events.filter((e) => e.category === "ongoing"), [events]);
  const upcomingEvents = useMemo<EventItem[]>(() => events.filter((e) => e.category === "upcoming"), [events]);
  const previousEvents = useMemo<EventItem[]>(() => events.filter((e) => e.category === "previous"), [events]);

  const teacherCoordinators = useMemo<DbCoordinator[]>(() => coordinators.filter((c) => c.type === "teacher"), [coordinators]);
  const studentCoordinators = useMemo<DbCoordinator[]>(() => coordinators.filter((c) => c.type === "student"), [coordinators]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    const commSec = document.getElementById("community-section");
    if (commSec) {
      const navOffset = 70;
      const pos = commSec.getBoundingClientRect().top + window.scrollY;
      if (window.scrollY > pos) {
        window.scrollTo({
          top: pos - navOffset,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <section 
      id="community-section" 
      className="relative w-full bg-[#08080a] text-neutral-100 min-h-screen pb-28 overflow-x-clip selection:bg-[#E8D5B5]/25 selection:text-[#FAF6F0]"
    >
      {/* 1. LIGHTWEIGHT 3D HYPERSPACE CANVAS */}
      <Cosmic3DStarfield />

      {/* ============================================================== */}
      {/* HORIZONTAL STICKY NAVBAR WITH BRAND & TABS (LUXURY EDITORIAL)   */}
      {/* ============================================================== */}
      <div className="sticky top-0 z-40 w-full bg-[#08080a]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-18 gap-4 relative z-10">
          
          {/* Left: Geeks United Logo + Brand Name */}
          <div 
            onClick={() => handleTabChange("EVENTS")}
            className="flex items-center gap-3 shrink-0 cursor-pointer group select-none"
          >
            <div className="relative w-8 h-8 rounded-full bg-[#121215] border border-[#E8D5B5]/40 group-hover:border-[#E8D5B5] flex items-center justify-center overflow-hidden p-1 shadow-[0_0_15px_rgba(232,213,181,0.15)] group-hover:shadow-[0_0_22px_rgba(232,213,181,0.35)] transition-all duration-300">
              <span className="font-serif italic font-bold text-[#E8D5B5] text-xs">gu.</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-sans font-medium tracking-tight text-base sm:text-lg text-white">
                GEEKS
              </span>
              <span className="font-serif italic font-normal text-base sm:text-lg text-[#E8D5B5]">
                UNITED
              </span>
            </div>
          </div>

          {/* Right: Tab Navigation + Coordinator Auth */}
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar py-1">
            <div className="flex items-center gap-1 sm:gap-2">
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`relative px-3.5 py-2 text-xs sm:text-sm font-sans font-medium tracking-wider transition-all duration-200 cursor-pointer select-none whitespace-nowrap rounded-full ${
                      isActive
                        ? "text-[#FAF6F0] bg-[#161619] border border-[#E8D5B5]/30 shadow-[0_0_15px_rgba(232,213,181,0.12)]"
                        : "text-[#8E8A84] hover:text-[#FAF6F0] hover:bg-white/[0.04] border border-transparent"
                    }`}
                  >
                    <span className="relative z-10">{tab}</span>
                    {isActive && (
                      <div className="absolute -bottom-[10px] left-3 right-3 h-[2px] bg-[#E8D5B5] shadow-[0_0_10px_#E8D5B5]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Coordinator & Master Admin Auth Controls */}
            {currentUserEmail ? (
              <div className="flex items-center gap-2 shrink-0 pl-2 border-l border-white/[0.08]">
                {isAdmin ? (
                  <>
                    <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8D5B5]/40 bg-[#161619] text-[#E8D5B5] text-xs font-mono shadow-[0_0_15px_rgba(232,213,181,0.15)]">
                      <Shield className="w-3.5 h-3.5 text-[#E8D5B5]" />
                      <span className="truncate max-w-[140px] text-white">{currentUserEmail}</span>
                      <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#E8D5B5] text-[#0a0a0c] font-bold tracking-wider">
                        MASTER ADMIN
                      </span>
                    </div>

                    {/* Admin Access Requests Review Button with Badge */}
                    <button
                      onClick={() => {
                        loadCoordinatorRequests();
                        setIsRequestsModalOpen(true);
                      }}
                      className="relative px-3.5 py-1.5 rounded-full border border-[#E8D5B5]/40 bg-[#161619] hover:bg-[#201f24] text-[#E8D5B5] text-xs font-mono flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(232,213,181,0.15)] cursor-pointer"
                      title="Manage Coordinator Access Requests"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#E8D5B5]" />
                      <span className="hidden sm:inline">REQUESTS</span>
                      {pendingRequestsCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#E8D5B5] text-[#0a0a0c] text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                          {pendingRequestsCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : isCoordinator ? (
                  <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#E8D5B5]/30 bg-[#161619] text-[#E8D5B5] text-xs font-mono shadow-[0_0_12px_rgba(232,213,181,0.1)]">
                    <Shield className="w-3.5 h-3.5 text-[#E8D5B5]" />
                    <span className="truncate max-w-[140px] text-white">{currentUserEmail}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-[#E8D5B5] text-[#0a0a0c] font-bold tracking-wider">
                      COORDINATOR
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-950/40 text-amber-300 text-xs font-mono shadow-[0_0_12px_rgba(245,158,11,0.2)]">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="truncate max-w-[120px]">{currentUserEmail}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-amber-400 text-black font-extrabold tracking-wider">
                      APPROVAL PENDING
                    </span>
                  </div>
                )}

                <button
                  onClick={handleSignOutCoordinator}
                  className="px-3 py-1.5 rounded-full border border-white/[0.1] bg-[#121215] hover:bg-red-950/40 hover:text-red-300 text-[#8E8A84] text-xs font-sans flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthTab("signin");
                  setIsLoginModalOpen(true);
                  setAuthError("");
                  setAuthSuccessMsg("");
                }}
                className="px-5 py-2 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] text-xs font-sans font-semibold tracking-wide flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-[#08080a]" />
                <span>COORDINATOR ACCESS</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* ACTIVE TAB CONTENT CONTAINER                                    */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 relative z-10">

        {/* ============================================================ */}
        {/* TAB 1: EVENTS                                                */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* TAB 1: EVENTS                                                */}
        {/* ============================================================ */}
        {activeTab === "EVENTS" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* Header with Title & Action Controls */}
            <div className="border-b border-white/[0.08] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E8D5B5]/20 bg-[#121215] text-[#E8D5B5] text-[11px] font-mono mb-3 tracking-widest uppercase">
                  <Calendar className="w-3.5 h-3.5 text-[#E8D5B5]" />
                  <span>ANNUAL CALENDAR // 2026 - 2027</span>
                </div>
                <h2 className="font-sans font-light text-3xl sm:text-5xl text-white tracking-tight">
                  Featured <span className="font-serif italic font-normal text-[#E8D5B5]">Events & Hackathons</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#A39F99] mt-2 max-w-xl leading-relaxed">
                  Explore previous milestones, active ongoing activities, and upcoming technical initiatives.
                </p>
              </div>

              {/* Action Bar: Category Filter Pills + "+ ADD EVENT" Button */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter Pills */}
                <div className="flex items-center bg-[#101013] border border-white/[0.08] rounded-full p-1 gap-1">
                  {(["ALL", "ONGOING", "UPCOMING", "PREVIOUS"] as const).map((cat) => {
                    const count = cat === "ALL" 
                      ? events.length 
                      : cat === "ONGOING" 
                      ? ongoingEvents.length 
                      : cat === "UPCOMING" 
                      ? upcomingEvents.length 
                      : previousEvents.length;
                    const isSelected = eventFilter === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setEventFilter(cat)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#E8D5B5] text-[#0a0a0c] font-semibold shadow-[0_0_15px_rgba(232,213,181,0.25)]"
                            : "text-[#8E8A84] hover:text-[#FAF6F0] border border-transparent"
                        }`}
                      >
                        {cat} <span className="opacity-70 text-[10px]">({count})</span>
                      </button>
                    );
                  })}
                </div>

                {/* PLUS BUTTON: Add Event */}
                <button
                  onClick={openCreateEventModal}
                  className="px-5 py-2 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD EVENT</span>
                </button>
              </div>
            </div>

            {/* If NO events exist at all (initial state requested: initially keep no events) */}
            {events.length === 0 ? (
              <div className="py-20 px-6 text-center rounded-3xl border border-dashed border-[#E8D5B5]/25 bg-[#101013]/70 backdrop-blur-md max-w-2xl mx-auto flex flex-col items-center animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-[#18181c] border border-[#E8D5B5]/30 flex items-center justify-center text-[#E8D5B5] mb-4 shadow-[0_0_25px_rgba(232,213,181,0.15)]">
                  <Calendar className="w-8 h-8 text-[#E8D5B5]" />
                </div>
                <h3 className="font-sans font-light text-xl sm:text-2xl text-white">
                  No Events <span className="font-serif italic text-[#E8D5B5]">Recorded Yet</span>
                </h3>
                <p className="font-sans text-sm text-[#A39F99] mt-2 max-w-md leading-relaxed">
                  The event repository is currently clean. Coordinators can register ongoing, upcoming, or past campus events with photos, schedules, and descriptions.
                </p>
                <button
                  onClick={openCreateEventModal}
                  className="mt-6 px-6 py-2.5 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>ADD DETAILS OF EVENT</span>
                </button>
              </div>
            ) : (
              <div className="space-y-16">
                {/* 1. ONGOING EVENTS */}
                {(eventFilter === "ALL" || eventFilter === "ONGOING") && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E8D5B5] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E8D5B5]"></span>
                        </span>
                        <div>
                          <h3 className="font-sans text-xl sm:text-2xl font-light text-white tracking-tight flex items-center gap-2">
                            <span>Live &</span>
                            <span className="font-serif italic text-[#E8D5B5]">Ongoing Activities</span>
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#18181c] border border-[#E8D5B5]/30 text-[#E8D5B5]">
                              {ongoingEvents.length} Active
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {ongoingEvents.length === 0 ? (
                      <div className="py-8 px-6 text-center rounded-2xl border border-white/[0.06] bg-[#101013] text-[#8E8A84] text-xs font-mono">
                        No ongoing events active right now. Click &quot;+ ADD EVENT&quot; to launch an active session.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ongoingEvents.map((ev, idx) => (
                          <TiltCard3D
                            key={ev.id}
                            className="p-6 h-full flex flex-col justify-between rounded-2xl group relative"
                          >
                            <div className="space-y-3.5 flex-1">
                              {/* Event Photo */}
                              {ev.photo ? (
                                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-white/[0.08] group-hover:border-[#E8D5B5]/40 transition-colors">
                                  <img
                                    src={ev.photo}
                                    alt={ev.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                </div>
                              ) : (
                                <div className="relative w-full h-28 rounded-xl bg-[#151518] border border-white/[0.08] flex items-center justify-center overflow-hidden mb-3">
                                  <Calendar className="w-8 h-8 text-[#E8D5B5]/30 group-hover:text-[#E8D5B5] group-hover:scale-110 transition-all duration-300" />
                                </div>
                              )}

                              {/* Index & Badges & Actions */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-[#8E8A84]">
                                    0{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border tracking-wider text-[#E8D5B5] bg-[#18181c] border-[#E8D5B5]/30">
                                    {ev.tag || "LIVE EVENT"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => openEditEventModal(ev, e)}
                                    className="p-1 rounded text-neutral-400 hover:text-[#E8D5B5] hover:bg-white/[0.05] transition-colors cursor-pointer"
                                    title="Edit Event"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteEvent(ev.id, e)}
                                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="font-sans text-lg font-semibold text-white group-hover:text-[#E8D5B5] transition-colors leading-snug">
                                {ev.title}
                              </h3>

                              {/* Metadata */}
                              <div className="space-y-1.5 text-xs text-[#A39F99] font-mono pt-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                  <span>{ev.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                  <span className="truncate">{ev.venue}</span>
                                </div>
                                {ev.perk && (
                                  <div className="flex items-center gap-2 text-[#E8D5B5] font-medium pt-0.5">
                                    <Award className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                    <span className="truncate">{ev.perk}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-xs text-[#A39F99] leading-relaxed font-sans pt-1">
                                {ev.desc}
                              </p>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-4 mt-4 border-t border-white/[0.07] flex items-center justify-between">
                              <button
                                onClick={() => alert(`Connecting to active live stream for ${ev.title}`)}
                                className="px-4 py-1.5 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans text-xs font-semibold transition-all shadow-[0_0_15px_rgba(232,213,181,0.2)] cursor-pointer"
                              >
                                Join Session ↗
                              </button>
                              <span className="text-[11px] font-mono text-[#8E8A84]">Live Status</span>
                            </div>
                          </TiltCard3D>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. UPCOMING EVENTS */}
                {(eventFilter === "ALL" || eventFilter === "UPCOMING") && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E8D5B5] shadow-[0_0_8px_#E8D5B5]" />
                        <div>
                          <h3 className="font-sans text-xl sm:text-2xl font-light text-white tracking-tight flex items-center gap-2">
                            <span>Scheduled &</span>
                            <span className="font-serif italic text-[#E8D5B5]">Upcoming Initiatives</span>
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#18181c] border border-[#E8D5B5]/30 text-[#E8D5B5]">
                              {upcomingEvents.length} Scheduled
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {upcomingEvents.length === 0 ? (
                      <div className="py-8 px-6 text-center rounded-2xl border border-white/[0.06] bg-[#101013] text-[#8E8A84] text-xs font-mono">
                        No upcoming events scheduled yet. Click &quot;+ ADD EVENT&quot; to publish an announcement.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {upcomingEvents.map((ev, idx) => (
                          <TiltCard3D
                            key={ev.id}
                            className="p-6 h-full flex flex-col justify-between rounded-2xl group relative"
                          >
                            <div className="space-y-3.5 flex-1">
                              {/* Event Photo */}
                              {ev.photo ? (
                                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-white/[0.08] group-hover:border-[#E8D5B5]/40 transition-colors">
                                  <img
                                    src={ev.photo}
                                    alt={ev.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                </div>
                              ) : (
                                <div className="relative w-full h-28 rounded-xl bg-[#151518] border border-white/[0.08] flex items-center justify-center overflow-hidden mb-3">
                                  <Calendar className="w-8 h-8 text-[#E8D5B5]/30 group-hover:text-[#E8D5B5] group-hover:scale-110 transition-all duration-300" />
                                </div>
                              )}

                              {/* Badges & Actions */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-[#8E8A84]">
                                    0{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border tracking-wider text-[#E8D5B5] bg-[#18181c] border-[#E8D5B5]/30">
                                    {ev.tag || "UPCOMING"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => openEditEventModal(ev, e)}
                                    className="p-1 rounded text-neutral-400 hover:text-[#E8D5B5] hover:bg-white/[0.05] transition-colors cursor-pointer"
                                    title="Edit Event"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteEvent(ev.id, e)}
                                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="font-sans text-lg font-semibold text-white group-hover:text-[#E8D5B5] transition-colors leading-snug">
                                {ev.title}
                              </h3>

                              {/* Metadata */}
                              <div className="space-y-1.5 text-xs text-[#A39F99] font-mono pt-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                  <span>{ev.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                  <span className="truncate">{ev.venue}</span>
                                </div>
                                {ev.perk && (
                                  <div className="flex items-center gap-2 text-[#E8D5B5] font-medium pt-0.5">
                                    <Award className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                    <span className="truncate">{ev.perk}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-xs text-[#A39F99] leading-relaxed font-sans pt-1">
                                {ev.desc}
                              </p>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-4 mt-4 border-t border-white/[0.07] flex items-center justify-between">
                              <button
                                onClick={() => alert(`Registered interest for "${ev.title}"!`)}
                                className="px-4 py-1.5 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans text-xs font-semibold transition-all shadow-[0_0_15px_rgba(232,213,181,0.2)] cursor-pointer"
                              >
                                Register / RSVP ↗
                              </button>
                              <span className="text-[11px] font-mono text-[#8E8A84]">Open Access</span>
                            </div>
                          </TiltCard3D>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PREVIOUS EVENTS */}
                {(eventFilter === "ALL" || eventFilter === "PREVIOUS") && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#8E8A84]" />
                        <div>
                          <h3 className="font-sans text-xl sm:text-2xl font-light text-white tracking-tight flex items-center gap-2">
                            <span>Archived &</span>
                            <span className="font-serif italic text-[#E8D5B5]">Past Milestones</span>
                            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[#18181c] border border-white/[0.1] text-[#A39F99]">
                              {previousEvents.length} Archived
                            </span>
                          </h3>
                        </div>
                      </div>
                    </div>

                    {previousEvents.length === 0 ? (
                      <div className="py-8 px-6 text-center rounded-2xl border border-white/[0.06] bg-[#101013] text-[#8E8A84] text-xs font-mono">
                        No previous events archived yet. Click &quot;+ ADD EVENT&quot; to log past milestones.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {previousEvents.map((ev, idx) => (
                          <TiltCard3D
                            key={ev.id}
                            className="p-6 h-full flex flex-col justify-between rounded-2xl group relative"
                          >
                            <div className="space-y-3.5 flex-1">
                              {/* Event Photo */}
                              {ev.photo ? (
                                <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 border border-white/[0.08] group-hover:border-[#E8D5B5]/40 transition-colors">
                                  <img
                                    src={ev.photo}
                                    alt={ev.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                                </div>
                              ) : (
                                <div className="relative w-full h-28 rounded-xl bg-[#151518] border border-white/[0.08] flex items-center justify-center overflow-hidden mb-3">
                                  <Calendar className="w-8 h-8 text-neutral-600 group-hover:text-[#E8D5B5] group-hover:scale-110 transition-all duration-300" />
                                </div>
                              )}

                              {/* Badges & Actions */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono text-[#8E8A84]">
                                    0{idx + 1}
                                  </span>
                                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border tracking-wider text-[#A39F99] bg-[#18181c] border-white/[0.1]">
                                    {ev.tag || "ARCHIVE"}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={(e) => openEditEventModal(ev, e)}
                                    className="p-1 rounded text-neutral-400 hover:text-[#E8D5B5] hover:bg-white/[0.05] transition-colors cursor-pointer"
                                    title="Edit Event"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => handleDeleteEvent(ev.id, e)}
                                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Title */}
                              <h3 className="font-sans text-lg font-semibold text-white group-hover:text-[#E8D5B5] transition-colors leading-snug">
                                {ev.title}
                              </h3>

                              {/* Metadata */}
                              <div className="space-y-1.5 text-xs text-[#A39F99] font-mono pt-1">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-3.5 h-3.5 text-[#8E8A84] shrink-0" />
                                  <span>{ev.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-[#8E8A84] shrink-0" />
                                  <span className="truncate">{ev.venue}</span>
                                </div>
                                {ev.perk && (
                                  <div className="flex items-center gap-2 text-[#E8D5B5] font-medium pt-0.5">
                                    <Award className="w-3.5 h-3.5 text-[#E8D5B5] shrink-0" />
                                    <span className="truncate">{ev.perk}</span>
                                  </div>
                                )}
                              </div>

                              {/* Description */}
                              <p className="text-xs text-[#A39F99] leading-relaxed font-sans pt-1">
                                {ev.desc}
                              </p>
                            </div>

                            {/* Card Footer */}
                            <div className="pt-4 mt-4 border-t border-white/[0.07] flex items-center justify-between">
                              <button
                                onClick={() => alert(`Viewing event archive and photos for "${ev.title}"`)}
                                className="px-4 py-1.5 rounded-full border border-white/[0.1] bg-[#161619] hover:bg-[#201f24] text-[#E8D5B5] font-sans text-xs transition-all cursor-pointer"
                              >
                                View Recap ↗
                              </button>
                              <span className="text-[11px] font-mono text-[#8E8A84]">Archived</span>
                            </div>
                          </TiltCard3D>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: GALLERY                                               */}
        {/* ============================================================ */}
        {activeTab === "GALLERY" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div className="border-b border-white/[0.08] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[11px] font-sans tracking-[0.2em] uppercase mb-3">
                  <Camera className="w-3.5 h-3.5" />
                  <span>Campus Archive // Visual Logs</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
                  Curated <span className="font-serif italic text-[#E8D5B5]">Archives</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#9c968f] mt-2 max-w-xl leading-relaxed">
                  Snapshots from our annual hackathon nights, lab workshops, and engineering showcases.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-sans tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#101013] text-[#E8D5B5]">
                  6 Archived Snapshots
                </span>
              </div>
            </div>

            {/* Grid of 3D Tilt Gallery Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-2">
              {[
                {
                  idx: "01",
                  title: "HackUnited Midnight Sprint",
                  sub: "Final 6 hours before judging, Lab 201",
                  img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
                },
                {
                  idx: "02",
                  title: "Microcontroller Assembly",
                  sub: "Freshers IoT & Drone Hardware Workshop",
                  img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
                },
                {
                  idx: "03",
                  title: "Smart India Hackathon Podium",
                  sub: "1st place winners representing the college",
                  img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80",
                },
                {
                  idx: "04",
                  title: "Induction in Auditorium",
                  sub: "Welcoming 200+ first-year student developers",
                  img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80",
                },
                {
                  idx: "05",
                  title: "Late Night Code & Reviews",
                  sub: "Pre-fest deployment session",
                  img: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&auto=format&fit=crop&q=80",
                },
                {
                  idx: "06",
                  title: "Annual Tech Fest Exhibition",
                  sub: "Autonomous quadcopter demonstration stall",
                  img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
                },
              ].map((pic) => (
                <TiltCard3D
                  key={pic.title}
                  className="aspect-[4/3] h-full group"
                >
                  <img
                    src={pic.img}
                    alt={pic.title}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle top index badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="text-[10px] font-sans tracking-[0.2em] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[#E8D5B5]">
                      {pic.idx}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-6 rounded-2xl pointer-events-none">
                    <h3 className="font-sans font-medium text-white text-base group-hover:text-[#E8D5B5] transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                      {pic.title}
                    </h3>
                    <p className="text-xs text-[#9c968f] font-sans mt-1">
                      {pic.sub}
                    </p>
                  </div>
                </TiltCard3D>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: TEAM                                                  */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* TAB 3: TEAM                                                  */}
        {/* ============================================================ */}
        {activeTab === "TEAM" && (
          <div className="space-y-16 animate-in fade-in duration-300">
            {/* Header - Centered with prominent editorial typography */}
            <div className="border-b border-white/[0.08] pb-10 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[11px] font-sans tracking-[0.2em] uppercase mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Leadership & Governance // 2026-2027</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
                Executive <span className="font-serif italic text-[#E8D5B5]">Coordinators</span>
              </h2>
              <p className="font-sans text-sm sm:text-base text-[#9c968f] mt-3 max-w-2xl text-center leading-relaxed">
                Guided by institutional faculty mentors and driven by passionate student coordinators managing technical repositories, lab hardware, and hackathon teams.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <span className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-[#101013] text-xs font-sans tracking-wider text-[#E8D5B5]">
                  {teacherCoordinators.length} Faculty Coordinators
                </span>
                <span className="px-4 py-1.5 rounded-full border border-white/[0.08] bg-[#101013] text-xs font-sans tracking-wider text-[#E8D5B5]">
                  {studentCoordinators.length} Student Coordinators
                </span>
                <button
                  onClick={openCreateCoordModal}
                  className="px-5 py-2 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Add Coordinator</span>
                </button>
              </div>
            </div>

            {/* 1. FACULTY COORDINATORS - CENTERED */}
            <div className="space-y-8 flex flex-col items-center">
              <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#E8D5B5]/20 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[10px] font-sans tracking-[0.2em] uppercase mb-2">
                  <span>Faculty Coordination Board</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Faculty <span className="font-serif italic text-[#E8D5B5]">Coordinators</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#9c968f] mt-1.5">
                  Institutional mentorship providing guidance, laboratory resources, and technical support.
                </p>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#E8D5B5]/50 to-transparent mt-4" />
              </div>

              {teacherCoordinators.length === 0 ? (
                <div className="py-10 px-6 text-center rounded-2xl border border-white/[0.08] bg-[#101013] text-[#9c968f] text-xs font-sans">
                  No faculty coordinators listed yet. Click &quot;Add Coordinator&quot; to register faculty coordinators.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
                  {teacherCoordinators.map((teacher) => (
                    <TiltCard3D
                      key={teacher.id}
                      className="p-8 flex flex-col justify-between h-full rounded-2xl relative group bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 transition-all duration-300"
                    >
                      {/* Coordinator Action Buttons */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                        <button
                          onClick={(e) => openEditCoordModal(teacher, e)}
                          className="p-1.5 rounded-full bg-black/70 border border-white/10 text-[#9c968f] hover:text-[#E8D5B5] hover:border-[#E8D5B5]/40 transition-all cursor-pointer"
                          title="Edit Coordinator Info"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCoordinator(teacher.id, e)}
                          className="p-1.5 rounded-full bg-black/70 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-950/60 transition-all cursor-pointer"
                          title="Remove Coordinator"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center text-center">
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full mb-5 p-1 border-2 border-[#E8D5B5]/30 group-hover:border-[#E8D5B5] group-hover:shadow-[0_0_24px_rgba(232,213,181,0.25)] group-hover:scale-105 transition-all duration-500">
                          <img
                            src={teacher.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80"}
                            alt={teacher.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <span className="text-[10px] font-sans font-medium px-3 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] mb-2.5 tracking-[0.15em] uppercase">
                          Faculty Coordinator
                        </span>

                        <h4 className="font-sans font-medium text-xl sm:text-2xl text-white group-hover:text-[#E8D5B5] transition-colors">
                          {teacher.name}
                        </h4>

                        <div className="text-sm sm:text-base font-serif italic text-[#E8D5B5] mt-1 font-normal">
                          {teacher.role}
                        </div>

                        <div className="text-xs sm:text-sm font-sans text-[#9c968f] mt-1">
                          {teacher.dept_or_domain}
                        </div>

                        {teacher.bio && (
                          <p className="text-xs sm:text-sm text-[#b0aba4] font-sans mt-3.5 leading-relaxed border-t border-white/[0.08] pt-3.5">
                            {teacher.bio}
                          </p>
                        )}
                      </div>

                      <div className="pt-5 mt-5 border-t border-white/[0.08] flex items-center justify-center gap-3 w-full">
                        {teacher.email && (
                          <a
                            href={`mailto:${teacher.email}`}
                            className="px-4 py-2 rounded-full border border-white/10 bg-black/40 flex items-center gap-2 text-[#9c968f] hover:border-[#E8D5B5]/50 hover:text-[#E8D5B5] transition-all text-xs font-sans"
                            title="Email Faculty"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Email</span>
                          </a>
                        )}
                        {teacher.linkedin && (
                          <a
                            href={teacher.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 rounded-full border border-white/10 bg-black/40 flex items-center gap-2 text-[#9c968f] hover:border-[#E8D5B5]/50 hover:text-[#E8D5B5] transition-all text-xs font-sans"
                            title="LinkedIn Profile"
                          >
                            <LinkedinIcon className="w-3.5 h-3.5" />
                            <span>LinkedIn</span>
                          </a>
                        )}
                      </div>
                    </TiltCard3D>
                  ))}
                </div>
              )}
            </div>

            {/* 2. STUDENT COORDINATORS - CENTERED (2 PER ROW) */}
            <div className="space-y-8 flex flex-col items-center pt-10 border-t border-white/[0.08] w-full">
              <div className="flex flex-col items-center text-center max-w-xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#E8D5B5]/20 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[10px] font-sans tracking-[0.2em] uppercase mb-2">
                  <span>Student Executive Council</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Student <span className="font-serif italic text-[#E8D5B5]">Coordinators</span>
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#9c968f] mt-1.5">
                  Lead student coordinators orchestrating software repositories, hackathons, robotics labs, and community sessions.
                </p>
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#E8D5B5]/50 to-transparent mt-4" />
              </div>

              {studentCoordinators.length === 0 ? (
                <div className="py-10 px-6 text-center rounded-2xl border border-white/[0.08] bg-[#101013] text-[#9c968f] text-xs font-sans">
                  No student coordinators listed yet. Click &quot;Add Coordinator&quot; to add student leads.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mx-auto">
                  {studentCoordinators.map((student) => (
                    <TiltCard3D
                      key={student.id}
                      className="p-8 sm:p-10 flex flex-col items-center text-center h-full rounded-2xl relative group bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 transition-all duration-300"
                    >
                      {/* Coordinator Action Buttons */}
                      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20">
                        <button
                          onClick={(e) => openEditCoordModal(student, e)}
                          className="p-1.5 rounded-full bg-black/70 border border-white/10 text-[#9c968f] hover:text-[#E8D5B5] hover:border-[#E8D5B5]/40 transition-all cursor-pointer"
                          title="Edit Coordinator Info"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCoordinator(student.id, e)}
                          className="p-1.5 rounded-full bg-black/70 border border-red-500/30 text-red-400 hover:text-white hover:bg-red-950/60 transition-all cursor-pointer"
                          title="Remove Coordinator"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex flex-col items-center w-full">
                        {/* Circular Avatar with Champagne Ring on Hover */}
                        <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full mb-6 p-1.5 border-2 border-[#E8D5B5]/25 group-hover:border-[#E8D5B5] group-hover:shadow-[0_0_30px_rgba(232,213,181,0.3)] group-hover:scale-105 transition-all duration-500">
                          <img
                            src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=80"}
                            alt={student.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        {/* Student Coordinator Badge */}
                        <span className="text-[10px] font-sans font-medium px-3.5 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] mb-3 tracking-[0.15em] uppercase">
                          Student Coordinator
                        </span>

                        {/* Name - Prominent Editorial Typography */}
                        <h4 className="font-sans font-medium text-2xl sm:text-3xl text-white group-hover:text-[#E8D5B5] transition-colors tracking-tight">
                          {student.name}
                        </h4>

                        {/* Role */}
                        <div className="font-serif italic text-base sm:text-lg text-[#E8D5B5] mt-2 font-normal">
                          {student.role}
                        </div>

                        {/* Domain Specialization */}
                        <div className="font-sans text-xs sm:text-sm text-[#9c968f] mt-1.5">
                          {student.dept_or_domain}
                        </div>

                        {/* Divider */}
                        <div className="w-full h-px bg-white/[0.08] group-hover:bg-[#E8D5B5]/30 my-6 transition-colors duration-300" />

                        {/* Clean Action Icons */}
                        <div className="flex items-center gap-3.5 justify-center w-full">
                          {student.email && (
                            <a
                              href={`mailto:${student.email}`}
                              className="w-11 h-11 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:border-[#E8D5B5] hover:text-[#E8D5B5] hover:bg-[#E8D5B5]/10 hover:shadow-[0_0_15px_rgba(232,213,181,0.2)] transition-all duration-200 cursor-pointer"
                              title="Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                          {student.linkedin && (
                            <a
                              href={student.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="w-11 h-11 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:border-[#E8D5B5] hover:text-[#E8D5B5] hover:bg-[#E8D5B5]/10 hover:shadow-[0_0_15px_rgba(232,213,181,0.2)] transition-all duration-200 cursor-pointer"
                              title="LinkedIn"
                            >
                              <LinkedinIcon className="w-4 h-4" />
                            </a>
                          )}
                          {student.social && (
                            <a
                              href={student.social}
                              target="_blank"
                              rel="noreferrer"
                              className="w-11 h-11 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:border-[#E8D5B5] hover:text-[#E8D5B5] hover:bg-[#E8D5B5]/10 hover:shadow-[0_0_15px_rgba(232,213,181,0.2)] transition-all duration-200 cursor-pointer"
                              title="GitHub / Profile"
                            >
                              <GithubIcon className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </TiltCard3D>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 4: JOIN US                                               */}
        {/* ============================================================ */}
        {activeTab === "JOIN US" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div className="border-b border-white/[0.08] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[11px] font-sans tracking-[0.2em] uppercase mb-3">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Cohort Induction // 2026 - 2027</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
                  Cohort <span className="font-serif italic text-[#E8D5B5]">Induction</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#9c968f] mt-2 max-w-xl leading-relaxed">
                  Whether you build embedded flight firmware, craft high-performance web systems, or reverse-engineer vulnerabilities — Geeks United is your launchpad.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center bg-[#101013] border border-white/[0.08] rounded-full p-1 gap-1">
                  <button
                    onClick={() => handleToggleReviewMode("apply")}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider transition-all cursor-pointer ${
                      joinViewMode === "apply"
                        ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_15px_rgba(232,213,181,0.25)]"
                        : "text-[#9c968f] hover:text-white"
                    }`}
                  >
                    APPLY FORM
                  </button>
                  <button
                    onClick={() => handleToggleReviewMode("review")}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                      joinViewMode === "review"
                        ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_15px_rgba(232,213,181,0.25)]"
                        : "text-[#9c968f] hover:text-white"
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>MANAGE APPLICANTS</span>
                    {applicantList.length > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-current font-bold">
                        {applicantList.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {joinViewMode === "review" ? (
              <div className="space-y-6 animate-in fade-in">
                {/* Review Mode Banner */}
                <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#101013] backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[10px] font-sans tracking-[0.2em] uppercase mb-1.5">
                      <Shield className="w-3 h-3" />
                      <span>Coordinator Access // Applicant Roster</span>
                    </div>
                    <h3 className="font-sans font-medium text-xl text-white">
                      Candidate Induction Roster
                    </h3>
                    <p className="text-xs font-sans text-[#9c968f] mt-0.5">
                      Only authorized coordinators can change candidate join status (Shortlist, Accept, Reject) or purge entries.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleReviewMode("review")}
                      className="px-4 py-2 rounded-full border border-white/10 bg-black/40 hover:border-[#E8D5B5]/40 text-xs font-sans text-[#E8D5B5] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Refresh Roster</span>
                    </button>
                    <button
                      onClick={() => handleToggleReviewMode("apply")}
                      className="px-4 py-2 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs transition-all cursor-pointer"
                    >
                      View Apply Form
                    </button>
                  </div>
                </div>

                {isLoadingApplicants ? (
                  <div className="py-20 text-center font-sans text-xs tracking-widest text-[#E8D5B5] animate-pulse">
                    LOADING APPLICANTS FROM SUPABASE DATABASE...
                  </div>
                ) : applicantList.length === 0 ? (
                  <div className="py-16 px-6 text-center rounded-2xl border border-dashed border-white/10 bg-[#101013] text-[#9c968f] max-w-lg mx-auto">
                    <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                    <h4 className="font-sans font-medium text-base text-white">NO CANDIDATE APPLICATIONS YET</h4>
                    <p className="text-xs font-sans text-[#9c968f] mt-1">
                      New induction submissions made through the candidate intake form will synchronize directly to this database console.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applicantList.map((app) => {
                      const statusColor = 
                        app.status === "accepted"
                          ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                          : app.status === "shortlisted"
                          ? "bg-[#E8D5B5]/10 border-[#E8D5B5]/40 text-[#E8D5B5]"
                          : app.status === "rejected"
                          ? "bg-red-950/60 border-red-500/40 text-red-300"
                          : "bg-amber-950/60 border-amber-500/40 text-amber-300";

                      return (
                        <TiltCard3D key={app.id || app.college_email} className="p-6 flex flex-col justify-between h-full space-y-4 bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 rounded-2xl transition-all">
                          <div>
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <h4 className="font-sans font-medium text-lg text-white group-hover:text-[#E8D5B5] transition-colors">
                                  {app.full_name}
                                </h4>
                                <div className="text-xs font-sans text-[#9c968f] mt-0.5">
                                  {app.college_email}
                                </div>
                              </div>

                              <span className={`text-[10px] font-sans font-medium px-3 py-1 rounded-full border uppercase tracking-wider ${statusColor}`}>
                                {app.status || "PENDING"}
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs font-sans pt-2 border-t border-white/[0.08]">
                              <div className="flex items-center justify-between text-[#b0aba4]">
                                <span className="text-[#9c968f]">Year of Study:</span>
                                <span>{app.year_of_study}</span>
                              </div>
                              <div className="flex items-center justify-between text-[#b0aba4]">
                                <span className="text-[#9c968f]">Domain:</span>
                                <span className="text-[#E8D5B5] font-medium">{app.primary_domain}</span>
                              </div>
                              {app.portfolio_link && (
                                <div className="flex items-center justify-between text-[#b0aba4] pt-1">
                                  <span className="text-[#9c968f]">Portfolio / Github:</span>
                                  <a
                                    href={app.portfolio_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[#E8D5B5] hover:underline flex items-center gap-1 font-sans"
                                  >
                                    <span className="truncate max-w-[150px]">{app.portfolio_link}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                              {app.created_at && (
                                <div className="flex items-center justify-between text-[#9c968f] text-[11px] pt-1">
                                  <span>Applied:</span>
                                  <span>{new Date(app.created_at).toLocaleDateString()}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Coordinator Decision Controls */}
                          <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateApplicantStatus(app.id, "shortlisted")}
                                className="px-3 py-1 rounded-full bg-[#E8D5B5]/10 hover:bg-[#E8D5B5]/20 border border-[#E8D5B5]/30 text-[#E8D5B5] text-[11px] font-sans transition-colors cursor-pointer"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => handleUpdateApplicantStatus(app.id, "accepted")}
                                className="px-3 py-1 rounded-full bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-sans transition-colors cursor-pointer"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateApplicantStatus(app.id, "rejected")}
                                className="px-3 py-1 rounded-full bg-red-950/30 hover:bg-red-900/40 border border-red-500/30 text-red-400 text-[11px] font-sans transition-colors cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>

                            <button
                              onClick={() => handleDeleteApplicant(app.id)}
                              className="p-1.5 rounded-full text-neutral-500 hover:text-red-400 hover:bg-red-950/30 transition-colors cursor-pointer"
                              title="Delete Candidate Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </TiltCard3D>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
                {/* Left Column: Perks & Track Highlights */}
                <div className="lg:col-span-5 space-y-6">
                  <TiltCard3D className="p-8 space-y-6 bg-[#101013] border border-white/[0.08] rounded-2xl">
                    <div className="flex items-center gap-2 text-[#E8D5B5] font-sans text-xs tracking-[0.2em] uppercase">
                      <Sparkles className="w-4 h-4" />
                      <span>Engineering Collective</span>
                    </div>
                    <h3 className="text-2xl font-normal text-white tracking-tight">
                      Build Real Hardware & <span className="font-serif italic text-[#E8D5B5]">High-Scale Systems</span>
                    </h3>
                    <div className="space-y-4 text-xs sm:text-sm font-sans text-[#9c968f] leading-relaxed">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#E8D5B5] font-bold text-xs">
                          ✓
                        </div>
                        <p>
                          <strong className="text-white">Robotics & IoT Lab Access:</strong> Free access to microcontrollers, brushless motors, telemetry sensors, and 3D printing equipment.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#E8D5B5] font-bold text-xs">
                          ✓
                        </div>
                        <p>
                          <strong className="text-white">Sponsored Hackathon Trips:</strong> Full funding for team registrations, travel grants, and cloud credits at premier national hackathons.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center shrink-0 mt-0.5 text-[#E8D5B5] font-bold text-xs">
                          ✓
                        </div>
                        <p>
                          <strong className="text-white">Senior Peer Mentorship:</strong> Direct guidance on resume building, open-source pull requests, and technical interview preparation.
                        </p>
                      </div>
                    </div>
                  </TiltCard3D>

                  <TiltCard3D className="p-7 bg-[#101013] border border-white/[0.08] rounded-2xl">
                    <div className="text-xs font-sans tracking-[0.2em] uppercase text-[#E8D5B5] mb-4">
                      Current Recruitment Domains
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Full-Stack Web Dev",
                        "Robotics & Drones",
                        "Competitive Programming",
                        "AI / ML Pipelines",
                        "Cybersecurity & CTF",
                        "UI/UX & 3D Motion",
                      ].map((domain) => (
                        <span
                          key={domain}
                          className="px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#151518] text-xs font-sans text-[#b0aba4] hover:border-[#E8D5B5]/40 hover:text-[#E8D5B5] transition-colors"
                        >
                          {domain}
                        </span>
                      ))}
                    </div>
                  </TiltCard3D>
                </div>

                {/* Right Column: Interactive Application Form */}
                <div className="lg:col-span-7">
                  <TiltCard3D className="p-8 sm:p-10 bg-[#101013] border border-white/[0.08] rounded-2xl">
                    {isSubmitted ? (
                      <div className="py-12 text-center space-y-4 animate-in fade-in">
                        <div className="w-16 h-16 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5] flex items-center justify-center mx-auto text-[#E8D5B5] shadow-[0_0_30px_rgba(232,213,181,0.3)]">
                          <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-sans font-medium text-2xl text-white">
                          Application Transmitted
                        </h3>
                        <p className="font-sans text-sm text-[#9c968f] max-w-md mx-auto leading-relaxed">
                          Your induction data has been logged to our community database. Our tech domain leads will review your profile and reach out via email for the onboarding workshop!
                        </p>
                        <button
                          onClick={() => setIsSubmitted(false)}
                          className="mt-4 px-6 py-2.5 rounded-full border border-[#E8D5B5]/40 text-[#E8D5B5] text-xs font-sans hover:bg-[#E8D5B5]/10 transition-colors cursor-pointer"
                        >
                          SUBMIT ANOTHER APPLICATION
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleJoinSubmit}
                        className="space-y-5"
                      >
                        <div className="border-b border-white/[0.08] pb-4 mb-4">
                          <div className="font-sans text-xl font-medium text-white">
                            Candidate Intake Form
                          </div>
                          <div className="text-xs font-sans text-[#9c968f] mt-1">
                            COHORT 2026 // OPEN TO ALL DEPARTMENTS • SYNCS TO DATABASE
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 tracking-wider uppercase">
                              Full Name
                            </label>
                            <input
                              type="text"
                              required
                              value={joinName}
                              onChange={(e) => setJoinName(e.target.value)}
                              placeholder="e.g. Alex Johnson"
                              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 tracking-wider uppercase">
                              College Email / Roll
                            </label>
                            <input
                              type="text"
                              required
                              value={joinEmail}
                              onChange={(e) => setJoinEmail(e.target.value)}
                              placeholder="e.g. 12621001045 or roll@college.edu"
                              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 tracking-wider uppercase">
                              Year of Study
                            </label>
                            <select 
                              value={joinYear}
                              onChange={(e) => setJoinYear(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors cursor-pointer"
                            >
                              <option>1st Year (Fresher)</option>
                              <option>2nd Year (Sophomore)</option>
                              <option>3rd Year (Junior)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 tracking-wider uppercase">
                              Primary Domain of Interest
                            </label>
                            <select 
                              value={joinDomain}
                              onChange={(e) => setJoinDomain(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors cursor-pointer"
                            >
                              <option>Software & Web Development</option>
                              <option>Robotics, Drone IoT & Embedded Systems</option>
                              <option>Competitive Programming & DSA</option>
                              <option>Artificial Intelligence & Data Science</option>
                              <option>Cybersecurity & Ethical Hacking</option>
                              <option>UI/UX Design & Video Production</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 tracking-wider uppercase">
                            GitHub / LeetCode / Portfolio Link (Optional)
                          </label>
                          <input
                            type="url"
                            value={joinPortfolio}
                            onChange={(e) => setJoinPortfolio(e.target.value)}
                            placeholder="https://github.com/yourhandle"
                            className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={joinSubmitting}
                          className="w-full py-3.5 bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs rounded-full transition-all shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] cursor-pointer tracking-wider uppercase disabled:opacity-50"
                        >
                          {joinSubmitting ? "LOGGING APPLICATION..." : "SUBMIT APPLICATION // JOIN COHORT"}
                        </button>
                      </form>
                    )}
                  </TiltCard3D>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 5: CONTACT                                               */}
        {/* ============================================================ */}
        {activeTab === "CONTACT" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            {/* Header */}
            <div className="border-b border-white/[0.08] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#E8D5B5]/30 bg-[#E8D5B5]/5 text-[#E8D5B5] text-[11px] font-sans tracking-[0.2em] uppercase mb-3">
                  <Mail className="w-3.5 h-3.5" />
                  <span>Communications Relay // Uplink</span>
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight">
                  Direct <span className="font-serif italic text-[#E8D5B5]">Inquiries</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-[#9c968f] mt-2 max-w-xl leading-relaxed">
                  Have questions about hackathon sponsorships, technical collaborations, or club events? Send us a message.
                </p>
              </div>

              <span className="text-[11px] font-sans tracking-[0.2em] uppercase px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#101013] text-[#E8D5B5]">
                Responsive Within 24H
              </span>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <TiltCard3D className="p-8 text-center flex flex-col items-center justify-between h-full bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 rounded-2xl transition-all">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center mx-auto mb-4 text-[#E8D5B5]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-medium text-lg text-white mb-1">Official Email</h3>
                  <p className="text-xs text-[#9c968f] mb-4 font-sans leading-relaxed">
                    For sponsorships, college administration, and student queries
                  </p>
                </div>
                <a
                  href="mailto:team@geeksunited.org"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-white/10 text-xs font-sans text-[#E8D5B5] hover:border-[#E8D5B5]/50 transition-all"
                >
                  <span>team@geeksunited.org</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </TiltCard3D>

              <TiltCard3D className="p-8 text-center flex flex-col items-center justify-between h-full bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 rounded-2xl transition-all">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center mx-auto mb-4 text-[#E8D5B5]">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-medium text-lg text-white mb-1">Student Discord Hub</h3>
                  <p className="text-xs text-[#9c968f] mb-4 font-sans leading-relaxed">
                    Active voice channels, project discussions & doubt solving
                  </p>
                </div>
                <a
                  href="https://discord.gg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-white/10 text-xs font-sans text-[#E8D5B5] hover:border-[#E8D5B5]/50 transition-all"
                >
                  <span>discord.gg/geeksunited</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </TiltCard3D>

              <TiltCard3D className="p-8 text-center flex flex-col items-center justify-between h-full bg-[#101013] border border-white/[0.08] hover:border-[#E8D5B5]/40 rounded-2xl transition-all">
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center mx-auto mb-4 text-[#E8D5B5]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-sans font-medium text-lg text-white mb-1">Campus Hub</h3>
                  <p className="text-xs text-[#9c968f] mb-4 font-sans leading-relaxed">
                    Student Activity Center (SAC), Room 204
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-white/10 text-xs font-sans text-[#b0aba4]">
                  <span>Mon-Fri • 4:00 PM - 8:30 PM</span>
                </span>
              </TiltCard3D>
            </div>

            {/* Direct Message Transmission Card */}
            <TiltCard3D className="p-8 sm:p-10 max-w-3xl mx-auto bg-[#101013] border border-white/[0.08] rounded-2xl">
              {isContactSubmitted ? (
                <div className="py-8 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5] flex items-center justify-center mx-auto text-[#E8D5B5]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-medium text-xl text-white">
                    Message Transmitted
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#9c968f] max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. A club representative will review your message and reply via email within 24 hours.
                  </p>
                  <button
                    onClick={() => setIsContactSubmitted(false)}
                    className="mt-3 px-5 py-2 rounded-full border border-[#E8D5B5]/40 text-[#E8D5B5] text-xs font-sans hover:bg-[#E8D5B5]/10 transition-colors cursor-pointer"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleContactSubmit}
                  className="space-y-4"
                >
                  <div className="border-b border-white/[0.08] pb-3 mb-2">
                    <h3 className="font-sans text-lg font-medium text-white">
                      Direct Relay Form
                    </h3>
                    <p className="text-xs font-sans text-[#9c968f]">
                      Send an encrypted transmission directly to the executive board • Synced to Database
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="Alex Morgan"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="alex@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={contactSubject}
                      onChange={(e) => setContactSubject(e.target.value)}
                      placeholder="e.g. Hackathon Sponsorship or Speaker Invitation"
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                      Message Content
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Write your transmission here..."
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactSubmitting}
                    className="w-full py-3.5 bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs rounded-full transition-all shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] cursor-pointer tracking-wider uppercase disabled:opacity-50"
                  >
                    {contactSubmitting ? "TRANSMITTING TO DATABASE..." : "SEND TRANSMISSION"}
                  </button>
                </form>
              )}
            </TiltCard3D>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* LUXURY EDITORIAL FOOTER                                        */}
      {/* ============================================================== */}
      <footer className="mt-28 border-t border-white/[0.08] bg-[#08080a] py-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-serif italic text-lg text-[#E8D5B5] font-normal">gu.</span>
            <span className="font-sans font-medium text-sm tracking-wider text-white">
              GEEKS <span className="font-serif italic text-[#E8D5B5]">UNITED</span>
            </span>
            <span className="text-neutral-500 text-xs font-sans">
              // CAMPUS TECHNICAL SOCIETY
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs font-sans text-[#9c968f] overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`transition-colors cursor-pointer whitespace-nowrap uppercase tracking-wider ${
                  activeTab === tab ? "text-[#E8D5B5] font-medium" : "hover:text-[#E8D5B5]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#706c66] font-sans text-center sm:text-right">
            © 2026 - 2027 GEEKS UNITED. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* MODAL: ADD DETAILS OF EVENTS                                   */}
      {/* ============================================================== */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#101013] border border-[#E8D5B5]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(232,213,181,0.15)] max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div>
                <span className="text-[10px] font-sans text-[#E8D5B5] tracking-[0.2em] uppercase">
                  Event Matrix // Registry
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-medium text-white mt-0.5">
                  {editingEventId ? "Edit Event Details" : "Add Event Details"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEventOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:text-white hover:border-[#E8D5B5]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateEvent} className="space-y-5">
              {/* Event Title */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. HackUnited '26: 24-Hour National Hackathon"
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors"
                />
              </div>

              {/* Event Category (Previous, Ongoing, Upcoming) */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Event Section / Status *
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: "ongoing", label: "Ongoing Event", desc: "Live right now", color: "border-emerald-500 text-emerald-300 bg-emerald-950/40" },
                    { id: "upcoming", label: "Upcoming Event", desc: "Future scheduled", color: "border-[#E8D5B5] text-[#E8D5B5] bg-[#E8D5B5]/10" },
                    { id: "previous", label: "Previous Event", desc: "Past completed", color: "border-purple-500 text-purple-300 bg-purple-950/40" },
                  ].map((cat) => {
                    const isSelected = formCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormCategory(cat.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? `${cat.color} shadow-[0_0_15px_rgba(232,213,181,0.2)]`
                            : "border-white/10 bg-[#08080a] text-[#9c968f] hover:border-white/20"
                        }`}
                      >
                        <div className="font-sans font-medium text-xs">{cat.label}</div>
                        <div className="text-[10px] font-sans opacity-70 mt-0.5">{cat.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time and Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Date & Time *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. OCTOBER 17 - 18, 2026 • 10:00 AM"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Venue / Platform *
                  </label>
                  <input
                    type="text"
                    required
                    value={formVenue}
                    onChange={(e) => setFormVenue(e.target.value)}
                    placeholder="e.g. Main Auditorium & Robotics Lab"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
              </div>

              {/* Tag and Perk */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Event Type / Tag
                  </label>
                  <input
                    type="text"
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    placeholder="e.g. HACKATHON, WORKSHOP, CP CONTEST"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Highlights / Perks
                  </label>
                  <input
                    type="text"
                    value={formPerk}
                    onChange={(e) => setFormPerk(e.target.value)}
                    placeholder="e.g. ₹1,00,000 Cash Pool + Cloud Credits"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
              </div>

              {/* Photos of Event */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Event Photo / Banner
                </label>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-full border border-[#E8D5B5]/40 bg-[#E8D5B5]/10 hover:bg-[#E8D5B5]/20 text-[#E8D5B5] text-xs font-sans flex items-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-[#9c968f] font-sans">or enter image URL</span>
                  </div>

                  <input
                    type="url"
                    value={formPhoto}
                    onChange={(e) => setFormPhoto(e.target.value)}
                    placeholder="https://images.unsplash.com/... or upload file above"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />

                  {photoError && (
                    <p className="text-xs text-red-400 font-sans">{photoError}</p>
                  )}

                  {/* Photo Preview */}
                  {formPhoto && (
                    <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/15 mt-2 group">
                      <img
                        src={formPhoto}
                        alt="Event Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormPhoto("")}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/80 text-red-400 border border-red-500/40 text-[10px] font-sans hover:bg-red-950 transition-colors"
                      >
                        Remove Photo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Description of the Event *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Provide full description of the event, tracks, team sizes, schedule, and guidelines..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors resize-none"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsAddEventOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-[#9c968f] hover:text-white text-xs font-sans transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingEventId ? "Update Event" : "Publish Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD / EDIT COORDINATOR                                  */}
      {/* ============================================================== */}
      {isCoordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#101013] border border-[#E8D5B5]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(232,213,181,0.15)] max-h-[90vh] overflow-y-auto no-scrollbar">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div>
                <span className="text-[10px] font-sans text-[#E8D5B5] tracking-[0.2em] uppercase">
                  Team Directory // Leadership
                </span>
                <h3 className="font-sans text-xl sm:text-2xl font-medium text-white mt-0.5">
                  {editingCoordId ? "Edit Coordinator Profile" : "Add New Coordinator"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCoordModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:text-white hover:border-[#E8D5B5]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveCoordinator} className="space-y-5">
              {/* Coordinator Type */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Coordinator Category *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCoordType("teacher")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      coordType === "teacher"
                        ? "border-[#E8D5B5] bg-[#E8D5B5]/10 text-[#E8D5B5] shadow-[0_0_15px_rgba(232,213,181,0.2)]"
                        : "border-white/10 bg-[#08080a] text-[#9c968f] hover:border-white/20"
                    }`}
                  >
                    <div className="font-sans font-medium text-xs sm:text-sm">Faculty Coordinator</div>
                    <div className="text-[10px] font-sans opacity-70 mt-0.5">Faculty Coordination Council</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoordType("student")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      coordType === "student"
                        ? "border-[#E8D5B5] bg-[#E8D5B5]/10 text-[#E8D5B5] shadow-[0_0_15px_rgba(232,213,181,0.2)]"
                        : "border-white/10 bg-[#08080a] text-[#9c968f] hover:border-white/20"
                    }`}
                  >
                    <div className="font-sans font-medium text-xs sm:text-sm">Student Coordinator</div>
                    <div className="text-[10px] font-sans opacity-70 mt-0.5">Executive Lead Council</div>
                  </button>
                </div>
              </div>

              {/* Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={coordName}
                    onChange={(e) => setCoordName(e.target.value)}
                    placeholder={coordType === "teacher" ? "e.g. Dr. Subhashish Roy" : "e.g. SAYAN GHANTY"}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Role / Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={coordRole}
                    onChange={(e) => setCoordRole(e.target.value)}
                    placeholder={coordType === "teacher" ? "Chief Faculty Coordinator" : "Student Coordinator & Software Lead"}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
              </div>

              {/* Department or Domain & Official Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    {coordType === "teacher" ? "Department *" : "Domain Specialization *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={coordDept}
                    onChange={(e) => setCoordDept(e.target.value)}
                    placeholder={coordType === "teacher" ? "Dept. of Computer Science" : "Full-Stack Web & Platform Systems"}
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={coordEmail}
                    onChange={(e) => setCoordEmail(e.target.value)}
                    placeholder="coordinator@geeksunited.org"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
              </div>

              {/* Social Links: LinkedIn & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={coordLinkedin}
                    onChange={(e) => setCoordLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                    GitHub / Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={coordSocial}
                    onChange={(e) => setCoordSocial(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />
                </div>
              </div>

              {/* Photo / Avatar Upload */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Profile Photo / Avatar
                </label>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-full border border-[#E8D5B5]/40 bg-[#E8D5B5]/10 hover:bg-[#E8D5B5]/20 text-[#E8D5B5] text-xs font-sans flex items-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo File (&lt;5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoordPhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-[#9c968f] font-sans">or provide image URL</span>
                  </div>

                  <input
                    type="url"
                    value={coordAvatar}
                    onChange={(e) => setCoordAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/... or uploaded photo"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs focus:outline-none focus:border-[#E8D5B5] transition-colors"
                  />

                  {coordAvatarError && (
                    <p className="text-xs text-red-400 font-sans">{coordAvatarError}</p>
                  )}

                  {coordAvatar && (
                    <div className="flex items-center gap-4 p-3 rounded-xl border border-white/10 bg-[#08080a] mt-2">
                      <div className="w-14 h-14 rounded-full overflow-hidden border border-[#E8D5B5]/50 shrink-0">
                        <img src={coordAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-white font-sans block truncate">Avatar preview active</span>
                        <span className="text-[11px] text-[#E8D5B5] font-sans">Will display with champagne halo</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCoordAvatar("")}
                        className="px-3 py-1 text-xs text-red-400 hover:bg-red-950/40 border border-red-500/30 rounded-full"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio / Summary */}
              <div>
                <label className="block text-xs font-sans text-[#b0aba4] mb-1.5 uppercase tracking-wider">
                  Short Bio / Mentorship Focus
                </label>
                <textarea
                  rows={3}
                  value={coordBio}
                  onChange={(e) => setCoordBio(e.target.value)}
                  placeholder="Mentorship areas, lab responsibilities, or technical focus..."
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs sm:text-sm focus:outline-none focus:border-[#E8D5B5] transition-colors resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsCoordModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-white/10 text-[#9c968f] hover:text-white text-xs font-sans transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{editingCoordId ? "Update Coordinator" : "Save to Database"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: COORDINATOR AUTH & ACCESS REQUEST PORTAL               */}
      {/* ============================================================== */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#101013] border border-[#E8D5B5]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(232,213,181,0.15)] max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center text-[#E8D5B5]">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-[#E8D5B5] tracking-[0.2em] uppercase">
                    Role Access Control // Portal
                  </span>
                  <h3 className="font-sans text-lg sm:text-xl font-medium text-white">
                    Coordinator Portal
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsLoginModalOpen(false);
                  setAuthError("");
                  setAuthSuccessMsg("");
                }}
                className="w-8 h-8 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:text-white hover:border-[#E8D5B5]/50 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Security Advisory */}
              <div className="p-4 rounded-2xl border border-[#E8D5B5]/20 bg-[#E8D5B5]/5 text-xs font-sans text-[#b0aba4] leading-relaxed">
                <div className="flex items-center gap-1.5 text-[#E8D5B5] font-medium mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Approval-Gated Access Control</span>
                </div>
                <p className="text-[11px] text-[#9c968f]">
                  Anyone can view events and community activities. However, coordinator rights (adding/editing events, team profiles, and applicants) are strictly restricted.
                </p>
                <div className="mt-2.5 text-[11px] font-sans text-[#E8D5B5] bg-black/40 p-2 rounded-xl border border-white/[0.08] flex items-center justify-between">
                  <span>Review Authority:</span>
                  <strong className="text-white bg-[#151518] px-2 py-0.5 rounded-full border border-[#E8D5B5]/30">
                    Master Administrator
                  </strong>
                </div>
              </div>

              {/* Mode Switcher: Sign In vs Request Access vs Create Account */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#08080a] border border-white/10 rounded-full text-center">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("signin");
                    setAuthError("");
                    setAuthSuccessMsg("");
                  }}
                  className={`py-2 text-[11px] font-sans rounded-full transition-all cursor-pointer ${
                    authTab === "signin"
                      ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_12px_rgba(232,213,181,0.25)]"
                      : "text-[#9c968f] hover:text-white"
                  }`}
                >
                  SIGN IN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("request");
                    setAuthError("");
                    setAuthSuccessMsg("");
                  }}
                  className={`py-2 text-[11px] font-sans rounded-full transition-all cursor-pointer ${
                    authTab === "request"
                      ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_12px_rgba(232,213,181,0.25)]"
                      : "text-[#9c968f] hover:text-white"
                  }`}
                >
                  REQUEST ACCESS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab("signup");
                    setAuthError("");
                    setAuthSuccessMsg("");
                  }}
                  className={`py-2 text-[11px] font-sans rounded-full transition-all cursor-pointer ${
                    authTab === "signup"
                      ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_12px_rgba(232,213,181,0.25)]"
                      : "text-[#9c968f] hover:text-white"
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* Success Banner */}
              {authSuccessMsg && (
                <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-xs font-sans text-emerald-300 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authSuccessMsg}</span>
                </div>
              )}

              {/* Error Banner */}
              {authError && (
                <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-950/30 text-xs font-sans text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{authError}</span>
                </div>
              )}

              {/* TAB 1: SIGN IN FORM */}
              {authTab === "signin" && (
                <form onSubmit={handleManualAuth} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                      Coordinator / Admin Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="coordinator@domain.edu"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter password..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                      <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>{authLoading ? "AUTHENTICATING..." : "SIGN IN AS COORDINATOR"}</span>
                  </button>

                  <p className="text-[11px] text-[#9c968f] text-center font-sans pt-1">
                    Not yet approved? Switch to <strong className="text-[#E8D5B5] cursor-pointer underline" onClick={() => setAuthTab("request")}>REQUEST ACCESS</strong> to submit an authorization application.
                  </p>
                </form>
              )}

              {/* TAB 2: REQUEST COORDINATOR ACCESS FORM */}
              {authTab === "request" && (
                <form onSubmit={handleSubmitAccessRequest} className="space-y-3">
                  <div className="p-3 rounded-xl border border-[#E8D5B5]/20 bg-[#E8D5B5]/5 text-[11px] font-sans text-[#b0aba4] leading-relaxed">
                    Submit your details below. A notification will be routed to the administrator for review and authorization.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reqName}
                        onChange={(e) => setReqName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={reqEmail}
                        onChange={(e) => setReqEmail(e.target.value)}
                        placeholder="your.email@gmail.com"
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                        Phone / WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={reqPhone}
                        onChange={(e) => setReqPhone(e.target.value)}
                        placeholder="+91 ..."
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                        Role Requested
                      </label>
                      <select
                        value={reqRole}
                        onChange={(e) => setReqRole(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      >
                        <option value="Student Coordinator">Student Coordinator</option>
                        <option value="Faculty Coordinator">Faculty Coordinator</option>
                        <option value="Technical Lead">Technical Lead</option>
                        <option value="Hackathon Event Lead">Hackathon Event Lead</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                      Reason / Qualifications *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={reqReason}
                      onChange={(e) => setReqReason(e.target.value)}
                      placeholder="Why do you need coordinator access? State your role or club responsibilities..."
                      className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reqSubmitting}
                    className="w-full py-3 px-4 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4" />
                    <span>{reqSubmitting ? "DISPATCHING REQUEST..." : "SUBMIT ACCESS REQUEST"}</span>
                  </button>
                </form>
              )}

              {/* TAB 3: CREATE ACCOUNT */}
              {authTab === "signup" && (
                <form onSubmit={handleManualAuth} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                      Register Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                      <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans text-[#b0aba4] mb-1 uppercase tracking-wider">
                      Choose Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Minimum 6 characters..."
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-white/10 bg-[#08080a] text-white text-xs font-sans focus:outline-none focus:border-[#E8D5B5] transition-colors"
                      />
                      <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3 px-4 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(232,213,181,0.25)] hover:shadow-[0_0_30px_rgba(232,213,181,0.45)] transition-all cursor-pointer disabled:opacity-50 uppercase tracking-wider"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{authLoading ? "CREATING..." : "CREATE ACCOUNT & REQUEST ACCESS"}</span>
                  </button>

                  <p className="text-[11px] text-[#9c968f] text-center font-sans pt-1">
                    Note: Creating an account registers an access request. Administrator approval is still required to obtain coordinator privileges.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: MASTER ADMIN COORDINATOR ACCESS REQUESTS MANAGEMENT     */}
      {/* ============================================================== */}
      {isRequestsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#101013] border border-[#E8D5B5]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(232,213,181,0.15)] max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E8D5B5]/10 border border-[#E8D5B5]/30 flex items-center justify-center text-[#E8D5B5]">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-sans text-[#E8D5B5] tracking-[0.2em] uppercase">
                    Master Admin Controls // Authorization Dashboard
                  </span>
                  <h3 className="font-sans text-lg sm:text-2xl font-medium text-white">
                    Coordinator Access Requests
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadCoordinatorRequests}
                  className="px-4 py-1.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/80 text-xs font-sans text-[#b0aba4] hover:text-[#E8D5B5] transition-colors cursor-pointer"
                  title="Refresh Requests"
                >
                  Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setIsRequestsModalOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-[#9c968f] hover:text-white hover:border-[#E8D5B5]/50 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Admin Policy Notice */}
            <div className="mb-6 p-4 rounded-2xl border border-[#E8D5B5]/20 bg-[#E8D5B5]/5 text-xs font-sans text-[#b0aba4] leading-relaxed">
              <strong className="text-[#E8D5B5] block mb-1">Unilateral Admin Gate:</strong>
              People asking for coordinator access must be approved here by you. Without approval, no visitor can modify events, change coordinator profiles, or access candidate applications.
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 mb-6 border-b border-white/[0.08] pb-4 overflow-x-auto">
              {(["ALL", "PENDING", "APPROVED", "REJECTED"] as const).map((filter) => {
                const count = filter === "ALL"
                  ? coordRequests.length
                  : filter === "PENDING"
                  ? coordRequests.filter((r) => r.status === "pending").length
                  : filter === "APPROVED"
                  ? coordRequests.filter((r) => r.status === "approved").length
                  : coordRequests.filter((r) => r.status === "rejected").length;
                const isActive = requestFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setRequestFilter(filter)}
                    className={`px-4 py-1.5 rounded-full text-xs font-sans transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#E8D5B5] text-[#08080a] font-medium shadow-[0_0_12px_rgba(232,213,181,0.25)]"
                        : "text-[#9c968f] hover:text-white border border-white/10 bg-[#08080a]"
                    }`}
                  >
                    <span>{filter}</span>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-current font-bold">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Request Cards List */}
            {isLoadingRequests ? (
              <div className="py-12 text-center text-xs font-sans text-[#E8D5B5] animate-pulse">
                Fetching coordinator requests from Supabase...
              </div>
            ) : coordRequests.filter((r) =>
                requestFilter === "ALL" ? true : r.status.toUpperCase() === requestFilter
              ).length === 0 ? (
              <div className="py-12 text-center text-xs font-sans text-[#9c968f]">
                No coordinator requests found in this category.
              </div>
            ) : (
              <div className="space-y-4">
                {coordRequests
                  .filter((r) =>
                    requestFilter === "ALL" ? true : r.status.toUpperCase() === requestFilter
                  )
                  .map((req) => (
                    <div
                      key={req.id || req.email}
                      className="p-5 rounded-2xl border border-white/[0.08] bg-[#151518] hover:border-[#E8D5B5]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-sans font-medium text-white text-base">
                            {req.name}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-sans bg-[#E8D5B5]/10 text-[#E8D5B5] border border-[#E8D5B5]/30">
                            {req.role_requested}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-sans font-medium tracking-wider ${
                              req.status === "approved"
                                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                                : req.status === "rejected"
                                ? "bg-red-950/60 text-red-400 border border-red-500/40"
                                : "bg-[#E8D5B5]/10 text-[#E8D5B5] border border-[#E8D5B5]/40"
                            }`}
                          >
                            {req.status === "approved"
                              ? "APPROVED ✓"
                              : req.status === "rejected"
                              ? "REJECTED ✕"
                              : "PENDING APPROVAL"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#9c968f] font-sans">
                          <span className="flex items-center gap-1 text-[#E8D5B5]">
                            <Mail className="w-3.5 h-3.5" />
                            {req.email}
                          </span>
                          {req.phone && (
                            <span className="text-[#9c968f]">Tel: {req.phone}</span>
                          )}
                          {req.created_at && (
                            <span className="text-neutral-500">
                              {new Date(req.created_at).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-black/40 border border-white/[0.08] text-xs text-[#b0aba4] font-sans leading-relaxed">
                          <strong className="text-[#9c968f] block mb-0.5 text-[10px] uppercase tracking-wider">
                            STATEMENT / REASON:
                          </strong>
                          {req.reason}
                        </div>
                      </div>

                      {/* Action Buttons for this request */}
                      <div className="flex md:flex-col items-center gap-2 shrink-0">
                        {req.status !== "approved" && (
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req)}
                            className="px-4 py-2 rounded-full bg-[#E8D5B5] hover:bg-[#FAF6F0] text-[#08080a] font-sans font-semibold text-xs shadow-[0_0_15px_rgba(232,213,181,0.25)] transition-all cursor-pointer flex items-center gap-1.5 w-full justify-center uppercase tracking-wider"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>APPROVE ACCESS</span>
                          </button>
                        )}

                        {req.status !== "rejected" && (
                          <button
                            type="button"
                            onClick={() => handleRejectRequest(req)}
                            className="px-4 py-2 rounded-full border border-red-500/40 bg-red-950/30 hover:bg-red-950/60 text-red-300 font-sans font-medium text-xs transition-colors cursor-pointer flex items-center gap-1.5 w-full justify-center uppercase tracking-wider"
                          >
                            <UserX className="w-3.5 h-3.5" />
                            <span>{req.status === "approved" ? "REVOKE ACCESS" : "REJECT"}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteRequest(req.id)}
                          className="px-3 py-1.5 rounded-full border border-white/10 text-neutral-400 hover:text-red-400 hover:border-red-500/30 text-[11px] font-sans transition-colors cursor-pointer w-full text-center"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

    </section>
  );
}
