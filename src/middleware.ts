import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/login'];

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next|api|public).*)',
};
