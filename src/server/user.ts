"use server";

import pool from "@/database/db";



export async function getUserData(userId: string) {
    try {
        if (!userId) {
            throw new Error("User ID is required");
        }

        const query = "SELECT * FROM users WHERE id = $1";
        const result = await pool.query(query, [userId]);

        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        return result.rows[0];
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
}

export async function updateUserProfile(
    userId: string,
    data: {
        fullname: string;
        avatarUrl: string;
    }
) {
    try {
        const query = `
      UPDATE users
      SET fullname = $1,
          avatar_url = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `;
        const result = await pool.query(query, [
            data.fullname,
            data.avatarUrl,
            userId,
        ]);

        return result.rows[0];
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}
