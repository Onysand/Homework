"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function UploadTest() {
    const [testing, setTesting] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const testUpload = async () => {
        setTesting(true)
        setResult(null)

        try {
            // Create a simple test file
            const testContent = "Hello, this is a test file!"
            const testFile = new File([testContent], "test.txt", { type: "text/plain" })

            const formData = new FormData()
            formData.append("file", testFile)

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (response.ok) {
                const data = await response.json()
                setResult(`✅ Upload successful! URL: ${data.url}`)
            } else {
                const error = await response.text()
                setResult(`❌ Upload failed: ${error}`)
            }
        } catch (error) {
            setResult(`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setTesting(false)
        }
    }

    return (
        <Card className="bg-gray-900/50 border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Upload Test</h3>
            <Button onClick={testUpload} disabled={testing} className="mb-4">
                {testing ? "Testing..." : "Test Upload API"}
            </Button>
            {result && (
                <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded">
                    <pre>{result}</pre>
                </div>
            )}
        </Card>
    )
}
