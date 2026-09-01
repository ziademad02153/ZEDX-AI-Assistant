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

export async function POST(req: Request) {
  try {
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
