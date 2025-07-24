'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/superbase/server'

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.log("Sign out error:", error)
    redirect('/error')
  }
  revalidatePath('/', 'layout')
  redirect('/')
}
