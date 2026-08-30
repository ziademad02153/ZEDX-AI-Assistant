import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
    try {
        const adminKey = req.headers.get("x-admin-key");
        
        // Very basic hardcoded check for prototype, or from env
        const EXPECTED_KEY = process.env.ADMIN_SECRET_KEY || "zedx-admin-2024";
        
        if (!adminKey || adminKey !== EXPECTED_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // We use the service_role key to bypass RLS and get ALL pending approvals
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        const { data: approvals, error } = await supabaseAdmin
            .from("pending_approvals")
            .select(`
                id,
                user_id,
                transaction_id,
                payment_method,
                status,
                created_at
            `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Admin Fetch Error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Fetch emails manually to avoid schema relation error
        const userIds = approvals.map(a => a.user_id).filter(Boolean);
        const { data: profilesData } = await supabaseAdmin
            .from("profiles")
            .select("id, email")
            .in("id", userIds);

        const emailMap = new Map();
        if (profilesData) {
            profilesData.forEach(p => emailMap.set(p.id, p.email));
        }

        const enrichedApprovals = approvals.map(a => ({
            ...a,
            profiles: { email: emailMap.get(a.user_id) || "Unknown User" }
        }));

        return NextResponse.json({ approvals: enrichedApprovals });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
