"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, File, ImageIcon, Video, Music } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FilePreview } from "./file-preview"
import { uploadToBlob } from "@/lib/upload"
import { formatFileSize } from "@/lib/utils"
import type { UploadedFile } from "@/types/file"

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        const uploadedFile = await uploadToBlob(file, (progress) => {
          setUploadProgress((prev) => prev + progress / acceptedFiles.length)
        })

        return {
          id: Date.now() + index,
          name: file.name,
          size: file.size,
          type: file.type,
          url: uploadedFile.url,
          uploadedAt: new Date(),
        }
      })

      const uploadedFiles = await Promise.all(uploadPromises)
      setFiles((prev) => [...prev, ...uploadedFiles])
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 5 * 1024 * 1024, // 5MB
  })

  const removeFile = (id: number) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (type.startsWith("video/")) return <Video className="h-5 w-5" />
    if (type.startsWith("audio/")) return <Music className="h-5 w-5" />
    return <File className="h-5 w-5" />
  }

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      <Card className={`border-2 border-dashed border-gray-700 bg-gray-900/50 backdrop-blur-sm ${
            isDragActive ? "border-white bg-gray-800/50" : "hover:border-gray-600 hover:bg-gray-800/30"
      } duration-300`}>
        <div
          {...getRootProps()}
          className={`p-12 text-center cursor-pointer transition-colors`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {isDragActive ? "Drop files here" : "Upload your files"}
          </h3>
          <p className="text-gray-400 mb-4">Drag & drop files here, or click to select files</p>
          <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
        </div>
      </Card>

      {/* Upload Progress */}
      {uploading && (
        <Card className="bg-gray-900/50 border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Uploading files...</span>
            <span className="text-gray-400">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </Card>
      )}

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Uploaded Files</h3>
          <div className="grid gap-4">
            {files.map((file) => (
              <Card key={file.id} className="bg-gray-900/50 border-gray-700 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-gray-400">{getFileIcon(file.type)}</div>
                    <div>
                      <p className="text-white font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(file.size)} • {file.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FilePreview file={file} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
