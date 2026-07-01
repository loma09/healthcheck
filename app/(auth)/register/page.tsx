'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUp, signOut, signInWithGoogle } from '@/lib/supabase';

export default function RegisterPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const [error, setError] = useState('');

  const handleGoogleRegister = async () => {
  try {
    await signInWithGoogle();
  } catch (err: any) {
    setError(err.message);
  }
};

  const handleChange = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#4CAF7D', '#059669'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Password tidak cocok.');
    if (!agreed) return setError('Harap setujui syarat & ketentuan.');

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signUp(form.name, form.email, form.password);
      // Selalu sign out terlepas dari auto-confirm Supabase,
      // supaya user harus login manual sesuai alur: register → login → dashboard
      await signOut();
      router.push('/login?registered=true');
    } catch (err: any) {
      const msg = err.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('fetch')) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet kamu, atau coba lagi beberapa saat.');
      } else {
        setError(msg || 'Pendaftaran gagal. Coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-blob1" />
        <div className="auth-left-blob2" />

        <Link href="/" className="auth-brand">
          <Shield size={28} color="white" strokeWidth={2.5} />
          <span>HealthCheck</span>
        </Link>

        <div className="auth-left-content">
          <h2 className="auth-left-title">Bergabung & mulai hidup lebih sehat hari ini</h2>
          <p className="auth-left-desc">Daftar gratis dan dapatkan akses ke semua fitur pemantauan kesehatan berbasis AI.</p>

          <div className="auth-features">
            {[
              { icon: <CheckCircle size={16} />, text: 'Gratis selamanya untuk fitur dasar' },
              { icon: <CheckCircle size={16} />, text: 'Data terenkripsi & terjaga privasi' },
              { icon: <CheckCircle size={16} />, text: 'AI insight personal setiap hari' },
              { icon: <CheckCircle size={16} />, text: 'Konsultasi dengan dokter berpengalaman' },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <div className="auth-feature-icon">{f.icon}</div>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="auth-left-stats">
          <div className="auth-stat"><span className="auth-stat-num">10K+</span><span className="auth-stat-label">Pengguna</span></div>
          <div className="auth-stat-sep" />
          <div className="auth-stat"><span className="auth-stat-num">4.9★</span><span className="auth-stat-label">Rating</span></div>
          <div className="auth-stat-sep" />
          <div className="auth-stat"><span className="auth-stat-num">98%</span><span className="auth-stat-label">Puas</span></div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <div className="auth-form-header">
            <h1 className="auth-form-title">Buat Akun Baru</h1>
            <p className="auth-form-sub">Mulai perjalanan hidup sehatmu bersama HealthCheck</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Nama Lengkap</label>
              <div className="auth-input-wrap">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Masukkan nama lengkap"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="nama@email.com"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Min. 8 karakter"
                  value={form.password}
                  onChange={handleChange('password')}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map(n => (
                      <div key={n} className="auth-strength-bar" style={{ background: n <= strength ? strengthColor : '#E5E7EB' }} />
                    ))}
                  </div>
                  <span className="auth-strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
            </div>

            <div className="auth-field">
              <label className="auth-label">Konfirmasi Password</label>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Ulangi password"
                  value={form.confirm}
                  onChange={handleChange('confirm')}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="auth-error">Password tidak cocok</p>
              )}
            </div>

            <label className="auth-checkbox-wrap">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="auth-checkbox" />
              <span className="auth-checkbox-label">
                Saya setuju dengan <a href="#" className="auth-switch-link">Syarat & Ketentuan</a> dan <a href="#" className="auth-switch-link">Kebijakan Privasi</a>
              </span>
            </label>

            {success && <p className="auth-error" style={{ textAlign: 'center', marginBottom: 0, color: '#4CAF7D', border: '1px solid #4CAF7D', background: 'rgba(76,175,125,0.1)' }}>{success}</p>}
            {error && <p className="auth-error" style={{ textAlign: 'center', marginBottom: 0 }}>{error}</p>}

            <button type="submit" className={`auth-submit${loading ? ' loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>Buat Akun <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>atau</span></div>

          <button className="auth-google-btn" type="button" onClick={handleGoogleRegister}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            Daftar dengan Google
          </button>

          <p className="auth-switch">
            Sudah punya akun? <Link href="/login" className="auth-switch-link">Masuk di sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
