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
  
  // En développement, on permet l'accès sans authentification stricte
  // Pour la production, il faudra activer Firebase Authentication
  if (isAdminPath) {
    // Vérification simple via session localStorage (à sécuriser en production)
    const hasSession = request.cookies.has('__session') || 
                       request.nextUrl.searchParams.get('admin') === 'true'
    
    if (!hasSession && !isPublicPath) {
      // Rediriger vers login seulement si pas de session
      // Pour le développement, on ajoute un paramètre pour bypass
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // Si login et déjà authentifié → rediriger vers dashboard
  if (pathname === '/login') {
    const hasSession = request.cookies.has('__session')
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
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
