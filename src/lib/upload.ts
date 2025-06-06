export async function uploadToBlob(file: File, onProgress?: (progress: number) => void): Promise<{ url: string }> {
  try {
    // Simulate progress updates
    if (onProgress) {
      onProgress(10)
    }

    // Create FormData for the upload
    const formData = new FormData()
    formData.append("file", file)

    if (onProgress) {
      onProgress(30)
    }

    // Upload to our API route instead of directly to Vercel Blob
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (onProgress) {
      onProgress(70)
    }

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    const result = await response.json()

    if (onProgress) {
      onProgress(100)
    }

    return { url: result.url }
  } catch (error) {
    console.error("Upload error:", error)
    throw new Error("Failed to upload file")
  }
}
