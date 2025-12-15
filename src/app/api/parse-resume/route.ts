import { NextRequest, NextResponse } from "next/server";
// @ts-ignore
import PDFParser from "pdf2json";

// Force Node.js runtime
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
    console.log("PDF Parse Request (pdf2json) Received");
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Security: Validate file type
        const allowedTypes = ['application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
        }

        // Security: Limit file size to 5MB
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            return NextResponse.json({ error: "File size must be less than 5MB" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const text = await parsePdfBuffer(buffer);

        // Sanitize output - remove potentially harmful content
        const sanitizedText = text
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '')
            .trim();

        return NextResponse.json({
            text: sanitizedText,
            success: true
        });

    } catch (error: any) {
        console.error("PDF Parsing Error:", error);
        return NextResponse.json(
            { error: "Failed to parse PDF: " + error.message },
            { status: 500 }
        );
    }
}

function parsePdfBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
        const pdfParser = new (PDFParser as any)(null, 1); // 1 = text mode

        pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error(errData.parserError);
            reject(new Error(errData.parserError));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
            // pdf2json returns raw text in URI encoded format sometimes, or just raw text depending on version.
            // But with mode 1, it usually gives rawTextContent.
            // Actually, the easiest way with pdf2json to get plain text is:
            try {
                const rawText = pdfParser.getRawTextContent();
                resolve(rawText);
            } catch (e) {
                reject(e);
            }
        });

        pdfParser.parseBuffer(buffer);
    });
}
