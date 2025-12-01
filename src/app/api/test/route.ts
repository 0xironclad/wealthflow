import { NextResponse } from "next/server";
import pool from "@/database/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT now(), version()");
    
    // Check connection info
    const dbUrl = process.env.SUPABASE_DB_URL;
    const connectionInfo = {
      hasUrl: !!dbUrl,
      isPooler: dbUrl?.includes(":6543") || dbUrl?.includes("pooler.supabase.com") || false,
      port: dbUrl?.match(/:(\d+)/)?.[1] || "unknown",
      environment: process.env.NODE_ENV || "development",
    };
    
    return NextResponse.json({
      success: true,
      data: result.rows[0],
      connection: connectionInfo,
    }, { status: 200 });
  } catch (error) {
    const dbUrl = process.env.SUPABASE_DB_URL;
    return NextResponse.json({
      success: false,
      message: "Error connecting to database",
      error: error instanceof Error ? error.message : String(error),
      connection: {
        hasUrl: !!dbUrl,
        urlFormat: dbUrl ? (dbUrl.includes(":6543") ? "pooler" : "direct") : "none",
        environment: process.env.NODE_ENV || "development",
      },
      hint: "Make sure SUPABASE_DB_URL is set in Vercel environment variables with port 6543",
    }, { status: 500 });
  }
}
