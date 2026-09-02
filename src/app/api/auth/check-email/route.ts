import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Simple rate limiter to prevent enumeration attacks
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5; // Max 5 checks per IP/client per minute

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    const rateData = rateLimitMap.get(ip);

    if (rateData) {
        if (now > rateData.resetTime) {
            rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        } else if (rateData.count >= MAX_REQUESTS) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 });
        } else {
            rateData.count += 1;
        }
    } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    const { email } = await req.json();
    
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Query profiles table to check if user exists
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error checking email:", error);
      return NextResponse.json({ error: "Failed to verify email" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ exists: false });
    }

    return NextResponse.json({ exists: true });
  } catch (error: any) {
    console.error("Email check exception:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
