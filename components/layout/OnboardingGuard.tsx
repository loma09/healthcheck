'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';

export default function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Tunggu sampai profile selesai dimuat
    if (loading) return;
    // Kalau user sudah login tapi belum onboarding → redirect
    if (profile && !profile.is_onboarded) {
      router.replace('/onboarding');
    }
  }, [profile, loading, router]);

  // Tampilkan loading saat cek onboarding
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#e8edf5',
      }}>
        <div style={{
          width: 36, height: 36,
          border: '3px solid #e5e7eb',
          borderTop: '3px solid #4CAF7D',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Kalau belum onboarded, jangan render children (redirect sudah triggered)
  if (profile && !profile.is_onboarded) return null;

  return <>{children}</>;
}
