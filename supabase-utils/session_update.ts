import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: claimsData } = await supabase.auth.getClaims()
  const claims = claimsData?.claims
  
  const { data: { user } } = await supabase.auth.getUser()

  console.log('User:', user)
  console.log('Claims:', claims)

  const pathname = request.nextUrl.pathname

  const role = claims?.user_metadata?.role || user?.user_metadata?.role
  
  console.log("Resolved role:", role)

  if (pathname.startsWith('/admin')) {
    if (!user) {
      console.log('No user - redirecting to login')
      return redirectToLogin(request)
    }
    
    if (role !== 'owner') {
      console.log(`Unauthorized access (role: ${role}) - redirecting`)
      return redirectToLogin(request)
    }
  }

  if (pathname.startsWith('/auth/register') && user) {
    return redirectToHome(request)
  }

  return response
}

function redirectToLogin(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/auth/login'
  return NextResponse.redirect(url)
}

function redirectToHome(request: NextRequest) {
  const url = request.nextUrl.clone()
  url.pathname = '/'
  return NextResponse.redirect(url)
}