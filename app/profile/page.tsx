'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, Mail, Phone, Calendar, Ruler, Weight,
  Camera, ArrowLeft, Check, AlertCircle, Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase';

type Profile = {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  height_cm: string;
  avatar_url: string;
};

type HealthData = {
  weight_kg: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState<Profile>({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    height_cm: '',
    avatar_url: '',
  });

  const [health, setHealth] = useState<HealthData>({ weight_kg: '' });

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  // Load user data
  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: prof } = await supabase
        .from('users')
        .select('name, email, phone, date_of_birth, gender, height_cm, avatar_url')
        .eq('id', user.id)
        .single();

      if (prof) {
        setForm({
          name: prof.name || '',
          email: prof.email || '',
          phone: prof.phone || '',
          date_of_birth: prof.date_of_birth || '',
          gender: prof.gender || '',
          height_cm: prof.height_cm?.toString() || '',
          avatar_url: prof.avatar_url || '',
        });
        if (prof.avatar_url) setAvatarPreview(prof.avatar_url);
      }

      // Ambil berat terbaru
      const { data: hc } = await supabase
        .from('health_checks')
        .select('weight_kg')
        .eq('user_id', user.id)
        .not('weight_kg', 'is', null)
        .order('checked_at', { ascending: false })
        .limit(1)
        .single();

      if (hc) setHealth({ weight_kg: hc.weight_kg?.toString() || '' });
      setLoading(false);
    })();
  }, [router]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    setStatus(null);

    try {
      const supabase = createClient();
      let avatar_url = form.avatar_url;

      // Validasi umur tidak boleh dari masa depan
      if (form.date_of_birth) {
        if (new Date(form.date_of_birth).getTime() > new Date().getTime()) {
          throw new Error('Tanggal lahir tidak valid (tidak boleh melebihi hari ini).');
        }
      }

      // Upload avatar jika ada file baru
      if (avatarFile) {
        const ext = avatarFile.name.split('.').pop();
        const path = `avatars/${userId}.${ext}`;
        const { error: uploadErr } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });
        if (uploadErr) throw uploadErr;
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
        avatar_url = urlData.publicUrl;
      }

      // Update profil
      const { error: profErr } = await supabase
        .from('users')
        .update({
          name: form.name,
          phone: form.phone || null,
          date_of_birth: form.date_of_birth || null,
          gender: form.gender || null,
          height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
          avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (profErr) throw profErr;

      // Insert berat badan baru jika diubah
      if (health.weight_kg) {
        const { error: hcErr } = await supabase
          .from('health_checks')
          .insert({
            user_id: userId,
            checked_at: new Date().toISOString(),
            weight_kg: parseFloat(health.weight_kg),
          });
        if (hcErr) throw hcErr;
      }

      setStatus({ type: 'success', msg: 'Profil berhasil disimpan!' });
    } catch (err: any) {
      setStatus({ type: 'error', msg: err.message || 'Gagal menyimpan profil.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={28} color="#16a34a" style={{ animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const initials = form.name ? form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={() => router.back()}
          style={{
            width: 36, height: 36, borderRadius: 10,
            border: '1.5px solid #e5e7eb', background: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} color="#374151" />
        </button>
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Edit Profil</h1>
          <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Perbarui informasi akunmu</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            marginLeft: 'auto',
            padding: '8px 20px', borderRadius: 10,
            border: 'none',
            background: saving ? '#e5e7eb' : 'linear-gradient(135deg, #16a34a, #0d9488)',
            color: saving ? '#9ca3af' : 'white',
            fontWeight: 600, fontSize: 14,
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          {saving
            ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Menyimpan</>
            : <><Check size={14} /> Simpan</>
          }
        </button>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 16px' }}>
        {/* Status */}
        {status && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '12px 16px', borderRadius: 12, marginBottom: 20,
            background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${status.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {status.type === 'success'
              ? <Check size={16} color="#16a34a" />
              : <AlertCircle size={16} color="#dc2626" />
            }
            <span style={{
              fontSize: 14, fontWeight: 500,
              color: status.type === 'success' ? '#15803d' : '#dc2626',
            }}>{status.msg}</span>
          </div>
        )}

        {/* Avatar */}
        <div style={{
          background: 'white', borderRadius: 16,
          padding: 24, marginBottom: 16,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: avatarPreview ? 'transparent' : 'linear-gradient(135deg, #16a34a, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 700, color: 'white',
              overflow: 'hidden',
            }}>
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 26, height: 26, borderRadius: '50%',
                background: '#16a34a', border: '2px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={12} color="white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatar} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>{form.name || '—'}</div>
            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{form.email}</div>
            <button
              onClick={() => fileRef.current?.click()}
              style={{
                fontSize: 12, color: '#16a34a', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginTop: 6,
              }}
            >Ganti foto profil</button>
          </div>
        </div>

        {/* Informasi Dasar */}
        <Section title="Informasi Dasar">
          <Field label="Nama Lengkap" icon={<User size={14} />}>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="Nama lengkap"
              style={inputStyle}
            />
          </Field>
          <Field label="Email" icon={<Mail size={14} />}>
            <input
              type="email"
              value={form.email}
              disabled
              style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af', cursor: 'not-allowed' }}
            />
          </Field>
          <Field label="Nomor HP" icon={<Phone size={14} />}>
            <input
              type="tel"
              value={form.phone}
              onChange={set('phone')}
              placeholder="+62 812 3456 7890"
              style={inputStyle}
            />
          </Field>
        </Section>

        {/* Data Pribadi */}
        <Section title="Data Pribadi">
          <Field label="Tanggal Lahir" icon={<Calendar size={14} />}>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={set('date_of_birth')}
              max={new Date().toISOString().split('T')[0]}
              style={inputStyle}
            />
          </Field>
          <Field label="Jenis Kelamin" icon={<User size={14} />}>
            <select value={form.gender} onChange={set('gender')} style={inputStyle}>
              <option value="">Pilih jenis kelamin</option>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
              <option value="other">Lainnya</option>
            </select>
          </Field>
        </Section>

        {/* Data Fisik */}
        <Section title="Data Fisik">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Tinggi Badan" icon={<Ruler size={14} />} suffix="cm">
              <input
                type="number"
                value={form.height_cm}
                onChange={set('height_cm')}
                placeholder="170"
                min="100" max="250"
                style={inputStyle}
              />
            </Field>
            <Field label="Berat Badan" icon={<Weight size={14} />} suffix="kg">
              <input
                type="number"
                value={health.weight_kg}
                onChange={e => setHealth({ weight_kg: e.target.value })}
                placeholder="65"
                min="20" max="300"
                style={inputStyle}
              />
            </Field>
          </div>
          {form.height_cm && health.weight_kg && (
            <BMICard height={parseFloat(form.height_cm)} weight={parseFloat(health.weight_kg)} />
          )}
        </Section>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white', borderRadius: 16,
      padding: 20, marginBottom: 16,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 16px' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Field wrapper ─── */
function Field({ label, icon, suffix, children }: {
  label: string; icon: React.ReactNode; suffix?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label style={{
        fontSize: 12, fontWeight: 600, color: '#374151',
        display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6,
      }}>
        {icon} {label}
      </label>
      <div style={{ position: 'relative' }}>
        {children}
        {suffix && (
          <span style={{
            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 12, color: '#9ca3af', fontWeight: 600, pointerEvents: 'none',
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}

/* ─── BMI Card ─── */
function BMICard({ height, weight }: { height: number; weight: number }) {
  const bmi = weight / Math.pow(height / 100, 2);
  const bmiFixed = bmi.toFixed(1);
  const { label, color } = bmi < 18.5
    ? { label: 'Kurus', color: '#3b82f6' }
    : bmi < 25
    ? { label: 'Normal', color: '#16a34a' }
    : bmi < 30
    ? { label: 'Kelebihan berat', color: '#f59e0b' }
    : { label: 'Obesitas', color: '#ef4444' };

  return (
    <div style={{
      marginTop: 12, padding: '12px 16px', borderRadius: 12,
      background: '#f9fafb', border: '1.5px solid #e5e7eb',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>BMI</span>
      <div>
        <span style={{ fontSize: 20, fontWeight: 700, color }}>{bmiFixed}</span>
        <span style={{ fontSize: 12, color, marginLeft: 8, fontWeight: 600 }}>{label}</span>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1.5px solid #e5e7eb',
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
  background: 'white',
};