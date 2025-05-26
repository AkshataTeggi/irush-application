// import { NextResponse } from "next/server"
// import { API_BASE_URL } from "@/lib/constants"

// /**
//  * Login endpoint handler
//  * Authenticates user with email and password
//  */
// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json()

//     console.log(`Connecting to API at: ${API_BASE_URL}/auth/login`)

//     // Call the NestJS backend
//     const controller = new AbortController()
//     const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//         signal: controller.signal,
//       })

//       clearTimeout(timeoutId)

//       const data = await response.json()

//       if (!response.ok) {
//         console.error("API login failed:", data)
//         return NextResponse.json({ message: data.message || "Authentication failed" }, { status: response.status })
//       }

//       // Return the access token and refresh token
//       return NextResponse.json({
//         accessToken: data.accessToken,
//         refreshToken: data.refreshToken,
//       })
//     } catch (fetchError) {
//       console.error("API fetch error:", fetchError)

//       if (fetchError instanceof Error) {
//         if (fetchError.name === "AbortError") {
//           return NextResponse.json({ message: "API request timed out" }, { status: 504 })
//         } else {
//           return NextResponse.json(
//             {
//               message: "Could not connect to authentication service. Please try again later.",
//               details: fetchError.message,
//             },
//             { status: 503 },
//           )
//         }
//       }

//       throw fetchError
//     }
//   } catch (error) {
//     console.error("Login route handler error:", error)
//     return NextResponse.json(
//       {
//         message: "Internal server error",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }
















import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/constants"

/**
 * Login endpoint handler
 * Authenticates user with email and password
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    console.log(`Connecting to API at: ${API_BASE_URL}/auth/login`)

    // Call the NestJS backend
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()

      if (!response.ok) {
        console.error("API login failed:", data)
        return NextResponse.json({ message: data.message || "Authentication failed" }, { status: response.status })
      }

      // Set cookies for authentication
      const responseObj = NextResponse.json({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        redirectUrl: "/dashboard", // Add explicit redirect URL
        success: true,
      })

      // Add cookies for server-side authentication checks
      responseObj.cookies.set({
        name: "accessToken",
        value: data.accessToken,
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // 1 hour
      })

      // Return the access token and refresh token
      return responseObj
    } catch (fetchError) {
      console.error("API fetch error:", fetchError)

      if (fetchError instanceof Error) {
        if (fetchError.name === "AbortError") {
          return NextResponse.json({ message: "API request timed out" }, { status: 504 })
        } else {
          return NextResponse.json(
            {
              message: "Could not connect to authentication service. Please try again later.",
              details: fetchError.message,
            },
            { status: 503 },
          )
        }
      }

      throw fetchError
    }
  } catch (error) {
    console.error("Login route handler error:", error)
    return NextResponse.json(
      {
        message: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

