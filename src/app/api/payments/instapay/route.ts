import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { transactionId, tier } = body;

        if (!transactionId) {
            return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
        }

        const amount = tier === "ultra" ? 600 : 300;

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
                amount: amount,
                currency: "EGP"
            });

        if (insertError) {
            console.error("Error inserting pending approval:", insertError);
            return NextResponse.json({ error: "Failed to submit request" }, { status: 500 });
        }

        // Send email notification to Admin
        try {
            const nodemailer = require("nodemailer");
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: "ziademadbts@gmail.com",
                subject: "🚨 New Instapay Payment Request - ZEDX",
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #10b981;">New Instapay Payment Request!</h2>
                        <p>A user has just submitted a new payment request for <strong>ZEDX ${tier === "ultra" ? "Ultra" : "Pro"}</strong>.</p>
                        <hr style="border: 1px solid #eee; margin: 15px 0;" />
                        <p><strong>User Email:</strong> ${user.email || 'N/A'}</p>
                        <p><strong>Transaction ID/Username:</strong> ${transactionId}</p>
                        <p><strong>Amount:</strong> ${amount} EGP</p>
                        <hr style="border: 1px solid #eee; margin: 15px 0;" />
                        <p>Please review and approve/reject this request from the Admin Dashboard:</p>
                        <a href="https://zedx-ai-simulator.vercel.app/admin/payments" 
                           style="display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">
                           Open Admin Dashboard
                        </a>
                    </div>
                `,
            };

            await transporter.sendMail(mailOptions);
        } catch (mailError) {
            console.error("Failed to send email notification:", mailError);
            // Don't fail the API request if just the email fails
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Instapay submission error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
