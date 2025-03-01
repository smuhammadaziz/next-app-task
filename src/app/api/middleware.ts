import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Define which paths are protected
  const isProtectedPath = path === "/dashboard";
  // Define which paths are public (login, register)
  const isAuthPath = path === "/login" || path === "/register" || path === "/";
  
  const token = request.cookies.get("token")?.value;
  
  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  
  // If trying to access login/register with token, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/register", "/dashboard"],
};