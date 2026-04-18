"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Radio,
  MapPin,
  Users,
  Zap,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  Globe,
  Lock,
  Activity,
  Layers,
  Terminal,
  Wifi,
  Star,
  TrendingUp,
  Clock,
  Shield,
} from "lucide-react";

// ─── Intersection-observer hook for scroll-triggered animations ──
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ─── Animated counter ───────────────────────────────────────────
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(to / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, to]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Nav ────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Roles", href: "#roles" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[oklch(0.10_0.015_260/0.92)] backdrop-blur-xl border-b border-[oklch(0.28_0.01_260)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.7_0.18_160)] flex items-center justify-center shadow-lg shadow-[oklch(0.7_0.18_160)/30] group-hover:shadow-[oklch(0.7_0.18_160)/50] transition-shadow">
            <ShieldCheck className="w-4.5 h-4.5 text-[oklch(0.10_0_0)]" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">FieldSync</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-[oklch(0.65_0_0)] hover:text-white transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-[oklch(0.65_0_0)] hover:text-white transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-[oklch(0.7_0.18_160)] text-[oklch(0.10_0_0)] hover:bg-[oklch(0.65_0.18_160)] transition-colors shadow-lg shadow-[oklch(0.7_0.18_160)/25]"
          >
            Get started
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[oklch(0.10_0.015_260)] border-b border-[oklch(0.28_0.01_260)] px-5 pb-5 pt-2 space-y-3">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-[oklch(0.65_0_0)] hover:text-white py-1 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1 text-center text-sm py-2 rounded-lg border border-[oklch(0.28_0.01_260)] text-white">Sign in</Link>
            <Link href="/register" className="flex-1 text-center text-sm py-2 rounded-lg bg-[oklch(0.7_0.18_160)] text-[oklch(0.10_0_0)] font-semibold">Get started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ───────────────────────────────────────────────────────
function HeroImage() {
  const imgRef = useRef<HTMLDivElement>(null);

  // Subtle mouse-parallax tilt effect
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = imgRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(1200px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transform = `perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1)`;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  const floatingPills = [
    { label: "124 Agents Online", color: "oklch(0.7 0.18 160)", top: "8%", right: "-6%", delay: "0s" },
    { label: "18 Zones Active", color: "oklch(0.65 0.2 250)", bottom: "22%", left: "-8%", delay: "0.4s" },
    { label: "99.9% Uptime", color: "oklch(0.75 0.18 65)", bottom: "6%", right: "4%", delay: "0.8s" },
  ];

  return (
    <div
      ref={imgRef}
      className="relative w-full"
      style={{ transition: "transform 0.15s ease-out" }}
    >
      {/* Outer glow ring */}
      <div
        className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, oklch(0.7 0.18 160), transparent 70%)",
          animation: "pulseGlow 3s ease-in-out infinite",
        }}
      />

      {/* Rotating ring decoration */}
      <div
        className="absolute -inset-2 rounded-3xl pointer-events-none"
        style={{
          border: "1px solid oklch(0.7 0.18 160 / 0.15)",
          animation: "ringPulse 4s ease-in-out infinite",
        }}
      />

      {/* Main image card */}
      <div className="relative rounded-2xl overflow-hidden border border-[oklch(0.35_0.01_260)] shadow-2xl shadow-black/70">
        {/* Browser chrome bar */}
        <div className="bg-[oklch(0.12_0.01_260)] px-4 py-2.5 flex items-center gap-2 border-b border-[oklch(0.22_0.01_260)]">
          <div className="w-3 h-3 rounded-full bg-[oklch(0.5_0.2_25)]" />
          <div className="w-3 h-3 rounded-full bg-[oklch(0.75_0.18_65)]" />
          <div className="w-3 h-3 rounded-full bg-[oklch(0.7_0.18_160)]" />
          <div className="ml-3 flex-1 bg-[oklch(0.18_0.01_260)] rounded-md px-3 py-1 text-xs text-[oklch(0.45_0_0)] font-mono">
            app.fieldsync.io/dashboard
          </div>
          {/* Live indicator */}
          <div className="flex items-center gap-1.5 ml-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.18_160)] animate-pulse" />
            <span className="text-[10px] text-[oklch(0.7_0.18_160)] font-medium">LIVE</span>
          </div>
        </div>

        {/* The actual image */}
        <div className="relative">
          <Image
            src="/hero-dashboard.png"
            alt="FieldSync Mission Control Dashboard — real-time field operations map with agent tracking and zone management"
            width={1024}
            height={768}
            className="w-full h-auto block"
            priority
            quality={90}
          />
          {/* Subtle overlay gradient so text pills pop */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: "linear-gradient(135deg, oklch(0.08 0.015 260 / 0.15) 0%, transparent 50%, oklch(0.08 0.015 260 / 0.2) 100%)",
          }} />
          {/* Pulsing map ping dots over image */}
          {[
            { top: "35%", left: "28%", delay: "0s" },
            { top: "50%", left: "58%", delay: "0.6s" },
            { top: "30%", left: "72%", delay: "1.2s" },
          ].map((p, i) => (
            <div key={i} className="absolute pointer-events-none" style={{ top: p.top, left: p.left }}>
              <div
                className="absolute rounded-full bg-[oklch(0.7_0.18_160)]"
                style={{
                  width: 10, height: 10,
                  boxShadow: "0 0 12px oklch(0.7 0.18 160)",
                  animation: `ping ${1.6 + i * 0.4}s ease-in-out infinite`,
                  animationDelay: p.delay,
                }}
              />
              <div
                className="absolute rounded-full border border-[oklch(0.7_0.18_160)/50]"
                style={{
                  width: 24, height: 24, top: -7, left: -7,
                  animation: `ripple ${2 + i * 0.5}s ease-out infinite`,
                  animationDelay: p.delay,
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Floating stat pills */}
      {floatingPills.map((pill) => (
        <div
          key={pill.label}
          className="absolute hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl border backdrop-blur-md text-xs font-semibold"
          style={{
            top: pill.top,
            bottom: pill.bottom,
            left: pill.left,
            right: pill.right,
            color: pill.color,
            background: `oklch(0.12 0.01 260 / 0.85)`,
            borderColor: `${pill.color}30`,
            boxShadow: `0 4px 20px ${pill.color}15`,
            animation: `floatPill 3s ease-in-out infinite`,
            animationDelay: pill.delay,
          }}
        >
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: pill.color, boxShadow: `0 0 6px ${pill.color}` }} />
          {pill.label}
        </div>
      ))}

      {/* Glow under image */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-[oklch(0.7_0.18_160)] opacity-25 blur-2xl rounded-full pointer-events-none" />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[oklch(0.08_0.015_260)] pt-20 pb-16">
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.7 0.18 160) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.18 160) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[500px] rounded-full bg-[oklch(0.7_0.18_160)] opacity-[0.05] blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full bg-[oklch(0.65_0.2_250)] opacity-[0.06] blur-[110px] pointer-events-none" />

      {/* Main content: two-column on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

        {/* Left: Text column */}
        <div>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[oklch(0.7_0.18_160)/10] border border-[oklch(0.7_0.18_160)/25] mb-8"
            style={{ animation: "fadeSlideDown 0.6s ease-out forwards" }}
          >
            <span className="w-2 h-2 rounded-full bg-[oklch(0.7_0.18_160)] animate-pulse" />
            <span className="text-xs font-medium text-[oklch(0.7_0.18_160)] tracking-wide uppercase">
              Live Mission Control — Active Now
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl xl:text-7xl font-bold text-white leading-[1.06] tracking-tight"
            style={{ animation: "fadeSlideDown 0.7s ease-out 0.1s backwards" }}
          >
            Run field ops at{" "}
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, oklch(0.75 0.18 160), oklch(0.55 0.22 190))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              the speed of now.
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-6 text-base sm:text-lg text-[oklch(0.58_0_0)] max-w-xl leading-relaxed"
            style={{ animation: "fadeSlideDown 0.7s ease-out 0.2s backwards" }}
          >
            FieldSync gives commanders, supervisors, and field agents a single
            real-time platform — live maps, instant tasks, zone control, and
            role-precise dashboards built for the field.
          </p>

          {/* CTAs */}
          <div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            style={{ animation: "fadeSlideDown 0.7s ease-out 0.3s backwards" }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[0.9375rem] font-semibold bg-[oklch(0.7_0.18_160)] text-[oklch(0.10_0_0)] hover:bg-[oklch(0.65_0.18_160)] transition-all shadow-xl shadow-[oklch(0.7_0.18_160)/30] hover:shadow-[oklch(0.7_0.18_160)/55] hover:-translate-y-0.5"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-[0.9375rem] font-medium text-white border border-[oklch(0.3_0.01_260)] hover:border-[oklch(0.45_0.01_260)] hover:bg-[oklch(0.14_0.01_260)] transition-all"
            >
              Sign in to dashboard
            </Link>
          </div>

          {/* Social proof row */}
          <div
            className="mt-8 flex items-center gap-4"
            style={{ animation: "fadeSlideDown 0.7s ease-out 0.4s backwards" }}
          >
            <div className="flex -space-x-2">
              {["oklch(0.7 0.18 160)","oklch(0.65 0.2 250)","oklch(0.75 0.18 65)","oklch(0.65 0.22 330)"].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-[oklch(0.10_0.01_260)] flex items-center justify-center text-[9px] font-bold text-[oklch(0.10_0_0)]" style={{ background: c }}>
                  {["A","S","T","F"][i]}
                </div>
              ))}
            </div>
            <p className="text-xs text-[oklch(0.48_0_0)]">
              Trusted by field teams across industries
            </p>
          </div>
        </div>

        {/* Right: Hero image */}
        <div
          className="relative"
          style={{ animation: "fadeSlideUp 0.9s ease-out 0.4s backwards" }}
        >
          <HeroImage />
        </div>
      </div>

      {/* Scroll indicator (centered at bottom) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <a href="#stats" className="flex flex-col items-center gap-1 text-[oklch(0.38_0_0)] hover:text-[oklch(0.7_0.18_160)] transition-colors group">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

// ─── Stats ──────────────────────────────────────────────────────
function Stats() {
  const { ref, inView } = useInView();
  const items = [
    { value: 50000, suffix: "+", label: "Field agents managed" },
    { value: 99.9, suffix: "%", label: "Platform uptime SLA" },
    { value: 200, suffix: "ms", label: "Average sync latency" },
    { value: 1200, suffix: "+", label: "Operations completed" },
  ];

  return (
    <section id="stats" className="py-20 bg-[oklch(0.10_0.01_260)] border-y border-[oklch(0.18_0.01_260)]">
      <div ref={ref} className="max-w-5xl mx-auto px-5 sm:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
        {items.map((item, i) => (
          <div
            key={item.label}
            className="space-y-1"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(20px)",
              transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s`,
            }}
          >
            <p className="text-3xl sm:text-4xl font-bold text-[oklch(0.7_0.18_160)]">
              {inView ? <Counter to={item.value} suffix={item.suffix} /> : "0"}
            </p>
            <p className="text-sm text-[oklch(0.5_0_0)]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ───────────────────────────────────────────────────
const features = [
  {
    icon: Radio,
    title: "Real-Time Coordination",
    desc: "Sub-200ms data sync across all devices. Every agent action, task update, and zone change propagates instantly to the entire command chain.",
    color: "oklch(0.7 0.18 160)",
    bg: "oklch(0.7 0.18 160 / 0.08)",
  },
  {
    icon: MapPin,
    title: "Dynamic Zone Management",
    desc: "Draw, assign, and monitor operational zones in real time. Automatic geo-fencing alerts keep supervisors informed of boundary breaches.",
    color: "oklch(0.65 0.2 250)",
    bg: "oklch(0.65 0.2 250 / 0.08)",
  },
  {
    icon: Users,
    title: "Role-Based Workspaces",
    desc: "Admins, supervisors, team leaders, and field agents each get a purpose-built workspace — no information overload, just the right tools.",
    color: "oklch(0.75 0.18 65)",
    bg: "oklch(0.75 0.18 65 / 0.08)",
  },
  {
    icon: BarChart3,
    title: "Live Analytics & Reports",
    desc: "Real-time dashboards with field performance KPIs, task completion rates, and historical trend analysis exportable in multiple formats.",
    color: "oklch(0.65 0.22 330)",
    bg: "oklch(0.65 0.22 330 / 0.08)",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    desc: "JWT-based auth with role enforcement at every layer, OTP verification, session inactivity watchdog, and full audit logging.",
    color: "oklch(0.6 0.18 200)",
    bg: "oklch(0.6 0.18 200 / 0.08)",
  },
  {
    icon: Terminal,
    title: "Offline-Ready Field Mode",
    desc: "Agents can log activities and capture data with no connectivity. Changes queue locally and sync the moment signal is restored.",
    color: "oklch(0.7 0.15 140)",
    bg: "oklch(0.7 0.15 140 / 0.08)",
  },
];

function Features() {
  const { ref, inView } = useInView();
  return (
    <section id="features" className="py-24 bg-[oklch(0.08_0.015_260)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.18_160)/10] border border-[oklch(0.7_0.18_160)/20] mb-4">
            <Zap className="w-3 h-3 text-[oklch(0.7_0.18_160)]" />
            <span className="text-xs text-[oklch(0.7_0.18_160)] font-medium tracking-wide">Platform Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Everything ops teams need,<br className="hidden sm:block" /> nothing they don&apos;t.
          </h2>
          <p className="mt-4 text-[oklch(0.55_0_0)] max-w-xl mx-auto">
            Built from the ground up for demanding field environments — not adapted from office software.
          </p>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-[oklch(0.22_0.01_260)] bg-[oklch(0.12_0.01_260)] p-6 hover:border-[oklch(0.35_0.01_260)] transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(24px)",
                  transition: `opacity 0.5s ${i * 0.08}s, transform 0.5s ${i * 0.08}s, border-color 0.3s, translate 0.3s`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${f.color}08, transparent 70%)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: f.bg, border: `1px solid ${f.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-[oklch(0.52_0_0)] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ───────────────────────────────────────────────
const steps = [
  {
    step: "01",
    title: "Admin sets up the mission",
    desc: "Create projects, define operational zones, onboard team members and assign roles from the God-Mode admin console.",
    icon: Layers,
  },
  {
    step: "02",
    title: "Supervisors deploy teams",
    desc: "Supervisors spin up project workspaces, assign team leaders, send invitations, and monitor live activity across all zones.",
    icon: Globe,
  },
  {
    step: "03",
    title: "Field agents execute",
    desc: "Agents receive tasks, log field reports, update their status in real time, and stay synced with the command chain at all times.",
    icon: Activity,
  },
  {
    step: "04",
    title: "Command stays informed",
    desc: "Live dashboards, instant notifications, and drill-down analytics give decision makers a complete operational picture — always.",
    icon: Wifi,
  },
];

function HowItWorks() {
  const { ref, inView } = useInView();
  return (
    <section id="how-it-works" className="py-24 bg-[oklch(0.10_0.01_260)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.65_0.2_250)/10] border border-[oklch(0.65_0.2_250)/20] mb-4">
            <TrendingUp className="w-3 h-3 text-[oklch(0.65_0.2_250)]" />
            <span className="text-xs text-[oklch(0.65_0.2_250)] font-medium tracking-wide">Operational Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            From command to field<br className="hidden sm:block" /> in four steps.
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(20px)",
                  transition: `opacity 0.6s ${i * 0.12}s, transform 0.6s ${i * 0.12}s`,
                }}
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-[oklch(0.28_0.01_260)] to-transparent z-0" />
                )}
                <div className="relative z-10 bg-[oklch(0.13_0.01_260)] border border-[oklch(0.22_0.01_260)] rounded-2xl p-6 h-full hover:border-[oklch(0.35_0.01_260)] transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xs font-bold text-[oklch(0.7_0.18_160)] font-mono">{s.step}</span>
                    <div className="w-8 h-8 rounded-lg bg-[oklch(0.7_0.18_160)/10] border border-[oklch(0.7_0.18_160)/15] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-[oklch(0.7_0.18_160)]" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-2">{s.title}</h3>
                  <p className="text-xs text-[oklch(0.52_0_0)] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Roles ──────────────────────────────────────────────────────
const roles = [
  {
    title: "Administrator",
    badge: "God Mode",
    badgeColor: "oklch(0.65 0.22 330)",
    desc: "Full platform control. Manage all users, roles, projects, audit logs, and system configuration from one unified console.",
    perks: [
      "User & role management across all tenants",
      "System-wide audit log and security center",
      "Platform configuration and branding",
      "Real-time performance monitoring",
    ],
    icon: Shield,
    color: "oklch(0.65 0.22 330)",
  },
  {
    title: "Supervisor",
    badge: "Project Commander",
    badgeColor: "oklch(0.65 0.2 250)",
    desc: "Own your project end-to-end. Invite team leaders, manage zones, track live progress, and publish operational reports.",
    perks: [
      "Multi-project workspace management",
      "Team leader assignment and oversight",
      "Zone creation and geo-fence control",
      "Invitation and access management",
    ],
    icon: Globe,
    color: "oklch(0.65 0.2 250)",
  },
  {
    title: "Team Leader",
    badge: "Squad Lead",
    badgeColor: "oklch(0.75 0.18 65)",
    desc: "Lead your squad with real-time task assignment, field reports, and live agent tracking on the ground.",
    perks: [
      "Agent task assignment and tracking",
      "Real-time field status monitoring",
      "Incident and report submission",
      "Team communication tools",
    ],
    icon: Users,
    color: "oklch(0.75 0.18 65)",
  },
  {
    title: "Field Agent",
    badge: "On the Ground",
    badgeColor: "oklch(0.7 0.18 160)",
    desc: "A clean mobile-optimized workspace for executing tasks, logging field data, and staying connected to HQ.",
    perks: [
      "Task queue with priority indicators",
      "Field data capture with media",
      "Real-time status broadcasting",
      "Offline-capable field mode",
    ],
    icon: Activity,
    color: "oklch(0.7 0.18 160)",
  },
];

function Roles() {
  const { ref, inView } = useInView();
  return (
    <section id="roles" className="py-24 bg-[oklch(0.08_0.015_260)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.75_0.18_65)/10] border border-[oklch(0.75_0.18_65)/20] mb-4">
            <Lock className="w-3 h-3 text-[oklch(0.75_0.18_65)]" />
            <span className="text-xs text-[oklch(0.75_0.18_65)] font-medium tracking-wide">Role-Based Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            One platform, four precision<br className="hidden sm:block" /> command layers.
          </h2>
          <p className="mt-4 text-[oklch(0.55_0_0)] max-w-xl mx-auto">
            Each role gets exactly the tools and information it needs — no more, no less.
          </p>
        </div>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {roles.map((r, i) => {
            const Icon = r.icon;
            return (
              <div
                key={r.title}
                className="group relative rounded-2xl border border-[oklch(0.22_0.01_260)] bg-[oklch(0.12_0.01_260)] p-6 flex flex-col hover:border-[oklch(0.35_0.01_260)] transition-all duration-300 hover:-translate-y-1"
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(24px)",
                  transition: `opacity 0.5s ${i * 0.1}s, transform 0.5s ${i * 0.1}s, border-color 0.3s`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${r.color}12`, border: `1px solid ${r.color}20` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: r.color }} />
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide"
                    style={{
                      color: r.badgeColor,
                      background: `${r.badgeColor}12`,
                      border: `1px solid ${r.badgeColor}25`,
                    }}
                  >
                    {r.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{r.title}</h3>
                <p className="text-xs text-[oklch(0.52_0_0)] leading-relaxed mb-4 flex-1">{r.desc}</p>
                <ul className="space-y-2">
                  {r.perks.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: r.color }} />
                      <span className="text-xs text-[oklch(0.6_0_0)]">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ───────────────────────────────────────────────
const testimonials = [
  {
    quote: "FieldSync cut our coordination overhead by 60%. The real-time zone map alone saved us from three major incidents this quarter.",
    author: "Amara Diallo",
    title: "Director of Field Operations",
    stars: 5,
  },
  {
    quote: "Our supervisors can now spin up a project, invite a team, and assign zones in under five minutes. Previously that took hours of emails.",
    author: "Kofi Mensah",
    title: "Senior Supervisor, Infrastructure",
    stars: 5,
  },
  {
    quote: "The role-based dashboards are brilliantly designed. Every team member sees exactly what they need and nothing they don't.",
    author: "Fatima Al-Rashid",
    title: "Operations Manager",
    stars: 5,
  },
];

function Testimonials() {
  const { ref, inView } = useInView();
  return (
    <section id="testimonials" className="py-24 bg-[oklch(0.10_0.01_260)]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.18_160)/10] border border-[oklch(0.7_0.18_160)/20] mb-4">
            <Star className="w-3 h-3 text-[oklch(0.7_0.18_160)]" />
            <span className="text-xs text-[oklch(0.7_0.18_160)] font-medium tracking-wide">What Teams Say</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Trusted in the field.
          </h2>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.author}
              className="relative rounded-2xl border border-[oklch(0.22_0.01_260)] bg-[oklch(0.12_0.01_260)] p-6 hover:border-[oklch(0.35_0.01_260)] transition-all duration-300"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(20px)",
                transition: `opacity 0.5s ${i * 0.12}s, transform 0.5s ${i * 0.12}s, border-color 0.3s`,
              }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(t.stars).fill(0).map((_, si) => (
                  <Star key={si} className="w-3.5 h-3.5 text-[oklch(0.75_0.18_65)] fill-[oklch(0.75_0.18_65)]" />
                ))}
              </div>
              <p className="text-sm text-[oklch(0.65_0_0)] leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-sm font-semibold text-white">{t.author}</p>
                <p className="text-xs text-[oklch(0.48_0_0)] mt-0.5">{t.title}</p>
              </div>
              {/* Subtle quote glow */}
              <div className="absolute top-4 right-4 text-5xl text-[oklch(0.7_0.18_160)/8] font-serif leading-none select-none">❝</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ────────────────────────────────────────────────────────
function CTA() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-[oklch(0.08_0.015_260)]">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <div
          ref={ref}
          className="relative rounded-3xl border border-[oklch(0.28_0.01_260)] bg-[oklch(0.12_0.01_260)] p-12 sm:p-16 overflow-hidden"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition: "opacity 0.7s, transform 0.7s",
          }}
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-[oklch(0.7_0.18_160)] opacity-[0.07] blur-[60px] rounded-full" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-[oklch(0.65_0.2_250)] opacity-[0.05] blur-[80px] rounded-full" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(0.7_0.18_160)/10] border border-[oklch(0.7_0.18_160)/20] mb-6">
              <span className="w-2 h-2 rounded-full bg-[oklch(0.7_0.18_160)] animate-pulse" />
              <span className="text-xs text-[oklch(0.7_0.18_160)] font-medium">Ready when you are</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              Your operations deserve<br className="hidden sm:block" /> better command.
            </h2>
            <p className="text-[oklch(0.55_0_0)] max-w-md mx-auto mb-8">
              Join field teams who&apos;ve replaced guesswork with real-time control. Set up in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[0.9375rem] font-semibold bg-[oklch(0.7_0.18_160)] text-[oklch(0.10_0_0)] hover:bg-[oklch(0.65_0.18_160)] transition-all shadow-xl shadow-[oklch(0.7_0.18_160)/30] hover:shadow-[oklch(0.7_0.18_160)/50] hover:-translate-y-0.5"
              >
                Create free account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[0.9375rem] font-medium text-white border border-[oklch(0.28_0.01_260)] hover:border-[oklch(0.4_0.01_260)] hover:bg-[oklch(0.14_0.01_260)] transition-all"
              >
                <Clock className="w-4 h-4" />
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────
function Footer() {
  const links = {
    Platform: ["Features", "How it works", "Roles", "Security"],
    Company: ["About", "Careers", "Blog", "Contact"],
    Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
  };

  return (
    <footer className="bg-[oklch(0.08_0.015_260)] border-t border-[oklch(0.18_0.01_260)] pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 w-fit">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.7_0.18_160)] flex items-center justify-center shadow-lg shadow-[oklch(0.7_0.18_160)/30]">
                <ShieldCheck className="w-4 h-4 text-[oklch(0.10_0_0)]" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">FieldSync</span>
            </Link>
            <p className="text-sm text-[oklch(0.48_0_0)] max-w-xs leading-relaxed">
              Real-time field operations management. Built for teams that can&apos;t afford to guess.
            </p>
            <div className="flex items-center gap-2 text-xs text-[oklch(0.4_0_0)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.7_0.18_160)] animate-pulse" />
              All systems operational
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-[oklch(0.55_0_0)] uppercase tracking-wider mb-4">{group}</p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-[oklch(0.45_0_0)] hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[oklch(0.18_0.01_260)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[oklch(0.38_0_0)]">
            © {new Date().getFullYear()} FieldSync. All rights reserved.
          </p>
          <p className="text-xs text-[oklch(0.38_0_0)] flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-[oklch(0.7_0.18_160)]" />
            Secured with end-to-end encryption
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ───────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="dark">
      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ping {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.8); opacity: 0.3; }
        }
        @keyframes ripple {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.38; }
        }
        @keyframes ringPulse {
          0%, 100% { opacity: 0.12; transform: scale(1); }
          50%       { opacity: 0.28; transform: scale(1.005); }
        }
        @keyframes floatPill {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }
        html { scroll-behavior: smooth; }
      `}</style>

      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Roles />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
