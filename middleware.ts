import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — wajib dipanggil di middleware
  // Jangan gunakan getSession() di sini karena tidak aman dari server side
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Cek apakah user sudah onboarding
if (user && !request.nextUrl.pathname.startsWith('/onboarding')) {
  const { data: profile } = await supabase
    .from('users')
    .select('is_onboarded')
    .eq('id', user.id)
    .single();

  if (profile && !profile.is_onboarded) {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
}
  // Proteksi route: jika belum login, redirect ke /login
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika sudah login, jangan biarkan akses halaman auth
  if (
    user &&
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register')
  ) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match semua request path KECUALI:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - file publik (gambar dll)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
