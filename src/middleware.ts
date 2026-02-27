import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Vérifier si l'utilisateur est connecté (via cookie Firebase)
  const hasAuthCookie = request.cookies.has('__session')
  
  // Pages publiques
  const publicPaths = ['/', '/login', '/register', '/pay']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Pages admin protégées
  const adminPaths = ['/dashboard']
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path))
  
  // Si page admin et pas authentifié → rediriger vers login
  if (isAdminPath && !hasAuthCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // Si login et déjà authentifié → rediriger vers dashboard
  if (pathname === '/login' && hasAuthCookie) {
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
