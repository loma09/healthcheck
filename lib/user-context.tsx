'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/lib/supabase';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
  date_of_birth: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  is_onboarded: boolean;
};

type UserContextType = {
  profile: UserProfile | null;
  loading: boolean;
  refresh: () => void;
};

const UserContext = createContext<UserContextType>({
  profile: null,
  loading: true,
  refresh: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      setLoading(true);
      try {
        // Gunakan getSession() — baca dari cookie lokal, tanpa network call
        // Lebih cepat dan tidak gagal jika koneksi Supabase lambat
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) { setLoading(false); return; }

        // Fetch profil + berat terbaru secara paralel
        const [{ data: prof }, { data: hc }] = await Promise.all([
          supabase
            .from('users')
            .select('name, email, avatar_url, date_of_birth, height_cm, is_onboarded')
            .eq('id', user.id)
            .single(),
          supabase
            .from('health_checks')
            .select('weight_kg')
            .eq('user_id', user.id)
            .not('weight_kg', 'is', null)
            .order('checked_at', { ascending: false })
            .limit(1)
            .single(),
        ]);

        setProfile({
          id: user.id,
          name: prof?.name ?? user.user_metadata?.name ?? '',
          email: prof?.email ?? user.email ?? '',
          avatar_url: prof?.avatar_url ?? null,
          date_of_birth: prof?.date_of_birth ?? null,
          height_cm: prof?.height_cm ?? null,
          weight_kg: hc?.weight_kg ?? null,
          is_onboarded: prof?.is_onboarded ?? false,
        });
      } catch (err) {
        console.error('[UserProvider] Failed to load profile:', err);
        // Jangan crash — biarkan UI tetap jalan dengan profile null
      } finally {
        setLoading(false);
      }
    })();
  }, [tick]);

  return (
    <UserContext.Provider value={{ profile, loading, refresh: () => setTick(t => t + 1) }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
