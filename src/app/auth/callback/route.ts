import { NextResponse } from 'next/server'
import { createClient } from '@/utils/superbase/server'
import pool from '@/database/db'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/overview?login=success'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                try {
                    const upsertQuery = `
            INSERT INTO users (id, email)
            VALUES ($1, $2)
            ON CONFLICT (email)
            DO UPDATE SET
              id = EXCLUDED.id
            RETURNING *
          `
                    await pool.query(upsertQuery, [user.id, user.email])
                    console.info(`[OAUTH] UPSERT successful for user: ${user.email}`)
                } catch (dbError) {
                    console.error("[OAUTH] Error upserting user:", dbError)
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            console.log('[OAUTH CALLBACK] Debug Info:', {
                origin,
                next,
                forwardedHost,
                isLocalEnv,
                code: code ? 'present' : 'missing'
            });

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`)
            } else if (forwardedHost) {
                const url = `https://${forwardedHost}${next}`
                console.log('[OAUTH CALLBACK] Redirecting to:', url)
                return NextResponse.redirect(url)
            } else {
                const url = `${origin}${next}`
                console.log('[OAUTH CALLBACK] Redirecting to (fallback):', url)
                return NextResponse.redirect(url)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
