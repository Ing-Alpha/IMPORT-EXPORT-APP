import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pages publiques qui ne nécessitent pas d'authentification
  const publicPages = ['/auth/signin', '/auth/signup', '/']
  const isPublicPage = publicPages.includes(pathname)

  // Si c'est une page publique, laisser passer
  if (isPublicPage) {
    return NextResponse.next()
  }

  // Vérifier le token JWT
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Si pas de token, rediriger vers la page de connexion
  if (!token) {
    console.log('Middleware: Pas de token JWT, redirection vers /auth/signin')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Vérifier l'expiration du token
  if (token.expiresAt && Date.now() > token.expiresAt) {
    console.log('Middleware: Token expiré, redirection vers /auth/signin')
    return NextResponse.redirect(new URL('/auth/signin', request.url))
  }

  // Ajouter des headers pour indiquer l'état d'authentification
  const response = NextResponse.next()
  response.headers.set('x-auth-status', 'authenticated')
  response.headers.set('x-user-id', token.sub || '')
  response.headers.set('x-user-role', token.role || '')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
