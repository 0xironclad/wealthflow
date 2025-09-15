import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/superbase/middleware'
import { savingsStatusChecker } from '@/middleware/savings-status-checker'

export async function middleware(request: NextRequest) {
  await savingsStatusChecker(request)
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
