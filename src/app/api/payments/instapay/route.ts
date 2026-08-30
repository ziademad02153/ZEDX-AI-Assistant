import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { transactionId } = body;

        if (!transactionId) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: "Unauthorized - No Token" }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];

        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data: { user }, error: userError } = await supabase.auth.getUser(token);

        if (!user || userError) {
            return NextResponse.json({ error: "Unauthorized - Invalid Token" }, { status: 401 });
        }

        // Insert into pending_approvals table using Admin client to bypass RLS
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            supabaseServiceKey,
            { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { error: insertError } = await supabaseAdmin
            .from("pending_approvals")
            .insert({
                user_id: user.id,
                transaction_id: transactionId,
                payment_method: "instapay",
                status: "pending",
                amount: 300,
                currency: "EGP"
            });

        if (insertError) {
            console.error("Error inserting pending approval:", insertError);
            return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Instapay submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
