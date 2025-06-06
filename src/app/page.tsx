"use client"

import { FileUpload } from "@/components/file-upload"
import { Header } from "@/components/header"

export default function HomePage() {
    return (
        <div className="min-h-screen bg-black">
            <Header />
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Upload Files to Your Project</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Securely upload and manage your files with our powerful platform. Drag & drop or click to select files.
                        </p>
                    </div>
                    <FileUpload />
                </div>
            </main>
        </div>
    )
}
