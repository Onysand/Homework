"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { testUploadAPI, uploadToBlob } from "@/lib/upload"

export function UploadTest() {
    const [testing, setTesting] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const testAPI = async () => {
        setTesting(true)
        setResult("Testing API availability...")

        try {
            const apiTest = await testUploadAPI()

            if (apiTest.success) {
                setResult(`✅ API is working!\n${JSON.stringify(apiTest.data, null, 2)}`)
            } else {
                setResult(`❌ API test failed: ${apiTest.error}`)
            }
        } catch (error) {
            setResult(`❌ API test error: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setTesting(false)
        }
    }

    const testFileUpload = async () => {
        setTesting(true)
        setResult("Testing file upload...")

        try {
            // Create a simple test file
            const testContent = `Test file created at ${new Date().toISOString()}`
            const testFile = new File([testContent], "test.txt", { type: "text/plain" })

            const uploadResult = await uploadToBlob(testFile, (progress) => {
                setResult(`Uploading... ${Math.round(progress)}%`)
            })

            let resultMessage = `✅ Upload successful!\nURL: ${uploadResult.url}`

            if (uploadResult.fallback) {
                resultMessage += `\n⚠️ ${uploadResult.message}`
            }

            setResult(resultMessage)
        } catch (error) {
            setResult(`❌ Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`)
        } finally {
            setTesting(false)
        }
    }

    return (
        <Card className="bg-gray-900/50 border-gray-700 p-6 mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Upload System Test</h3>

            <div className="flex gap-4 mb-4">
                <Button onClick={testAPI} disabled={testing} variant="outline">
                    {testing ? "Testing..." : "Test API"}
                </Button>
                <Button onClick={testFileUpload} disabled={testing}>
                    {testing ? "Testing..." : "Test File Upload"}
                </Button>
            </div>

            {result && (
                <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded">
                    <pre className="whitespace-pre-wrap">{result}</pre>
                </div>
            )}

            <div className="mt-4 text-xs text-gray-500">
                <p>
                    <strong>Troubleshooting:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                    <li>If API test fails: Check if the app is deployed correctly</li>
                    <li>If upload fails with &#34;Blob storage not configured&#34;: Set BLOB_READ_WRITE_TOKEN in Vercel dashboard</li>
                    <li>Small files will use data URL fallback if Blob storage isn&#39;t available</li>
                </ul>
            </div>
        </Card>
    )
}
