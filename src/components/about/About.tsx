"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Code2, Heart, MapPin, Mail, Coffee } from "lucide-react";
import { personalInfo, services } from "@/lib/data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12 },
  }),
};

export default function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <section id="about" ref={ref} className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#6366f1]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#a855f7]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          custom={0}
          className="mb-16"
        >
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Tentang Saya
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white section-heading">
            Siapa Saya?
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left: Bio */}
          <div className="lg:col-span-3 space-y-6">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1}
              className="text-gray-300 text-base leading-relaxed"
            >
              {personalInfo.bio}
            </motion.p>
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={2}
              className="text-gray-400 text-base leading-relaxed"
            >
              {personalInfo.bio2}
            </motion.p>

            {/* Quick info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={3}
              className="grid sm:grid-cols-2 gap-3 pt-2"
            >
              {[
                { icon: MapPin, label: "Lokasi", value: "Malang, Jawa Timur" },
                { icon: Mail, label: "Email", value: personalInfo.email },
                { icon: Coffee, label: "Spesialis", value: "Next.js + TypeScript" },
                { icon: Heart, label: "Passion", value: "Clean Code & UX" },
              ].map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl glass border border-[var(--border)]"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-[#6366f1]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{label}</p>
                    <p className="text-sm text-gray-300 font-medium truncate">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Download CV */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={4}
            >
              <motion.a
                href="/rizal-ammar-cv.pdf"
                download
                className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Code2 size={15} />
                Download CV
              </motion.a>
            </motion.div>
          </div>

          {/* Right: Services */}
          <div className="lg:col-span-2 space-y-3">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              custom={1}
              className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-4"
            >
              Apa yang saya tawarkan
            </motion.p>
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                custom={i + 2}
                className="glass-card glass glass-hover rounded-xl p-4 cursor-default"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366f1]/20 to-[#a855f7]/10 flex items-center justify-center text-lg flex-shrink-0">
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1">{service.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{service.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
