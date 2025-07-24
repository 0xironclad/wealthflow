'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/superbase/server'
import pool from "@/database/db";

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const {data: authData, error } = await supabase.auth.signInWithPassword(data)
  console.log('Auth Data:', authData)

  if (error) {
    return{
      success: false,
      error: error.message
    }
  }
  try{
    const checkQuery = 'SELECT * FROM users WHERE id = $1'
    const checkResult = await pool.query(checkQuery, [authData.user.id])
    if(checkResult.rows.length === 0){
      const insertQuery = 'INSERT INTO users (id, email) VALUES ($1, $2)'
      await pool.query(insertQuery, [authData.user.id, authData.user.email])
    } else {
      console.log('User already exists')
    }

  } catch(error){
    console.log(error)
  }

  revalidatePath('/overview' , 'layout')
  return {
    success: true,
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
