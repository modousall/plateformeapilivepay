import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Pages publiques
  const publicPaths = ['/', '/login', '/register', '/pay']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Pages admin protégées
  const adminPaths = ['/dashboard']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  
  // Vérifier si l'utilisateur est connecté (via cookie Firebase)
  const sessionCookie = request.cookies.get('__session')?.value
  
  // Si page admin et pas authentifié → rediriger vers login
  if (isAdminPath && !sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si login et déjà authentifié → rediriger vers dashboard
  if (pathname === '/login' && sessionCookie) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/pay/:path*',
  ],
}
