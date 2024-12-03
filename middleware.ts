import { getAuth } from '@clerk/nextjs/server';

const protectedRoute = (path: string): boolean => {
  const protectedRoutes = ['/', '/upcoming', '/meeting', '/previous', '/recordings', '/personal-room'];
  return protectedRoutes.some((route) => path.startsWith(route));
};

export default async function middleware(req: Request) {
  const url = new URL(req.url);
  if (protectedRoute(url.pathname)) {
    const auth = getAuth(req);
    if (!auth.userId) {
      return new Response('Unauthorized', { status: 401 });
    }
  }
  return new Response(null, { status: 200 });
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
