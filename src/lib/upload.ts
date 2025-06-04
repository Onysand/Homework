import { put } from "@vercel/blob"

export async function uploadToBlob(file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> {
  try {
    // Simulate progress for better UX
    if (onProgress) {
      const interval = setInterval(() => {
        onProgress(Math.random() * 50)
      }, 100)

      setTimeout(() => clearInterval(interval), 1000)
    }

    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    if (onProgress) {
      onProgress(100)
    }

    return { url: blob.url }
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload file")
  }
}
