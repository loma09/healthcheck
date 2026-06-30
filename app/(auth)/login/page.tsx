'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { Shield, Eye, EyeOff, Mail, Lock, ArrowRight, Activity, Moon, Droplets, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, signInWithGoogle } from '@/lib/supabase';

function LoginForm() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get('registered') === 'true';
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
  try {
    await signInWithGoogle();
  } catch (err: any) {
    setError(err.message);
  }
};

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    await signIn(email, password);
    router.push('/dashboard');
  } catch (err: any) {
    setError(err.message || 'Login gagal. Periksa email dan password.');
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
          <h2 className="auth-left-title">Pantau kesehatan Anda setiap hari</h2>
          <p className="auth-left-desc">Platform AI-powered untuk monitoring kesehatan personal yang lengkap dan mudah digunakan.</p>

          <div className="auth-features">
            {[
              { icon: <Activity size={16} />, text: 'Pemeriksaan rutin terstruktur' },
              { icon: <Droplets size={16} />, text: 'Track nutrisi & hidrasi harian' },
              { icon: <TrendingUp size={16} />, text: 'Aktivitas fisik & target olahraga' },
              { icon: <Moon size={16} />, text: 'Analisis kualitas tidur' },
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
            <h1 className="auth-form-title">Selamat Datang Kembali</h1>
            <p className="auth-form-sub">Masuk untuk melanjutkan memantau kesehatanmu</p>
          </div>

          {justRegistered && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              background: 'rgba(76,175,125,0.1)',
              border: '1px solid #4CAF7D',
              borderRadius: 10,
              padding: '12px 14px',
              marginBottom: 4,
            }}>
              <CheckCircle2 size={18} color="#4CAF7D" style={{ marginTop: 1, flexShrink: 0 }} />
              <div>
                <p style={{ color: '#4CAF7D', fontWeight: 600, fontSize: 14, margin: 0 }}>
                  Akun berhasil dibuat!
                </p>
                <p style={{ color: '#86EFAC', fontSize: 13, margin: '2px 0 0' }}>
                  Silakan masuk menggunakan email dan password yang sudah didaftarkan.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label className="auth-label">Email</label>
              <div className="auth-input-wrap">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="auth-label">Password</label>
                <a href="#" className="auth-forgot">Lupa password?</a>
              </div>
              <div className="auth-input-wrap">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth-input"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth-eye" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="auth-error" style={{ textAlign: 'center', marginBottom: 0 }}>{error}</p>}

            <button type="submit" className={`auth-submit${loading ? ' loading' : ''}`} disabled={loading}>
              {loading ? (
                <span className="auth-spinner" />
              ) : (
                <>Masuk <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="auth-divider"><span>atau</span></div>

          <button className="auth-google-btn" type="button" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="auth-switch">
            Belum punya akun? <Link href="/register" className="auth-switch-link">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
