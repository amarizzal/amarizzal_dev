export const personalInfo = {
  name: "Rizal Ammar",
  title: "Fullstack Developer",
  tagline: "Membangun Produk Digital yang Berdampak",
  location: "Malang, Jawa Timur",
  email: "rizalama11.ra@gmail.com",
  github: "https://github.com/rizalammar",
  linkedin: "https://linkedin.com/in/rizalammar",
  whatsapp: "https://wa.me/6281234567890",
  bio: "Halo! Saya Rizal Ammar, fullstack developer berbasis di Malang dengan pengalaman membangun web dan aplikasi modern. Saya spesialis dalam ekosistem JavaScript/TypeScript — mulai dari interface yang indah hingga backend yang tangguh.",
  bio2: "Saya percaya bahwa teknologi harus memecahkan masalah nyata. Setiap baris kode yang saya tulis bertujuan memberikan pengalaman terbaik bagi pengguna dan nilai bisnis yang terukur.",
  yearsOfExperience: 3,
  projectsCompleted: 20,
  clientsSatisfied: 15,
};

export const skills = {
  frontend: [
    { name: "Next.js", level: 92, icon: "▲" },
    { name: "React", level: 90, icon: "⚛" },
    { name: "TypeScript", level: 85, icon: "TS" },
    { name: "Tailwind CSS", level: 92, icon: "🎨" },
    { name: "Framer Motion", level: 80, icon: "✨" },
  ],
  backend: [
    { name: "Node.js", level: 85, icon: "🟢" },
    { name: "Express.js", level: 82, icon: "🚂" },
    { name: "Prisma ORM", level: 88, icon: "🔷" },
    { name: "REST API", level: 88, icon: "🔌" },
    { name: "JWT Auth", level: 82, icon: "🔐" },
  ],
  database: [
    { name: "MySQL", level: 85, icon: "🐬" },
    { name: "PostgreSQL", level: 78, icon: "🐘" },
    { name: "MongoDB", level: 72, icon: "🍃" },
    { name: "Redis", level: 65, icon: "⚡" },
  ],
  tools: [
    { name: "Git / GitHub", level: 90, icon: "🐙" },
    { name: "Docker", level: 72, icon: "🐳" },
    { name: "Linux / VPS", level: 78, icon: "🐧" },
    { name: "Figma", level: 70, icon: "🎭" },
  ],
};

export const techStack = [
  "Next.js", "React", "TypeScript", "Node.js", "Express",
  "Prisma", "MySQL", "PostgreSQL", "MongoDB",
  "Tailwind CSS", "Framer Motion", "shadcn/ui",
  "Git", "Docker", "Linux", "REST API", "JWT",
  "Vercel", "Railway", "Nginx",
];

export const projects = [
  {
    title: "Poultry Breeder Management",
    description: "Platform manajemen peternakan unggas lengkap dengan dashboard analitik, simulasi berat badan, konsumsi pakan, dan penilaian ternak secara real-time.",
    tech: ["Next.js", "TypeScript", "Prisma", "MySQL", "Tailwind CSS"],
    category: "Full-Stack App",
    color: "#6366f1",
    featured: true,
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "E-Commerce Platform",
    description: "Platform e-commerce modern dengan fitur manajemen produk, keranjang belanja, integrasi pembayaran Midtrans, dan panel admin komprehensif.",
    tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    category: "E-Commerce",
    color: "#06b6d4",
    featured: true,
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "SaaS Dashboard Analytics",
    description: "Dashboard analitik berbasis SaaS untuk bisnis skala menengah dengan visualisasi data real-time, laporan otomatis, dan multi-tenant architecture.",
    tech: ["React", "TypeScript", "Express", "MongoDB", "Chart.js"],
    category: "SaaS",
    color: "#a855f7",
    featured: true,
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "REST API Microservices",
    description: "Arsitektur microservices untuk sistem enterprise dengan API gateway, service discovery, dan logging terpusat menggunakan Docker.",
    tech: ["Node.js", "Docker", "Redis", "MySQL", "JWT"],
    category: "Backend",
    color: "#22c55e",
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Company Profile + CMS",
    description: "Website company profile profesional dilengkapi CMS custom untuk pengelolaan konten mandiri — blog, portofolio, dan halaman dinamis.",
    tech: ["Next.js", "Prisma", "MySQL", "Tailwind CSS"],
    category: "Website",
    color: "#f59e0b",
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    title: "Mobile-First POS System",
    description: "Sistem Point of Sale mobile-first untuk UMKM dengan fitur offline mode, sinkronisasi data, dan laporan penjualan harian.",
    tech: ["React", "Node.js", "SQLite", "PWA"],
    category: "PWA",
    color: "#ef4444",
    featured: false,
    liveUrl: "#",
    githubUrl: "#",
  },
];

export const experiences = [
  {
    role: "Fullstack Developer — Freelance",
    company: "Independent / Remote",
    period: "2023 — Sekarang",
    description: "Mengerjakan berbagai proyek website dan aplikasi web untuk klien dari Malang dan luar kota. Fokus pada Next.js, TypeScript, dan solusi berbasis cloud.",
    highlights: [
      "Membangun 15+ aplikasi web production-ready",
      "Pengelolaan server VPS dan deployment CI/CD",
      "Kolaborasi langsung dengan klien untuk desain sistem",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Startup Lokal Malang",
    period: "2022 — 2023",
    description: "Mengembangkan dan memaintain antarmuka pengguna menggunakan React dan Next.js. Berkolaborasi dengan tim backend untuk integrasi API.",
    highlights: [
      "Migrasi codebase dari CRA ke Next.js",
      "Implementasi design system dengan Tailwind CSS",
      "Optimasi performa web (Core Web Vitals)",
    ],
  },
  {
    role: "Web Developer — Intern",
    company: "Digital Agency Malang",
    period: "2021 — 2022",
    description: "Magang sebagai web developer, membantu pengembangan website klien dan belajar workflow profesional dalam tim.",
    highlights: [
      "Membangun 5+ website klien dari desain ke deployment",
      "Belajar version control dan code review",
      "Fundamental database design dan REST API",
    ],
  },
];

export const services = [
  {
    icon: "🖥️",
    title: "Website & Landing Page",
    description: "Website profesional yang cepat, SEO-friendly, dan responsif di semua perangkat. Dari company profile hingga landing page konversi tinggi.",
  },
  {
    icon: "⚡",
    title: "Web Application",
    description: "Aplikasi web kompleks dengan fitur lengkap — dashboard, manajemen data, autentikasi, dan integrasi API pihak ketiga.",
  },
  {
    icon: "🔌",
    title: "Backend & API",
    description: "REST API yang robust dan scalable. Database design, autentikasi JWT, dan infrastruktur backend yang aman dan maintainable.",
  },
  {
    icon: "🚀",
    title: "Konsultasi & Optimasi",
    description: "Audit performa website, optimasi SEO teknis, code review, dan konsultasi arsitektur sistem untuk bisnis yang ingin scale.",
  },
];
