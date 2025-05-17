"use client"

import type React from "react"

import { useState } from "react"
import { FileUp, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"

export function UploadListForm() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase()

      if (fileExtension === "csv" || fileExtension === "xlsx" || fileExtension === "xls") {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload a CSV, XLSX, or XLS file",
          variant: "destructive",
        })
        e.target.value = ""
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      // Get the authentication token from localStorage
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to upload lists",
          variant: "destructive"
        })
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('http://localhost:5000/api/lists/upload', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.detail || 'Upload failed')
      }

      toast({
        title: "List uploaded successfully",
        description: `The list has been uploaded successfully. ${data.list.totalLeads} leads processed`,
      })

      // Refresh the lists table using global function
      if (typeof window !== 'undefined' && typeof window.refreshLists === 'function') {
        window.refreshLists()
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload",
        variant: "destructive",
      })
      throw error
    }

    clearInterval(interval)
    setUploadProgress(100)

    setTimeout(() => {
      setIsUploading(false)
      setFile(null)

      toast({
        title: "List uploaded successfully",
        description: "The list has been uploaded and distributed to agents",
      })

      if (document.getElementById("file-upload") as HTMLInputElement) {
        ;(document.getElementById("file-upload") as HTMLInputElement).value = ""
      }
    }, 500)
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file-upload">Upload CSV, XLSX, or XLS file</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled={isUploading}
            className="flex-1"
          />
          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            {isUploading ? (
              <>Uploading</>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </div>

      {file && (
        <div className="flex items-center gap-2 text-sm">
          <FileUp className="h-4 w-4" />
          <span>{file.name}</span>
          <span className="text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-right">{uploadProgress}%</p>
        </div>
      )}

      <div className="rounded-md bg-muted p-4">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center text-white">
            <FileUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">File Format Requirements</h3>
            <ul className="mt-2 text-sm text-muted-foreground list-disc pl-4 space-y-1">
              <li>CSV, XLSX, or XLS files only</li>
              <li>Required columns: FirstName, Phone, Notes</li>
              <li>Phone numbers should include country code</li>
              <li>First row should be column headers</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
