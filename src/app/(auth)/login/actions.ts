"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/superbase/server";
import pool from "@/database/db";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: authData, error } = await supabase.auth.signInWithPassword(
    data
  );
  console.log("Auth Data:", authData);

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }
  try {
    // Use UPSERT to handle both new users and existing users
    // If user exists by email, update the id to match Supabase auth
    // If user doesn't exist, insert new user
    const upsertQuery = `
      INSERT INTO users (id, email)
      VALUES ($1, $2)
      ON CONFLICT (email) 
      DO UPDATE SET
        id = EXCLUDED.id
    `;
    await pool.query(upsertQuery, [authData.user.id, authData.user.email]);
    console.log("User upserted successfully");
  } catch (error) {
    console.error("Error upserting user:", error);
  }

  revalidatePath("/overview", "layout");
  return {
    success: true,
  };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
