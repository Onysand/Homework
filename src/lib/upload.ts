export async function uploadToBlob(
    file: File,
    onProgress?: (progress: number) => void,
): Promise<{ url: string; fallback?: boolean; message?: string }> {
  try {
    console.log("Starting upload for:", file.name)

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

    console.log("Sending request to /api/upload")

    // Upload to our API route
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    })

    if (onProgress) {
      onProgress(70)
    }

    console.log("Response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Upload failed with status:", response.status, errorText)

      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { error: errorText }
      }

      throw new Error(errorData.error || `Upload failed: ${response.statusText}`)
    }

    const result = await response.json()
    console.log("Upload result:", result)

    if (onProgress) {
      onProgress(100)
    }

    return {
      url: result.url,
      fallback: result.fallback,
      message: result.message,
    }
  } catch (error) {
    console.error("Upload error:", error)
    throw error
  }
}

// Test function to check API availability
export async function testUploadAPI(): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const response = await fetch("/api/upload", {
      method: "GET",
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      return { success: false, error: `API returned ${response.status}` }
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
