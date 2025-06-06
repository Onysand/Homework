"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, File, ImageIcon, Video, Music, AlertCircle, CheckCircle } from "lucide-react"
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
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("Files dropped:", acceptedFiles)
    setUploading(true)
    setUploadProgress(0)
    setError(null)
    setSuccess(null)

    try {
      const uploadPromises = acceptedFiles.map(async (file, index) => {
        console.log(`Uploading file ${index + 1}:`, file.name)

        const uploadedFile = await uploadToBlob(file, (progress) => {
          setUploadProgress((prev) => {
            const newProgress = prev + progress / acceptedFiles.length
            console.log(`Upload progress: ${newProgress}%`)
            return newProgress
          })
        })

        console.log("File uploaded successfully:", uploadedFile.url)

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
      setSuccess(`Successfully uploaded ${uploadedFiles.length} file(s)`)
      console.log("All files uploaded successfully")
    } catch (error) {
      console.error("Upload failed:", error)
      setError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    multiple: true,
    maxSize: 50 * 1024 * 1024, // 50MB
    onError: (error) => {
      console.error("Dropzone error:", error)
      setError("File selection failed")
    },
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
        <Card className="border-2 border-dashed border-gray-700 bg-gray-900/50 backdrop-blur-sm">
          <div
              {...getRootProps()}
              className={`p-12 text-center cursor-pointer transition-colors ${
                  isDragActive ? "border-white bg-gray-800/50" : "hover:border-gray-600 hover:bg-gray-800/30"
              }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragActive ? "Drop files here" : "Upload your files"}
            </h3>
            <p className="text-gray-400 mb-4">Drag & drop files here, or click to select files</p>
            <p className="text-sm text-gray-500">Maximum file size: 50MB</p>

            {/* Debug info */}
            <div className="mt-4 text-xs text-gray-600">
              <p>Debug: Click here or drag files to test upload</p>
            </div>
          </div>
        </Card>

        {/* File Rejections */}
        {fileRejections.length > 0 && (
            <Card className="bg-red-900/20 border-red-700 p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Some files were rejected:</span>
              </div>
              <ul className="mt-2 text-sm text-red-300">
                {fileRejections.map(({ file, errors }) => (
                    <li key={file.name}>
                      {file.name}: {errors.map((e) => e.message).join(", ")}
                    </li>
                ))}
              </ul>
            </Card>
        )}

        {/* Error Message */}
        {error && (
            <Card className="bg-red-900/20 border-red-700 p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">Upload Error:</span>
              </div>
              <p className="mt-1 text-red-300">{error}</p>
            </Card>
        )}

        {/* Success Message */}
        {success && (
            <Card className="bg-green-900/20 border-green-700 p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{success}</span>
              </div>
            </Card>
        )}

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
              <h3 className="text-2xl font-bold text-white">Uploaded Files ({files.length})</h3>
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
                            <p className="text-xs text-gray-500 truncate max-w-md">{file.url}</p>
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
