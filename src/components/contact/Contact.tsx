"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, MessageSquare, Send, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import { personalInfo } from "@/lib/data";

const contactLinks = [
  {
    icon: Mail,
    label: "Email",
    value: personalInfo.email,
    href: `mailto:${personalInfo.email}`,
    color: "#6366f1",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: personalInfo.whatsapp,
    color: "#22c55e",
  },
  {
    icon: GithubIcon,
    label: "GitHub",
    value: "github.com/rizalammar",
    href: personalInfo.github,
    color: "#e2e8f0",
  },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    value: "linkedin.com/in/rizalammar",
    href: personalInfo.linkedin,
    color: "#0ea5e9",
  },
];

export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate send
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section id="contact" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 hero-bg pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6366f1]/30 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="text-[#6366f1] text-sm font-semibold tracking-widest uppercase mb-2">
            — Kontak
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Mari Berkolaborasi
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Punya proyek atau ide? Saya siap membantu mewujudkannya. Hubungi saya sekarang!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left: Info */}
          <div className="lg:col-span-2 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass rounded-2xl p-6 border border-[var(--border)]"
            >
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-[#6366f1]" />
                <span className="text-white font-semibold text-sm">Lokasi</span>
              </div>
              <p className="text-gray-400 text-sm">Malang, Jawa Timur, Indonesia</p>
              <p className="text-gray-600 text-xs mt-1">Tersedia untuk remote & onsite</p>
            </motion.div>

            <div className="space-y-3">
              {contactLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 glass rounded-xl p-4 border border-[var(--border)] glass-hover group"
                  whileHover={{ x: 4 }}
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                    style={{ background: `${link.color}15`, border: `1px solid ${link.color}25` }}
                  >
                    <link.icon size={16} style={{ color: link.color }} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">{link.label}</p>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors truncate">
                      {link.value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-5 border border-[#22c55e]/20 bg-[#22c55e]/5"
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-400 pulse-glow-anim" />
                <span className="text-green-400 text-sm font-semibold">Available for Work</span>
              </div>
              <p className="text-gray-500 text-xs">
                Saat ini saya open untuk proyek freelance dan kontrak jangka pendek/panjang.
              </p>
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-6 sm:p-8 border border-[var(--border)] space-y-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-[#6366f1]" />
                <h3 className="text-white font-semibold">Kirim Pesan</h3>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Nama *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Budi Santoso"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-gray-500 font-medium">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="budi@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-medium">Subjek *</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  placeholder="Misal: Butuh website company profile"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 font-medium">Pesan *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Ceritakan proyek atau kebutuhan Anda..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-[var(--border)] text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6366f1]/50 transition-colors resize-none"
                />
              </div>

              <motion.button
                type="submit"
                disabled={status === "sending" || status === "sent"}
                className="w-full btn-primary py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                whileHover={status === "idle" ? { scale: 1.02 } : {}}
                whileTap={status === "idle" ? { scale: 0.98 } : {}}
              >
                {status === "idle" && (
                  <>
                    <Send size={15} />
                    Kirim Pesan
                  </>
                )}
                {status === "sending" && (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Mengirim...
                  </>
                )}
                {status === "sent" && "✓ Pesan Terkirim!"}
                {status === "error" && "Gagal. Coba lagi."}
              </motion.button>

              <p className="text-xs text-gray-600 text-center">
                Atau hubungi langsung via WhatsApp untuk respon lebih cepat
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
