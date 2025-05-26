// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// // This function can be marked `async` if using `await` inside
// export function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname

//   // Define public paths that don't require authentication
//   const isPublicPath = path === "/" || path === "/forgot-password" || path.startsWith("/reset-password")

//   // Get the token from the cookies
//   const token = request.cookies.get("accessToken")?.value || ""

//   // If the path requires authentication and there's no token, redirect to login
//   if (!isPublicPath && !token) {
//     return NextResponse.redirect(new URL("/", request.url))
//   }

//   // If the user is logged in and tries to access login page, redirect to dashboard
//   if (isPublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.url))
//   }

//   return NextResponse.next()
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }











import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/forgot-password" || path.startsWith("/reset-password")

  // Get the token from the cookies
  const token = request.cookies.get("accessToken")?.value || ""

  // If the path requires authentication and there's no token, redirect to login
  if (!isPublicPath && !token) {
    // Check for token in authorization header as fallback
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // If the user is logged in and tries to access login page, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
