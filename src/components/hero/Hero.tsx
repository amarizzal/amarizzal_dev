"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, Mail, MapPin, Sparkles } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import type { Profile } from "@/lib/types";

const roles = [
  "Fullstack Developer",
  "Next.js Specialist",
  "UI/UX Enthusiast",
  "Backend Engineer",
  "Problem Solver",
];

function TypingText({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) {
      const t = setTimeout(() => setPause(false), 1600);
      return () => clearTimeout(t);
    }

    const current = texts[idx];
    const speed = deleting ? 40 : 80;

    const t = setTimeout(() => {
      if (!deleting) {
        setDisplayed(current.slice(0, displayed.length + 1));
        if (displayed.length + 1 === current.length) {
          setPause(true);
          setDeleting(true);
        }
      } else {
        setDisplayed(current.slice(0, displayed.length - 1));
        if (displayed.length - 1 === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % texts.length);
        }
      }
    }, speed);

    return () => clearTimeout(t);
  }, [displayed, deleting, idx, texts, pause]);

  return (
    <span className="gradient-text">
      {displayed}
      <span className="animate-pulse text-[#6366f1]">|</span>
    </span>
  );
}

const FloatingOrb = ({ delay, size, x, y, color }: { delay: number; size: number; x: string; y: string; color: string }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, background: color }}
    animate={{
      y: ["0%", "-8%", "0%"],
      opacity: [0.15, 0.3, 0.15],
      scale: [1, 1.05, 1],
    }}
    transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const Particle = ({ delay }: { delay: number }) => {
  const x = Math.random() * 100;
  const duration = 8 + Math.random() * 8;
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#6366f1]/40 pointer-events-none"
      style={{ left: `${x}%`, bottom: "0%" }}
      animate={{ y: [-20, -600], opacity: [0, 0.8, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    />
  );
};

export default function Hero({ profile }: { profile: Profile | null }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const particles = Array.from({ length: 16 }, (_, i) => i);
  // Particle pakai Math.random() untuk posisinya — dirender hanya setelah
  // mount supaya HTML server & client tidak pernah berbeda (hydration
  // mismatch). Bug lama, ikut diperbaiki karena file ini sudah disentuh.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const nama = profile?.nama ?? "Rizal Ammar";
  const lokasi = profile?.location ?? "Malang, Jawa Timur, Indonesia";
  const bio =
    profile?.bio ??
    "Fullstack developer berbasis di Malang dengan pengalaman membangun web dan aplikasi modern.";

  const statItems = [
    { value: `${profile?.years_of_experience ?? 0}+`, label: "Tahun Pengalaman" },
    { value: `${profile?.projects_completed ?? 0}+`, label: "Proyek Selesai" },
    { value: `${profile?.clients_satisfied ?? 0}+`, label: "Klien Puas" },
  ];

  const socialLinks = [
    { icon: GithubIcon, href: profile?.github_url, label: "GitHub" },
    { icon: LinkedinIcon, href: profile?.linkedin_url, label: "LinkedIn" },
    { icon: Mail, href: profile?.email ? `mailto:${profile.email}` : null, label: "Email" },
  ].filter((s): s is typeof s & { href: string } => Boolean(s.href));

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-bg"
    >
      {/* Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-100 pointer-events-none" />

      {/* Floating Orbs */}
      <FloatingOrb delay={0} size={500} x="10%" y="15%" color="rgba(99,102,241,0.12)" />
      <FloatingOrb delay={2} size={350} x="70%" y="10%" color="rgba(168,85,247,0.1)" />
      <FloatingOrb delay={1} size={300} x="60%" y="60%" color="rgba(6,182,212,0.08)" />

      {/* Particles */}
      {mounted && particles.map((i) => (
        <Particle key={i} delay={i * 0.5} />
      ))}

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16"
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
          {/* Left: Text */}
          <div>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-[#6366f1]/20 mb-6"
            >
              <Sparkles size={14} className="text-[#6366f1]" />
              <span className="text-sm text-gray-400">Available for freelance projects</span>
              <span className="w-2 h-2 rounded-full bg-green-400 pulse-glow-anim" />
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Halo, Saya{" "}
              <span className="gradient-text block mt-1">{nama}</span>
            </motion.h1>

            {/* Typing Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl font-medium text-gray-400 mb-2 h-9"
            >
              <TypingText texts={roles} />
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="flex items-center gap-1.5 text-gray-500 text-sm mb-6"
            >
              <MapPin size={14} className="text-[#6366f1]" />
              <span>{lokasi}</span>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-400 text-base leading-relaxed mb-8 max-w-lg"
            >
              {bio}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              <motion.button
                onClick={() => document.querySelector("#projects")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-primary px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Sparkles size={16} />
                Lihat Proyek
              </motion.button>
              <motion.button
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                className="btn-outline px-6 py-3 rounded-xl font-semibold text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Hubungi Saya
              </motion.button>
            </motion.div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4"
              >
                <span className="text-xs text-gray-600 uppercase tracking-wider">Temukan Saya</span>
                <div className="flex gap-3">
                  {socialLinks.map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="w-9 h-9 rounded-lg glass border border-[var(--border)] flex items-center justify-center text-gray-400 hover:text-white hover:border-[var(--primary)]/50 transition-colors"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right: Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-md">
              {/* Code Card */}
              <motion.div
                className="glass rounded-2xl p-6 border border-[var(--border)] font-mono text-sm"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="text-gray-600 text-xs ml-2">rizal.ts</span>
                </div>
                <div className="space-y-1 text-xs leading-6">
                  <p><span className="text-[#c084fc]">const</span> <span className="text-[#38bdf8]">developer</span> <span className="text-gray-400">= {"{"}</span></p>
                  <p className="pl-4"><span className="text-[#86efac]">name</span><span className="text-gray-400">:</span> <span className="text-[#fbbf24]">&quot;{nama}&quot;</span><span className="text-gray-400">,</span></p>
                  <p className="pl-4"><span className="text-[#86efac]">role</span><span className="text-gray-400">:</span> <span className="text-[#fbbf24]">&quot;Fullstack Dev&quot;</span><span className="text-gray-400">,</span></p>
                  <p className="pl-4"><span className="text-[#86efac]">location</span><span className="text-gray-400">:</span> <span className="text-[#fbbf24]">&quot;Malang, ID&quot;</span><span className="text-gray-400">,</span></p>
                  <p className="pl-4"><span className="text-[#86efac]">stack</span><span className="text-gray-400">: [</span></p>
                  <p className="pl-8"><span className="text-[#fbbf24]">&quot;Next.js&quot;</span><span className="text-gray-400">,</span> <span className="text-[#fbbf24]">&quot;TypeScript&quot;</span><span className="text-gray-400">,</span></p>
                  <p className="pl-8"><span className="text-[#fbbf24]">&quot;Node.js&quot;</span><span className="text-gray-400">,</span> <span className="text-[#fbbf24]">&quot;Prisma&quot;</span><span className="text-gray-400">,</span></p>
                  <p className="pl-8"><span className="text-[#fbbf24]">&quot;MySQL&quot;</span><span className="text-gray-400">,</span> <span className="text-[#fbbf24]">&quot;Docker&quot;</span></p>
                  <p className="pl-4"><span className="text-gray-400">],</span></p>
                  <p className="pl-4"><span className="text-[#86efac]">available</span><span className="text-gray-400">:</span> <span className="text-[#c084fc]">true</span></p>
                  <p><span className="text-gray-400">{"}"}</span></p>
                </div>
              </motion.div>

              {/* Floating stat chips */}
              {statItems.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="absolute glass border border-[var(--border)] rounded-xl px-4 py-2 text-center"
                  style={{
                    top: `${15 + i * 30}%`,
                    right: i % 2 === 0 ? "-20%" : "-15%",
                  }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.15 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats (mobile) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="lg:hidden relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-12 grid grid-cols-3 gap-4"
      >
        {statItems.map((s) => (
          <div key={s.label} className="glass rounded-xl p-3 text-center">
            <div className="text-2xl font-bold gradient-text">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-gray-600 tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={18} className="text-gray-600" />
        </motion.div>
      </motion.div>
    </section>
  );
}
