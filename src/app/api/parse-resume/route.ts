import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    console.log("Resume Parse Request Received (unpdf)");
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Security: Validate file type
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

        if (!isPdf && !isTxt) {
            return NextResponse.json({ error: "Only PDF and TXT files are allowed." }, { status: 400 });
        }

        // Security: Limit file size to 5MB
        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        let text = "";

        // Handle PDF
        if (isPdf) {
            try {
                // unpdf requires Uint8Array, not Buffer
                const uint8Array = new Uint8Array(buffer);
                const result = await extractText(uint8Array);
                // result.text is an array of strings (one per page)
                text = Array.isArray(result.text) ? result.text.join("\n") : (result.text || "");
                console.log("PDF Parsed successfully with unpdf, length:", text?.length);
            } catch (pdfError: unknown) {
                const err = pdfError as Error;
                console.error("PDF Parse Error:", err);
                return NextResponse.json({
                    error: "Could not parse PDF: " + (err.message || "Unknown error"),
                    suggestion: "Please try copying your resume text and pasting it directly."
                }, { status: 500 });
            }
        }
        // Handle Text
        else {
            text = buffer.toString('utf-8');
        }

        // Sanitize and clean up text
        const sanitizedText = (text || "")
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .replace(/\s+/g, ' ')
            .replace(/\n\s*\n/g, '\n\n')
            .trim();

        if (sanitizedText.length < 10) {
            return NextResponse.json({
                error: "Could not extract readable text from the PDF.",
                suggestion: "The PDF might be image-based. Please copy and paste text directly."
            }, { status: 500 });
        }

        return NextResponse.json({
            text: sanitizedText,
            success: true
        });

    } catch (error: unknown) {
        const err = error as Error;
        console.error("Parsing Error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to parse file" },
            { status: 500 }
        );
    }
}
