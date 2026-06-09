import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const authRoutes = ['/login', '/register'];
const publicRoutes = ['/login', '/register', '/'];

export default function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // Normalize trailing slash
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  // 1. Public routes — allow through (no auth required)
  if (publicRoutes.includes(normalized)) {
    // Still redirect authenticated users away from auth pages
    if (token && authRoutes.includes(normalized)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // 2. Static assets — allow
  if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // 3. Unauthenticated → login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 4. Authenticated — allow through (role checks in layouts)
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)'],
};
