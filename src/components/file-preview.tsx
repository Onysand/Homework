"use client"

import { useState } from "react"
import { Eye, Download, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { UploadedFile } from "@/types/file"

interface FilePreviewProps {
  file: UploadedFile
}

export function FilePreview({ file }: FilePreviewProps) {
  const [isOpen, setIsOpen] = useState(false)

  const downloadFile = () => {
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openInNewTab = () => {
    window.open(file.url, "_blank")
  }

  const renderPreview = () => {
    if (file.type.startsWith("image/")) {
      return (
        <img
          src={file.url || "/placeholder.svg"}
          alt={file.name}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      )
    }

    if (file.type.startsWith("video/")) {
      return (
        <video src={file.url} controls className="max-w-full max-h-96 rounded-lg">
          Your browser does not support the video tag.
        </video>
      )
    }

    if (file.type.startsWith("audio/")) {
      return (
        <audio src={file.url} controls className="w-full">
          Your browser does not support the audio tag.
        </audio>
      )
    }

    return (
      <div className="text-center py-12">
        <p className="text-gray-400 mb-4">Preview not available for this file type</p>
        <Button onClick={openInNewTab} className="bg-white text-black hover:bg-gray-200">
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in New Tab
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            {file.name}
            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={downloadFile} className="text-gray-400 hover:text-white">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={openInNewTab} className="text-gray-400 hover:text-white">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">{renderPreview()}</div>
      </DialogContent>
    </Dialog>
  )
}
