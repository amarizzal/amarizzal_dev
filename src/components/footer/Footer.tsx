"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Mail, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/SocialIcons";
import type { Profile } from "@/lib/types";

const navLinks = [
  { label: "Tentang", href: "#about" },
  { label: "Keahlian", href: "#skills" },
  { label: "Proyek", href: "#projects" },
  { label: "Pengalaman", href: "#experience" },
  { label: "Tulisan", href: "/blog" },
  { label: "Kontak", href: "#contact" },
];

export default function Footer({ profile }: { profile: Profile | null }) {
  const nama = profile?.nama ?? "Rizal Ammar";
  const [namaDepan, ...sisaNama] = nama.split(" ");

  const socials = [
    profile?.github_url ? { icon: GithubIcon, href: profile.github_url } : null,
    profile?.linkedin_url ? { icon: LinkedinIcon, href: profile.linkedin_url } : null,
    profile?.email ? { icon: Mail, href: `mailto:${profile.email}` } : null,
  ].filter((s): s is NonNullable<typeof s> => s !== null);

  return (
    <footer className="relative border-t border-[var(--border)] py-10">
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          background: "linear-gradient(to top, rgba(99,102,241,0.04), transparent)"
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#a855f7] flex items-center justify-center">
              <Code2 size={14} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">
              {namaDepan.toLowerCase()}
              <span className="gradient-text">{sisaNama.join(" ").toLowerCase()}</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-5 justify-center">
            {navLinks.map((link) =>
              link.href.startsWith("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Socials */}
          {socials.length > 0 && (
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href }, i) => (
                <motion.a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg glass border border-[var(--border)] flex items-center justify-center text-gray-500 hover:text-white hover:border-[#6366f1]/40 transition-colors"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Icon size={14} />
                </motion.a>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--border)]">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} {nama}. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Dibuat dengan ❤️ menggunakan{" "}
            <span className="text-[#6366f1]">Next.js</span> &{" "}
            <span className="text-[#a855f7]">Framer Motion</span>
          </p>
        </div>
      </div>

      {/* Back to top */}
      <motion.button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-xl btn-primary flex items-center justify-center shadow-lg z-30"
        whileHover={{ scale: 1.1, y: -2 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ArrowUp size={16} />
      </motion.button>
    </footer>
  );
}
