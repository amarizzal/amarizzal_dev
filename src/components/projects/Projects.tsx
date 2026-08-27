"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, Layers, FileText } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import type { Profile, Project } from "@/lib/types";

export default function Projects({
  projects,
  profile,
}: {
  projects: Project[];
  profile: Profile | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [filter, setFilter] = useState("Semua");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Kategori diturunkan dari project yang sungguh ada, bukan daftar tetap —
  // daftar lama (E-Commerce, PWA, dst.) sudah tidak relevan sejak project
  // filler diganti project nyata.
  const categories = useMemo(
    () => ["Semua", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const filtered = filter === "Semua" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#a855f7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Portofolio
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white section-heading">
              Proyek Pilihan
            </h2>
            <p className="text-gray-500 text-sm max-w-xs">
              Sebagian proyek yang telah saya kerjakan.
            </p>
          </div>
        </motion.div>

        {/* Filter tabs */}
        {categories.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                  filter === cat
                    ? "bg-[#6366f1] text-white"
                    : "glass border border-[var(--border)] text-gray-400 hover:text-white hover:border-[#6366f1]/40"
                }`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {cat}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Project Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="card-project rounded-2xl overflow-hidden group cursor-pointer"
                onMouseEnter={() => setHoveredId(project.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Card top bar */}
                <div
                  className="h-1 w-full"
                  style={{ background: `linear-gradient(90deg, ${project.accent_color}80, ${project.accent_color})` }}
                />

                {/* Card visual placeholder */}
                <Link href={`/project/${project.slug}`} className="block">
                  <div
                    className="h-40 flex items-center justify-center relative overflow-hidden"
                    style={{ background: `${project.accent_color}08` }}
                  >
                    {/* Grid pattern overlay */}
                    <div
                      className="absolute inset-0 opacity-30"
                      style={{
                        backgroundImage: `linear-gradient(${project.accent_color}18 1px, transparent 1px), linear-gradient(90deg, ${project.accent_color}18 1px, transparent 1px)`,
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <motion.div
                      className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `${project.accent_color}15`, border: `1px solid ${project.accent_color}30` }}
                      animate={hoveredId === project.id ? { rotate: [0, 5, -5, 0], scale: 1.1 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Layers size={28} style={{ color: project.accent_color }} />
                    </motion.div>

                    {project.featured && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ background: `${project.accent_color}20`, color: project.accent_color, border: `1px solid ${project.accent_color}30` }}>
                        <Star size={10} fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>
                </Link>

                {/* Card content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Link href={`/project/${project.slug}`}>
                      <h3 className="text-white font-bold text-base leading-tight group-hover:text-white/90">
                        {project.title}
                      </h3>
                    </Link>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${project.accent_color}15`, color: project.accent_color }}
                    >
                      {project.category}
                    </span>
                  </div>

                  <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tech.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-500 border border-white/5"
                      >
                        {t}
                      </span>
                    ))}
                    {project.tech.length > 4 && (
                      <span className="text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-600">
                        +{project.tech.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Links */}
                  <div className="flex gap-2">
                    <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                      <Link
                        href={`/project/${project.slug}`}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-opacity"
                        style={{ background: project.accent_color }}
                      >
                        <FileText size={12} />
                        Studi Kasus
                      </Link>
                    </motion.div>
                    {project.live_status === "live" && project.live_url && (
                      <motion.a
                        href={project.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ExternalLink size={12} />
                      </motion.a>
                    )}
                    {project.github_url && (
                      <motion.a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold glass border border-[var(--border)] text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <GithubIcon size={12} />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* CTA */}
        {profile?.github_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="text-center mt-10"
          >
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#6366f1] transition-colors"
            >
              <GithubIcon size={16} />
              Lihat semua proyek di GitHub →
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
