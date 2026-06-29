'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Shield, Activity, Brain, Moon, Droplets,
  TrendingUp, ChevronRight, Star, Heart, Zap, CheckCircle
} from 'lucide-react';

/* ── Animated counter hook ── */
function useCountUp(target: number, suffix = '', duration = 1800) {
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const isDecimal = String(target).includes('.');

        const tick = (now: number) => {
          const pct = Math.min((now - start) / duration, 1);
          // ease out cubic
          const ease = 1 - Math.pow(1 - pct, 3);
          const val = isDecimal
            ? (ease * target).toFixed(1)
            : Math.floor(ease * target).toLocaleString();
          el.textContent = val + suffix;
          if (pct < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, suffix, duration]);

  return ref;
}

/* ── Scroll reveal hook ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

// Komponen FAQ — taruh sebelum export default LandingPage
const faqs = [
  {
    q: 'Apakah HealthCheck benar-benar gratis?',
    a: 'Ya, fitur dasar HealthCheck sepenuhnya gratis tanpa batas waktu. Kamu bisa mencatat pemeriksaan kesehatan, aktivitas, nutrisi, dan tidur tanpa biaya apapun. Fitur premium seperti AI insight mendalam dan analisis lanjutan tersedia di paket Pro.',
  },
  {
    q: 'Data kesehatan saya aman?',
    a: 'Keamanan data adalah prioritas utama kami. Semua data dienkripsi dengan standar AES-256 saat tersimpan dan TLS 1.3 saat transmisi. Kami tidak menjual atau membagikan data pribadimu ke pihak manapun.',
  },
  {
    q: 'Apakah HealthCheck bisa diakses di HP?',
    a: 'HealthCheck adalah Progressive Web App (PWA) yang berjalan optimal di semua perangkat — desktop, tablet, maupun smartphone. Kamu bisa install langsung dari browser tanpa perlu ke App Store atau Play Store.',
  },
  {
    q: 'Seberapa akurat insight AI-nya?',
    a: 'AI HealthCheck dilatih untuk memberikan rekomendasi berbasis data kesehatanmu sendiri, bukan rekomendasi generik. Semakin rutin kamu mencatat, semakin personal dan akurat insight yang dihasilkan. Namun insight AI bukan pengganti diagnosis dokter.',
  },
  {
    q: 'Bisakah saya ekspor data kesehatan saya?',
    a: 'Ya, kamu bisa mengekspor seluruh riwayat data kesehatanmu dalam format PDF atau CSV kapan saja. Fitur ini tersedia untuk semua pengguna, termasuk akun gratis.',
  },
];

function FAQItem({ q, a }: { q: string; a: string; index?: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`faq-item ${open ? 'faq-item-open' : ''}`}
      onClick={() => setOpen(o => !o)}
    >
      <div className="faq-question">
        <span>{q}</span>
        <div className={`faq-icon ${open ? 'faq-icon-open' : ''}`}>
          <ChevronRight size={16} />
        </div>
      </div>
      {open && (
        <div className="faq-answer">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  useReveal();

  const refCount1 = useCountUp(10000, '+');
  const refCount2 = useCountUp(4.9, '');
  const refCount3 = useCountUp(98, '%');

  return (
    <div className="landing-root">

      {/* ── NAVBAR ── */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="landing-brand">
            <Shield size={26} color="#4CAF7D" strokeWidth={2.5} />
            <span className="landing-brand-text">HealthCheck</span>
          </div>
          <div className="landing-nav-links">
            <a href="#features" className="landing-nav-link">Fitur</a>
            <a href="#how" className="landing-nav-link">Cara Kerja</a>
            <a href="#testimonials" className="landing-nav-link">Ulasan</a>
          </div>
          <div className="landing-nav-cta">
            <Link href="/login" className="landing-nav-btn-ghost">Masuk</Link>
            <Link href="/register" className="landing-nav-btn-primary">Mulai Gratis</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="landing-hero-blob1" />
        <div className="landing-hero-blob2" />
        <div className="landing-hero-blob3" />

        <div className="landing-hero-inner">
          <div className="landing-badge hero-enter-1">
            <Zap size={12} fill="#4CAF7D" color="#4CAF7D" />
            <span>Pantau Kesehatanmu Setiap Hari</span>
          </div>

          <h1 className="landing-hero-title hero-enter-2">
            Kesehatan Optimal<br />
            <span className="landing-hero-gradient">Dimulai dari Sini</span>
          </h1>

          <p className="landing-hero-desc hero-enter-3">
            HealthCheck adalah platform pemantau kesehatan pribadi cerdas. Catat pemeriksaan rutin,
            lacak nutrisi, olahraga, dan tidurmu — lalu dapatkan insight AI yang dipersonalisasi setiap harinya.
          </p>

          <div className="landing-hero-actions hero-enter-4">
            <Link href="/register" className="landing-btn-primary-lg">
              Mulai Sekarang — Gratis
              <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="landing-btn-ghost-lg">
              Sudah punya akun? Masuk
            </Link>
          </div>

          <div className="landing-hero-stats hero-enter-5">
            <div className="landing-stat">
              <span className="landing-stat-num">
                <span ref={refCount1}>10.000+</span>
              </span>
              <span className="landing-stat-label">Pengguna Aktif</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-num">
                <span ref={refCount2}>4.9</span>
              </span>
              <span className="landing-stat-label">Rating App</span>
            </div>
            <div className="landing-stat-divider" />
            <div className="landing-stat">
              <span className="landing-stat-num">
                <span ref={refCount3}>98%</span>
              </span>
              <span className="landing-stat-label">Kepuasan User</span>
            </div>
          </div>
        </div>

        {/* Floating Dashboard Preview */}
        <div className="landing-hero-preview">
          <div className="landing-preview-card main hero-card-1">
            <div className="lp-card-header">
              <Activity size={16} color="#4CAF7D" />
              <span>Skor Kesehatan Minggu Ini</span>
            </div>
            <div className="lp-card-score">82.5</div>
            <div className="lp-card-trend">
              <TrendingUp size={12} color="#4CAF7D" />
              <span style={{ color: '#4CAF7D' }}>+4.3% dari minggu lalu</span>
            </div>
            <div className="lp-dot-grid">
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className={`lp-dot ${i < 18 ? 'lp-dot-active' : ''} ${i < 10 ? 'lp-dot-dark' : ''}`} />
              ))}
            </div>
          </div>

          <div className="landing-preview-card vitals hero-card-2">
            <div className="lp-vital"><Heart size={14} color="#EF4444" /><span>Tekanan Darah</span><strong>120/80</strong></div>
            <div className="lp-vital"><Droplets size={14} color="#3B82F6" /><span>Gula Darah</span><strong>95 mg/dL</strong></div>
            <div className="lp-vital"><Moon size={14} color="#8B5CF6" /><span>Tidur</span><strong>7.5 jam</strong></div>
          </div>

          <div className="landing-preview-card ai hero-card-3">
            <div className="lp-ai-header">
              <Brain size={14} color="white" />
              <span>AI Insight</span>
            </div>
            <p className="lp-ai-text">Aktivitas fisik Anda minggu ini meningkat 15%. Pertahankan konsumsi air minimal 2L/hari.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-section" id="features">
        <div className="landing-section-inner">
          <div className="landing-section-label reveal">Fitur Unggulan</div>
          <h2 className="landing-section-title reveal reveal-d1">
            Semua yang Anda Butuhkan<br />untuk Hidup Lebih Sehat
          </h2>
          <p className="landing-section-desc reveal reveal-d2">
            Empat modul terintegrasi yang bekerja bersama untuk memberikan gambaran menyeluruh tentang kesehatan Anda.
          </p>

          <div className="landing-features-grid">
            {[
              { icon: <Activity size={24} />, color: '#4CAF7D', bg: 'rgba(76,175,125,0.12)', title: 'Pemeriksaan Rutin', desc: 'Catat tekanan darah, gula darah, detak jantung, dan berat badan. Visualisasikan tren kesehatanmu secara real-time.' },
              { icon: <Droplets size={24} />, color: '#3B82F6', bg: 'rgba(59,130,246,0.12)', title: 'Nutrisi & Hidrasi', desc: 'Track kalori, makronutrien, dan asupan air harian. Rekomendasi diet personal berdasarkan data kesehatanmu.' },
              { icon: <TrendingUp size={24} />, color: '#F59E0B', bg: 'rgba(245,158,11,0.12)', title: 'Aktivitas Fisik', desc: 'Pantau langkah kaki, durasi olahraga, dan kalori terbakar. Tetapkan target dan rayakan pencapaianmu.' },
              { icon: <Moon size={24} />, color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)', title: 'Kualitas Tidur', desc: 'Analisis pola tidurmu setiap malam. Dapatkan rekomendasi untuk meningkatkan kualitas istirahatmu.' },
              { icon: <Brain size={24} />, color: '#EC4899', bg: 'rgba(236,72,153,0.12)', title: 'Insight AI Personal', desc: 'Kecerdasan buatan menganalisis semua data kesehatanmu dan memberikan saran yang dipersonalisasi setiap hari.' },
              { icon: <Shield size={24} />, color: '#2D9E6B', bg: 'rgba(45,158,107,0.12)', title: 'Konsultasi Dokter', desc: 'Terhubung dengan dokter berpengalaman kapan saja. Telepon, chat, atau video call langsung dari aplikasi.' },
            ].map((f, i) => (
              <div
                key={i}
                className={`landing-feature-card reveal reveal-d${Math.min(i + 1, 6)}`}
              >
                <div className="landing-feature-icon" style={{ background: f.bg, color: f.color }}>{f.icon}</div>
                <h3 className="landing-feature-title">{f.title}</h3>
                <p className="landing-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-section landing-how" id="how">
        <div className="landing-section-inner">
          <div className="landing-section-label reveal">Cara Kerja</div>
          <h2 className="landing-section-title reveal reveal-d1">Mulai dalam 3 Langkah Mudah</h2>

          <div className="landing-steps">
            {[
              { n: '01', title: 'Buat Akun', desc: 'Daftar gratis dalam 30 detik. Tidak perlu kartu kredit.' },
              { n: '02', title: 'Catat Kesehatanmu', desc: 'Input data pemeriksaan, olahraga, nutrisi, dan tidur setiap hari.' },
              { n: '03', title: 'Dapatkan Insight', desc: 'AI menganalisis datamu dan memberikan rekomendasi personal yang actionable.' },
            ].map((s, i) => (
              <div key={i} className={`landing-step reveal reveal-d${i + 1}`}>
                <div className="landing-step-num">{s.n}</div>
                <h3 className="landing-step-title">{s.title}</h3>
                <p className="landing-step-desc">{s.desc}</p>
                {i < 2 && <div className="landing-step-arrow"><ChevronRight size={20} /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="landing-section" id="testimonials">
        <div className="landing-section-inner">
          <div className="landing-section-label reveal">Ulasan Pengguna</div>
          <h2 className="landing-section-title reveal reveal-d1">Dipercaya Ribuan Orang</h2>

          <div className="landing-testimonials">
            {[
              { name: 'Budi Santoso', role: 'Pengusaha, 45 th', text: 'Sejak pakai HealthCheck, tekanan darah saya yang tadinya tinggi kini terkontrol. Dokternya juga responsif banget!', rating: 5, avatar: 'B' },
              { name: 'dr. Rina Sari', role: 'Dokter Umum', text: 'Sebagai dokter, saya sangat mengapresiasi detail data yang bisa saya akses. Membantu saya memberikan rekomendasi yang lebih tepat.', rating: 5, avatar: 'R' },
              { name: 'Siti Rahayu', role: 'Ibu Rumah Tangga, 38 th', text: 'Interface-nya sangat mudah dipakai. AI insight-nya juga akurat banget, beneran berasa punya asisten kesehatan pribadi!', rating: 5, avatar: 'S' },
            ].map((t, i) => (
              <div key={i} className={`landing-testi-card reveal reveal-d${i + 1}`}>
                <div className="landing-testi-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} fill="#F59E0B" color="#F59E0B" />
                  ))}
                </div>
                <p className="landing-testi-text">"{t.text}"</p>
                <div className="landing-testi-author">
                  <div className="landing-testi-avatar">{t.avatar}</div>
                  <div>
                    <div className="landing-testi-name">{t.name}</div>
                    <div className="landing-testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="landing-section landing-faq" id="faq">
        <div className="landing-section-inner">
          <div className="landing-section-label reveal"></div>
          <h2 className="landing-section-title reveal reveal-d1">
            Frequently Asked Questions
          </h2>
          <p className="landing-section-desc reveal reveal-d2">
            Belum menemukan jawaban yang kamu cari?{' '}
            <a href="mailto:hello@healthcheck.id" className="faq-contact-link">
              Hubungi kami
            </a>
            .
          </p>

          <div className="faq-list">
            {faqs.map((f, i) => (
              <FAQItem key={i} q={f.q} a={f.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="landing-cta-section">
        <div className="landing-cta-blob1" />
        <div className="landing-cta-blob2" />
        <div className="landing-cta-inner">
          <h2 className="landing-cta-title reveal">Mulai Perjalanan Hidup Sehat Anda</h2>
          <p className="landing-cta-desc reveal reveal-d1">
            Bergabung dengan lebih dari 10.000 pengguna yang sudah merasakan manfaatnya. Gratis selamanya untuk fitur dasar.
          </p>
          <div className="landing-cta-actions reveal reveal-d2">
            <Link href="/register" className="landing-btn-primary-lg white">
              Daftar Sekarang — Gratis
              <ChevronRight size={18} />
            </Link>
          </div>
          <div className="landing-cta-perks reveal reveal-d3">
            {['Tidak perlu kartu kredit', 'Setup dalam 2 menit', 'Data 100% aman & terenkripsi'].map((p, i) => (
              <div key={i} className="landing-cta-perk">
                <CheckCircle size={14} color="#4CAF7D" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-brand" style={{ marginBottom: 8 }}>
            <Shield size={20} color="#4CAF7D" strokeWidth={2.5} />
            <span className="landing-brand-text" style={{ fontSize: 15 }}>HealthCheck</span>
          </div>
          <p className="landing-footer-copy">© 2025 HealthCheck. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}