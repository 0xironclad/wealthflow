import { NextResponse } from "next/server";
import pool from "@/database/db";

export async function GET() {
  try{
    const result = await pool.query('SELECT now()')
    return NextResponse.json({
      success: true,
      data: result.rows[0]
    }, { status: 200 })
  } catch(error){
    return NextResponse.json({
      success: false,
      message: "Error fetching time",
      error: String(error)
    }, { status: 500 })
  }   
}
