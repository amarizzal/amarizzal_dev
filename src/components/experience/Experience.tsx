"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, CheckCircle2 } from "lucide-react";
import type { Experience as ExperienceItem } from "@/lib/types";

export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="experience" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-20 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Riwayat
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white section-heading">
            Pengalaman Kerja
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg">
            Perjalanan karir saya sebagai developer dari intern hingga freelancer profesional.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <motion.div
            className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-[#6366f1] via-[#a855f7] to-transparent"
            initial={{ height: 0 }}
            animate={inView ? { height: "100%" } : { height: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />

          <div className="space-y-10 pl-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.15 }}
                className="relative"
              >
                {/* Timeline dot */}
                <motion.div
                  className="absolute -left-[2.85rem] w-4 h-4 rounded-full border-2 border-[#6366f1] bg-[#07070f] flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={inView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4 + i * 0.15, type: "spring" }}
                >
                  <div className="w-2 h-2 rounded-full bg-[#6366f1]" />
                </motion.div>

                {/* Card */}
                <div className="glass rounded-2xl p-6 border border-[var(--border)] glass-hover">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                    <div>
                      <h3 className="text-white font-bold text-base">{exp.role}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Briefcase size={13} className="text-[#6366f1]" />
                        <span className="text-[#6366f1] text-sm font-medium">{exp.company}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium px-3 py-1 rounded-full glass border border-[var(--border)] flex-shrink-0 self-start">
                      {exp.period}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>

                  <ul className="space-y-2">
                    {exp.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-500">
                        <CheckCircle2 size={14} className="text-[#6366f1] mt-0.5 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Education note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-12 glass rounded-2xl p-6 border border-[var(--border)] flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/20 flex items-center justify-center flex-shrink-0">
            🎓
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Pendidikan</h3>
            <p className="text-gray-500 text-sm">
              S1 Teknik Informatika · Universitas di Malang · Lulus 2022
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
