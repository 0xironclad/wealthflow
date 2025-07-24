'use server'

import pool from "@/database/db"
import { UserProfile } from "@/lib/types"

export async function getUserData(userId: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user?userId=${userId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (!data) {
            throw new Error("User not found")
        }
        console.log("User data:", data)
        return data
    } catch (error) {
        console.error("Error fetching user data:", error)
        throw error
    }
}

export async function updateUserProfile(userId: string, data: {
    fullname: string
    profile: UserProfile
}) {
    try {
        const query = `
      UPDATE users
      SET fullname = $1,
          profile = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `
        const result = await pool.query(query, [
            data.fullname,
            data.profile,
            userId
        ])

        return result.rows[0]
    } catch (error) {
        console.error("Error updating user:", error)
        throw error
    }
}
