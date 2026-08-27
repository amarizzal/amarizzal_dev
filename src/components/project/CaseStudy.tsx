"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ExternalLink, ArrowRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import type { ProjectDetail } from "@/lib/types";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
}

export default function CaseStudy({ project }: { project: ProjectDetail }) {
  const accent = project.accent_color;
  // "Jangan cetak URL yang mati" — aturan sendiri dari brief IG-POST-02-AKASHA.
  const tampilkanLiveUrl = project.live_status === "live" && Boolean(project.live_url);
  const metrikPublik = project.metrics.filter((m) => m.is_public);

  return (
    <article>
      {/* Hero */}
      <header className="relative pt-32 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 20%, ${accent}, transparent 60%)` }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <Reveal>
            <span
              className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: `${accent}20`, color: accent, border: `1px solid ${accent}30` }}
            >
              {project.category}
              {project.client_name ? ` · ${project.client_name}` : ""}
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight mb-6">
              {project.title}
            </h1>
            {project.core_insight && (
              <p className="text-gray-300 text-lg leading-relaxed border-l-2 pl-4 mb-8" style={{ borderColor: accent }}>
                {project.core_insight}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-8">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2.5 py-1 rounded-md bg-white/5 text-gray-400 border border-white/5">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {tampilkanLiveUrl && (
                <a
                  href={project.live_url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: accent }}
                >
                  <ExternalLink size={14} />
                  Kunjungi Situs
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold glass border border-[var(--border)] text-gray-300 hover:text-white"
                >
                  <GithubIcon size={14} />
                  Lihat Kode
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      {/* Sections */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-16 pb-16">
        {project.sections.map((section) => {
          const poin = section.items.filter((i) => i.kind === "poin");
          const baris = section.items.filter((i) => i.kind === "baris");

          return (
            <Reveal key={section.id}>
              <section>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: accent }}
                >
                  {section.label}
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-5">
                  {section.heading}
                </h2>

                {section.highlight && (
                  <div
                    className="inline-block text-2xl font-bold rounded-xl px-4 py-2 mb-5"
                    style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    {section.highlight}
                  </div>
                )}

                {section.body_html && (
                  <div
                    className="prose-artikel"
                    dangerouslySetInnerHTML={{ __html: section.body_html }}
                  />
                )}

                {poin.length > 0 && (
                  <ol className="mt-6 space-y-3">
                    {poin.map((item, i) => (
                      <li key={item.id} className="flex items-start gap-3 text-gray-400 text-sm">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: `${accent}20`, color: accent }}
                        >
                          {i + 1}
                        </span>
                        <span className="pt-0.5">{item.kiri}</span>
                      </li>
                    ))}
                  </ol>
                )}

                {baris.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {baris.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 glass rounded-xl p-4 border border-[var(--border)]"
                      >
                        <span
                          className="text-xs font-bold uppercase tracking-wider sm:w-40 flex-shrink-0"
                          style={{ color: accent }}
                        >
                          {item.kiri}
                        </span>
                        <span className="hidden sm:block text-gray-600">
                          <ArrowRight size={14} />
                        </span>
                        <span className="text-gray-300 text-sm">{item.kanan}</span>
                      </div>
                    ))}
                  </div>
                )}

                {section.media_path && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={section.media_path}
                    alt={section.heading}
                    className="w-full rounded-2xl border border-[var(--border)] mt-6"
                  />
                )}
              </section>
            </Reveal>
          );
        })}

        {metrikPublik.length > 0 && (
          <Reveal>
            <section>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: accent }}>
                Angka
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {metrikPublik.map((m) => (
                  <div key={m.id} className="glass rounded-xl p-5 border border-[var(--border)]">
                    <div className="text-2xl font-bold text-white mb-1">{m.value}</div>
                    <div className="text-sm text-gray-500">{m.label}</div>
                    {m.provenance === "client_claim" && (
                      <p className="text-xs text-gray-600 mt-2 italic">
                        Klaim dari pihak klien{m.note ? ` — ${m.note}` : ""}, bukan hasil pekerjaan developer.
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </article>
  );
}
