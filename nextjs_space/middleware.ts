
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Allow access if authenticated
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Check if user is authenticated
        if (!token) {
          return false
        }
        
        // Additional role checks can be added here
        // For now, any authenticated user can access admin
        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
    },
  }
)

// Protect all /admin routes
export const config = {
  matcher: ['/admin/:path*']
}
