import { getAuth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoute = (path: string): boolean => {
  const protectedRoutes = ['/', '/upcoming', '/meeting', '/previous', '/recordings', '/personal-room'];
  return protectedRoutes.some((route) => path.startsWith(route));
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl; // Use nextUrl instead of creating a new URL object
  if (protectedRoute(url.pathname)) {
    const auth = getAuth(req); // Now `req` is a `NextRequest` object
    if (!auth.userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url)); // Redirect to sign-in page
    }
  }
  return NextResponse.next(); // Allow request to proceed if authenticated
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
