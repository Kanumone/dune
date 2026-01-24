import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/app/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const authResponse = await requireAuth(request);
    if (authResponse) {
      return authResponse;
    }
  }

  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin-token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
