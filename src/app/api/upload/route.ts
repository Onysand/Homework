import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
    try {
        console.log("Upload API called")

        const formData = await request.formData()
        const file = formData.get("file") as File

        if (!file) {
            console.error("No file provided")
            return NextResponse.json({ error: "No file provided" }, { status: 400 })
        }

        console.log("File received:", {
            name: file.name,
            size: file.size,
            type: file.type,
        })

        // Check file size (50MB limit)
        if (file.size > 50 * 1024 * 1024) {
            console.error("File too large:", file.size)
            return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 })
        }

        // Check if Vercel Blob token is available
        const blobToken = process.env.BLOB_READ_WRITE_TOKEN
        if (!blobToken) {
            console.error("BLOB_READ_WRITE_TOKEN not configured")
            return NextResponse.json(
                {
                    error: "Blob storage not configured. Please set BLOB_READ_WRITE_TOKEN environment variable.",
                },
                { status: 500 },
            )
        }

        // Try to import and use Vercel Blob
        try {
            const { put } = await import("@vercel/blob")

            console.log("Uploading to Vercel Blob...")
            const blob = await put(file.name, file, {
                access: "public",
                token: blobToken,
            })

            console.log("Upload successful:", blob.url)
            return NextResponse.json({ url: blob.url })
        } catch (blobError) {
            console.error("Vercel Blob upload failed:", blobError)

            // Fallback: Create a data URL for small files (for demo purposes)
            if (file.size < 1024 * 1024) {
                // 1MB limit for data URL
                const arrayBuffer = await file.arrayBuffer()
                const base64 = Buffer.from(arrayBuffer).toString("base64")
                const dataUrl = `data:${file.type};base64,${base64}`

                console.log("Using data URL fallback")
                return NextResponse.json({
                    url: dataUrl,
                    fallback: true,
                    message: "Using temporary data URL (Vercel Blob not available)",
                })
            }

            throw blobError
        }
    } catch (error) {
        console.error("Upload error:", error)
        return NextResponse.json(
            {
                error: "Upload failed",
                details: error instanceof Error ? error.message : "Unknown error",
                timestamp: new Date().toISOString(),
            },
            { status: 500 },
        )
    }
}

// Add GET method for testing
export async function GET() {
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN

    return NextResponse.json({
        status: "API is working",
        blobConfigured: !!blobToken,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    })
}
