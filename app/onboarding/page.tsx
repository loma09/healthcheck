'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, ChevronLeft, User, Ruler, Weight, Droplets, Activity, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase';

const STEPS = ['Profil', 'Fisik', 'Target'];

type FormData = {
  gender: string;
  date_of_birth: string;
  height_cm: string;
  weight_kg: string;
  target_glasses: string;
  activity_level: string;
};

const initialForm: FormData = {
  gender: '',
  date_of_birth: '',
  height_cm: '',
  weight_kg: '',
  target_glasses: '8',
  activity_level: 'moderate',
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof FormData) => (val: string) =>
    setForm(p => ({ ...p, [key]: val }));

  const canNext = () => {
    if (step === 0) {
      if (!form.gender || !form.date_of_birth) return false;
      const dob = new Date(form.date_of_birth).getTime();
      const today = new Date().getTime();
      return dob <= today;
    }
    if (step === 1) return form.height_cm && form.weight_kg;
    if (step === 2) return form.target_glasses && form.activity_level;
    return false;
  };

  const handleFinish = async () => {
    setLoading(true);
    setError('');
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Tidak terautentikasi');

      const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD


      // Update users table
      const { error: userErr } = await supabase
        .from('users')
        .update({
          gender: form.gender,
          date_of_birth: form.date_of_birth,
          height_cm: parseFloat(form.height_cm),
          is_onboarded: true,
        })
        .eq('id', user.id);

      if (userErr) throw userErr;

      // Insert initial health check for weight
      const { error: hcErr } = await supabase
        .from('health_checks')
        .insert({
          user_id: user.id,
          checked_at: new Date().toISOString(),
          weight_kg: parseFloat(form.weight_kg),
        });

      if (hcErr) throw hcErr;

      const { error: wlErr } = await supabase
        .from('water_logs')
        .upsert({
            user_id: user.id,
            log_date: today,
            glasses: 0,
            target_glasses: parseInt(form.target_glasses),
        }, { onConflict: 'user_id,log_date' });

      if (wlErr) throw wlErr;

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan, coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0f9ff 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'linear-gradient(135deg, #16a34a, #0d9488)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Shield size={20} color="white" strokeWidth={2.5} />
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#15803d' }}>HealthCheck</span>
      </div>

      {/* Card */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: 480,
        overflow: 'hidden',
      }}>
        {/* Progress bar */}
        <div style={{ padding: '28px 32px 0' }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            {STEPS.map((label, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{
                  height: 4, borderRadius: 4,
                  background: i <= step ? 'linear-gradient(90deg, #16a34a, #0d9488)' : '#e5e7eb',
                  transition: 'background 0.3s',
                }} />
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: i <= step ? '#16a34a' : '#9ca3af',
                  marginTop: 4, display: 'block',
                  transition: 'color 0.3s',
                }}>{label}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 4px' }}>
            Langkah {step + 1} dari {STEPS.length}
          </p>
        </div>

        {/* Step content */}
        <div style={{ padding: '0 32px 28px' }}>
          {step === 0 && <StepProfil form={form} set={set} />}
          {step === 1 && <StepFisik form={form} set={set} />}
          {step === 2 && <StepTarget form={form} set={set} />}

          {error && (
            <p style={{
              color: '#dc2626', fontSize: 13, textAlign: 'center',
              background: '#fef2f2', border: '1px solid #fecaca',
              borderRadius: 8, padding: '10px 14px', marginTop: 16,
            }}>{error}</p>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            {step > 0 && (
              <button
                onClick={() => setStep(s => s - 1)}
                style={{
                  flex: 1, padding: '12px 0', borderRadius: 12,
                  border: '1.5px solid #e5e7eb', background: 'white',
                  color: '#374151', fontWeight: 600, fontSize: 14,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 6,
                }}
              >
                <ChevronLeft size={16} /> Kembali
              </button>
            )}
            <button
              onClick={step < STEPS.length - 1 ? () => setStep(s => s + 1) : handleFinish}
              disabled={!canNext() || loading}
              style={{
                flex: 2, padding: '12px 0', borderRadius: 12,
                border: 'none',
                background: canNext() && !loading
                  ? 'linear-gradient(135deg, #16a34a, #0d9488)'
                  : '#e5e7eb',
                color: canNext() && !loading ? 'white' : '#9ca3af',
                fontWeight: 600, fontSize: 14,
                cursor: canNext() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <span style={{
                  width: 18, height: 18, border: '2px solid white',
                  borderTopColor: 'transparent', borderRadius: '50%',
                  display: 'inline-block', animation: 'spin 0.8s linear infinite',
                }} />
              ) : step < STEPS.length - 1 ? (
                <> Lanjut <ChevronRight size={16} /> </>
              ) : (
                <> Mulai <Check size={16} /> </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── Step 1: Profil ─── */
function StepProfil({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: string) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
          Kenalan dulu yuk 👋
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Data ini membantu kami memberikan rekomendasi yang tepat untukmu.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Gender */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <User size={14} /> Jenis Kelamin
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { val: 'male', label: '♂ Laki-laki' },
              { val: 'female', label: '♀ Perempuan' },
              { val: 'other', label: '⚧ Lainnya' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => set('gender')(opt.val)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: form.gender === opt.val ? '2px solid #16a34a' : '1.5px solid #e5e7eb',
                  background: form.gender === opt.val ? '#f0fdf4' : 'white',
                  color: form.gender === opt.val ? '#16a34a' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        {/* Date of birth */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>
            Tanggal Lahir
          </label>
          <input
            type="date"
            value={form.date_of_birth}
            onChange={e => set('date_of_birth')(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            style={{
              width: '100%', padding: '11px 14px', borderRadius: 10, fontSize: 14,
              border: '1.5px solid #e5e7eb', outline: 'none', color: '#111827',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Fisik ─── */
function StepFisik({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: string) => void }) {
  const bmi = form.height_cm && form.weight_kg
    ? (parseFloat(form.weight_kg) / Math.pow(parseFloat(form.height_cm) / 100, 2)).toFixed(1)
    : null;

  const bmiLabel = bmi
    ? parseFloat(bmi) < 18.5 ? { text: 'Kurus', color: '#3b82f6' }
    : parseFloat(bmi) < 25 ? { text: 'Normal', color: '#16a34a' }
    : parseFloat(bmi) < 30 ? { text: 'Kelebihan berat', color: '#f59e0b' }
    : { text: 'Obesitas', color: '#ef4444' }
    : null;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
          Data fisikmu 📏
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Digunakan untuk menghitung BMI dan kalori harianmu.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <InputField
          label="Tinggi Badan"
          icon={<Ruler size={14} />}
          value={form.height_cm}
          onChange={set('height_cm')}
          type="number"
          placeholder="170"
          suffix="cm"
          min="100" max="250"
        />
        <InputField
          label="Berat Badan"
          icon={<Weight size={14} />}
          value={form.weight_kg}
          onChange={set('weight_kg')}
          type="number"
          placeholder="65"
          suffix="kg"
          min="20" max="300"
        />

        {bmi && bmiLabel && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: '#f9fafb', border: '1.5px solid #e5e7eb',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>BMI kamu</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: bmiLabel.color }}>{bmi}</span>
              <span style={{ fontSize: 12, color: bmiLabel.color, marginLeft: 6, fontWeight: 600 }}>
                {bmiLabel.text}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Step 3: Target ─── */
function StepTarget({ form, set }: { form: FormData; set: (k: keyof FormData) => (v: string) => void }) {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>
          Target harianmu 🎯
        </h2>
        <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
          Bisa diubah kapan saja di pengaturan.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Target air minum */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Droplets size={14} /> Target Minum Harian
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['6', '7', '8', '10', '12'].map(v => (
              <button
                key={v}
                type="button"
                onClick={() => set('target_glasses')(v)}
                style={{
                  flex: 1, padding: '10px 4px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  border: form.target_glasses === v ? '2px solid #0d9488' : '1.5px solid #e5e7eb',
                  background: form.target_glasses === v ? '#f0fdfa' : 'white',
                  color: form.target_glasses === v ? '#0d9488' : '#6b7280',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >{v} 🥤</button>
            ))}
          </div>
        </div>

        {/* Level aktivitas */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Activity size={14} /> Level Aktivitas
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { val: 'sedentary', label: '🪑 Santai', desc: 'Duduk sebagian besar waktu' },
              { val: 'moderate', label: '🚶 Aktif', desc: 'Olahraga ringan 2–3x seminggu' },
              { val: 'active', label: '🏃 Sangat Aktif', desc: 'Olahraga intens 5+ kali seminggu' },
            ].map(opt => (
              <button
                key={opt.val}
                type="button"
                onClick={() => set('activity_level')(opt.val)}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: form.activity_level === opt.val ? '2px solid #16a34a' : '1.5px solid #e5e7eb',
                  background: form.activity_level === opt.val ? '#f0fdf4' : 'white',
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: form.activity_level === opt.val ? '#16a34a' : '#374151' }}>
                  {opt.label}
                </span>
                <span style={{ fontSize: 12, color: '#9ca3af' }}>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Reusable input ─── */
function InputField({ label, icon, value, onChange, type, placeholder, suffix, min, max }: {
  label: string; icon: React.ReactNode; value: string;
  onChange: (v: string) => void; type: string; placeholder: string;
  suffix?: string; min?: string; max?: string;
}) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        {icon} {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          min={min} max={max}
          style={{
            width: '100%', padding: suffix ? '11px 48px 11px 14px' : '11px 14px',
            borderRadius: 10, fontSize: 14, border: '1.5px solid #e5e7eb',
            outline: 'none', color: '#111827', boxSizing: 'border-box',
          }}
        />
        {suffix && (
          <span style={{
            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
            fontSize: 13, color: '#9ca3af', fontWeight: 600,
          }}>{suffix}</span>
        )}
      </div>
    </div>
  );
}