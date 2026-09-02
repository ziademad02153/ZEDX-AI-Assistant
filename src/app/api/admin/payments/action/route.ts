import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        const adminKey = req.headers.get("x-admin-key");
        const EXPECTED_KEY = process.env.ADMIN_SECRET_KEY || "zedx-admin-2024";
        
        if (!adminKey || adminKey !== EXPECTED_KEY) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { id, action } = body;

        if (!id || !action || (action !== 'approve' && action !== 'reject')) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { autoRefreshToken: false, persistSession: false }
        });

        if (action === 'reject') {
            const { error } = await supabaseAdmin
                .from("pending_approvals")
                .update({ status: 'rejected' })
                .eq("id", id);
            
            if (error) throw error;
            return NextResponse.json({ success: true, message: "Rejected" });
        }

        if (action === 'approve') {
            // 1. Get the user_id for this approval
            const { data: approval, error: fetchError } = await supabaseAdmin
                .from("pending_approvals")
                .select("user_id, amount")
                .eq("id", id)
                .single();
            
            if (fetchError || !approval) {
                return NextResponse.json({ error: "Approval not found" }, { status: 404 });
            }

            // 2. Update the user's profile to PRO or ULTRA FIRST!
            const targetTier = (approval.amount && approval.amount >= 600) ? 'ultra' : 'pro';
            
            // Calculate expiration date
            const expirationDate = new Date();
            if (targetTier === 'ultra') {
                expirationDate.setMonth(expirationDate.getMonth() + 3);
            } else {
                expirationDate.setMonth(expirationDate.getMonth() + 1);
            }

            const { error: updateProfileError } = await supabaseAdmin
                .from("profiles")
                .update({ 
                    tier: targetTier,
                    subscription_expires_at: expirationDate.toISOString()
                })
                .eq("id", approval.user_id);
            
            if (updateProfileError) throw updateProfileError;

            // 3. ONLY if the profile update succeeds, mark the transaction as approved
            const { error: updateApprovalError } = await supabaseAdmin
                .from("pending_approvals")
                .update({ status: 'approved' })
                .eq("id", id);
            
            if (updateApprovalError) throw updateApprovalError;

            return NextResponse.json({ success: true, message: `Approved and upgraded to ${targetTier}` });
        }

    } catch (error: any) {
        console.error("Admin Action Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
