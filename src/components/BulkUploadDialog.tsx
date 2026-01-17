"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function BulkUploadDialog({ entity }: { entity: string }) {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState("")
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("file", file)

    const res = await fetch(`/api/upload/${entity}`, {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    setUploading(false)

    if (res.ok) {
      setMessage(`✅ Uploaded ${result.count} ${entity} successfully!`)
    } else {
      setMessage(`❌ Failed: ${result.error || "Unknown error"}`)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          Bulk Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {entity} Excel</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label>Select Excel File (.xlsx)</Label>
            <Input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>

          {message && <p className="text-sm text-gray-600">{message}</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}
