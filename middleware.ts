// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from '@/lib/session' 

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const cookie = request.cookies.get('session')?.value
  const session = await decrypt(cookie)

  // 1. Identify what needs protection (e.g., /admin-portal/inventory)
  // We EXCLUDE the base '/admin-portal' so you can see your console
  const isProtectedSubRoute = pathname.startsWith('/admin-portal/') 
  const isBaseAdminPath = pathname === '/admin-portal'

  // 2. Redirect to login if trying to access a sub-route without a session
  if (isProtectedSubRoute && !session?.username) {
    return NextResponse.redirect(new URL('/admin-portal', request.url))
  }

  // 3. Optional: If you want to keep them on the console and NOT 
  // let them see the login form once they are in:
  // (Your Page.tsx handles the conditional rendering of LoginForm vs AdminConsole)

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin-portal/:path*'],
}
