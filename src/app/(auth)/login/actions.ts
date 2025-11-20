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

    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }
    try {
        const upsertQuery = `
      INSERT INTO users (id, email)
      VALUES ($1, $2)
      ON CONFLICT (email)
      DO UPDATE SET
        id = EXCLUDED.id
      RETURNING *
    `;
        const result = await pool.query(upsertQuery, [
            authData.user.id,
            authData.user.email,
        ]);
        console.info(`[LOGIN] UPSERT successful:`, result.rows[0]);
    } catch (error) {
        console.error("[LOGIN] Error upserting user:", error);
    }

    revalidatePath("/", "layout");
    redirect("/overview");
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        options: {
            data: {
                name: formData.get("name") as string,
            },
        },
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }

    return {
        success: true,
    };
}

export async function signInWithGithub() {
    const supabase = await createClient();
    let redirectUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
        redirectUrl = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
            redirectTo: `${redirectUrl}/auth/callback`,
        },
    });

    if (error) {
        return {
            success: false,
            error: error.message,
        };
    }

    if (data.url) {
        redirect(data.url);
    }

    return {
        success: false,
        error: "An error occurred while initiating GitHub login.",
    };
}
