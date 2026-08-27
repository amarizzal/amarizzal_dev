"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { SkillGroup, TechStackItem } from "@/lib/types";

function SkillBar({ name, level, color, delay }: { name: string; level: number; color: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-300 font-medium">{name}</span>
        <span className="text-xs text-gray-500">{level}%</span>
      </div>
      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay * 0.1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function Skills({
  groups,
  techStack,
}: {
  groups: SkillGroup[];
  techStack: TechStackItem[];
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="skills" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#6366f1]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Keahlian
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white section-heading">
            Tech Stack Saya
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg">
            Teknologi yang saya kuasai untuk membangun produk digital end-to-end.
          </p>
        </motion.div>

        {/* Skill bars grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {groups.map((cat, ci) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: ci * 0.1 }}
              className="glass rounded-2xl p-5 border border-[var(--border)] glass-hover"
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                />
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {cat.label}
                </h3>
              </div>
              <div className="space-y-4">
                {cat.items.map((skill, si) => (
                  <SkillBar
                    key={skill.id}
                    name={skill.name}
                    level={skill.level}
                    color={cat.color}
                    delay={ci * 5 + si}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tech Stack Ticker */}
        {techStack.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-center text-xs text-gray-600 uppercase tracking-widest mb-5">
              Teknologi yang pernah digunakan
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {techStack.map((tech, i) => (
                <motion.span
                  key={tech.id}
                  className="skill-chip px-3 py-1.5 rounded-full text-xs font-medium text-gray-400 cursor-default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.03, duration: 0.3 }}
                  whileHover={{ scale: 1.06 }}
                >
                  {tech.name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
