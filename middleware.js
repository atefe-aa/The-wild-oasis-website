
import { NextResponse } from 'next/server'
import { getCurrentUser } from './app/_lib/auth'

export async function middleware(request) {
    const token = request.cookies.get('access_token')?.value
    console.log("Access token:", token)
  
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }
  
    return NextResponse.next()
}

export const config = {
  matcher: ['/account'],
}
