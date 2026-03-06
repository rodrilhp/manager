import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedRoutes = ['/', '/contratados', '/financeiro', '/performance', '/organograma'];
const authRoutes = ['/login'];

export async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isAuthRoute = authRoutes.includes(path);

    const cookie = req.cookies.get('session')?.value;
    const session = await decrypt(cookie);

    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    if (isAuthRoute && session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
