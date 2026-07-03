'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ChevronDown, CheckCircle2 } from 'lucide-react';

type ModalType = 'terms' | 'privacy';

interface LegalModalProps {
  type: ModalType;
  onClose: () => void;
  onRead?: () => void; // dipanggil setelah user scroll ke bawah & klik tombol
}

const content = {
  terms: {
    title: 'Syarat & Ketentuan',
    emoji: '📋',
    lastUpdated: '1 Juli 2026',
    sections: [
      {
        heading: '1. Penerimaan Syarat',
        body: 'Dengan mendaftar dan menggunakan aplikasi HealthCheck, kamu menyatakan bahwa kamu telah membaca, memahami, dan menyetujui syarat & ketentuan ini. Jika kamu tidak menyetujui salah satu bagian dari ketentuan ini, harap tidak menggunakan layanan kami.',
      },
      {
        heading: '2. Penggunaan Layanan',
        body: 'HealthCheck menyediakan platform pemantauan kesehatan pribadi berbasis AI. Layanan ini ditujukan untuk individu berusia 17 tahun ke atas. Kamu bertanggung jawab atas keamanan akun dan kerahasiaan kata sandimu. Dilarang menggunakan layanan ini untuk tujuan ilegal atau merugikan pihak lain.',
      },
      {
        heading: '3. Data Kesehatan',
        body: 'Data kesehatan yang kamu masukkan (berat badan, tekanan darah, dll.) digunakan semata-mata untuk memberikan analisis dan rekomendasi personal. HealthCheck bukan pengganti konsultasi medis profesional. Selalu konsultasikan kondisi kesehatanmu dengan dokter atau tenaga medis yang kompeten.',
      },
      {
        heading: '4. Kekayaan Intelektual',
        body: 'Seluruh konten, fitur, dan fungsionalitas aplikasi HealthCheck — termasuk namun tidak terbatas pada teks, grafis, logo, dan kode perangkat lunak — adalah milik eksklusif HealthCheck dan dilindungi oleh undang-undang hak cipta yang berlaku.',
      },
      {
        heading: '5. Penghentian Layanan',
        body: 'Kami berhak untuk menangguhkan atau menghentikan aksesmu ke layanan kapan saja, tanpa pemberitahuan, jika kami menemukan pelanggaran terhadap syarat & ketentuan ini atau penggunaan yang bersifat merugikan.',
      },
      {
        heading: '6. Batasan Tanggung Jawab',
        body: 'HealthCheck tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan menggunakan layanan kami, termasuk keputusan kesehatan yang diambil berdasarkan data dari platform ini.',
      },
      {
        heading: '7. Perubahan Syarat',
        body: 'Kami dapat memperbarui syarat & ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui aplikasi atau email terdaftar. Penggunaan layanan yang berlanjut setelah perubahan berlaku dianggap sebagai penerimaan terhadap syarat yang baru.',
      },
    ],
  },
  privacy: {
    title: 'Kebijakan Privasi',
    emoji: '🔒',
    lastUpdated: '1 Juli 2026',
    sections: [
      {
        heading: '1. Data yang Kami Kumpulkan',
        body: 'Kami mengumpulkan informasi yang kamu berikan secara langsung, seperti: nama lengkap, alamat email, tanggal lahir, jenis kelamin, serta data kesehatan (tinggi badan, berat badan, tekanan darah, dll.). Kami juga dapat mengumpulkan data penggunaan aplikasi secara anonim untuk keperluan peningkatan layanan.',
      },
      {
        heading: '2. Cara Kami Menggunakan Data',
        body: 'Data yang kami kumpulkan digunakan untuk: menyediakan dan mempersonalisasi layanan HealthCheck, menghasilkan analisis dan rekomendasi kesehatan berbasis AI, mengirimkan notifikasi dan pengingat kesehatan, serta meningkatkan kualitas dan keamanan platform kami.',
      },
      {
        heading: '3. Keamanan Data',
        body: 'Kami menggunakan enkripsi SSL/TLS untuk semua transmisi data. Data tersimpan di server Supabase yang memenuhi standar keamanan industri. Akses ke data pribadi dibatasi hanya untuk personel yang berwenang dengan kebutuhan bisnis yang sah.',
      },
      {
        heading: '4. Berbagi Data dengan Pihak Ketiga',
        body: 'Kami tidak menjual, menyewakan, atau memperdagangkan data pribadimu kepada pihak ketiga untuk tujuan pemasaran. Data hanya dibagikan kepada penyedia layanan teknis (seperti infrastruktur cloud) yang membantu kami menjalankan platform, tunduk pada perjanjian kerahasiaan yang ketat.',
      },
      {
        heading: '5. Hak-Hak Penggunamu',
        body: 'Kamu memiliki hak untuk: mengakses data pribadi yang kami simpan, meminta koreksi data yang tidak akurat, menghapus akun dan seluruh data terkait, serta mengajukan keberatan atas pemrosesan data tertentu. Hubungi kami melalui email untuk menggunakan hak-hakmu ini.',
      },
      {
        heading: '6. Cookie & Pelacakan',
        body: 'Kami menggunakan cookie yang diperlukan untuk autentikasi dan keamanan sesi. Kami tidak menggunakan cookie pelacakan pihak ketiga untuk iklan. Kamu dapat mengatur preferensi cookie melalui pengaturan browser.',
      },
      {
        heading: '7. Retensi Data',
        body: 'Data pribadimu akan disimpan selama akun aktif. Setelah penghapusan akun, data akan dihapus secara permanen dalam 30 hari, kecuali jika diperlukan untuk memenuhi kewajiban hukum.',
      },
      {
        heading: '8. Hubungi Kami',
        body: 'Jika kamu memiliki pertanyaan atau kekhawatiran mengenai kebijakan privasi ini, silakan hubungi tim kami melalui: privacy@healthcheck.id',
      },
    ],
  },
};

export default function LegalModal({ type, onClose, onRead }: LegalModalProps) {
  const data = content[type];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasRead, setHasRead] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  // Cek apakah user sudah scroll ke bawah (threshold: 90%)
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
    setScrollPct(Math.min(100, Math.round(pct * 100)));
    if (pct >= 0.9) setHasRead(true);
  };

  // Jika konten pendek (tidak perlu scroll), langsung mark as read
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollHeight <= el.clientHeight + 10) {
      setHasRead(true);
      setScrollPct(100);
    }
  }, []);

  const handleConfirm = () => {
    if (!hasRead) return;
    onRead?.();
    onClose();
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    // Prevent background scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 580,
          maxHeight: '85vh',
          background: 'white',
          borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          margin: '0 16px',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
              }}
            >
              {data.emoji}
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#111827',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {data.title}
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: 12,
                  color: '#9ca3af',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Terakhir diperbarui: {data.lastUpdated}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid #e5e7eb',
              background: '#f9fafb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#f9fafb')}
          >
            <X size={16} color="#6b7280" />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            overflowY: 'auto',
            padding: '24px 28px',
            flex: 1,
          }}
        >
          {data.sections.map((section, i) => (
            <div key={i} style={{ marginBottom: 24 }}>
              <h3
                style={{
                  margin: '0 0 8px',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#16a34a',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {section.heading}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: '#4b5563',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 28px 20px',
            borderTop: '1px solid #f3f4f6',
            flexShrink: 0,
          }}
        >
          {/* Scroll progress bar */}
          {!hasRead && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#9ca3af', fontFamily: "'Inter', sans-serif" }}>
                  Scroll untuk membaca selengkapnya
                </span>
                <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>
                  {scrollPct}%
                </span>
              </div>
              <div style={{ height: 4, background: '#f3f4f6', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${scrollPct}%`,
                  background: 'linear-gradient(90deg, #16a34a, #0d9488)',
                  borderRadius: 99,
                  transition: 'width 0.2s ease',
                }} />
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!hasRead}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: 12,
              border: 'none',
              background: hasRead
                ? 'linear-gradient(135deg, #16a34a, #0d9488)'
                : '#e5e7eb',
              color: hasRead ? 'white' : '#9ca3af',
              fontWeight: 600,
              fontSize: 14,
              cursor: hasRead ? 'pointer' : 'not-allowed',
              fontFamily: "'Inter', sans-serif",
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {hasRead ? (
              <><CheckCircle2 size={16} /> Saya Sudah Membaca</>
            ) : (
              <><ChevronDown size={16} /> Scroll ke Bawah Dulu</>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 24px)); }
          to { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}
