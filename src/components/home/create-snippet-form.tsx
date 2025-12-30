"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createSnippet } from "@/actions/snippets"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function CreateSnippetForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    html: "<h1>Hello World</h1>",
    css: "",
    js: "",
    expiresIn: 30,
  })

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast.error("Please enter a title")
      return
    }

    if (!formData.html.trim()) {
      toast.error("Please enter HTML content")
      return
    }

    setIsLoading(true)

    const result = await createSnippet({
      title: formData.title,
      html: formData.html,
      css: formData.css || undefined,
      js: formData.js || undefined,
      expiresIn: formData.expiresIn > 0 ? formData.expiresIn : undefined,
    })

    setIsLoading(false)

    if (result.success) {
      toast.success("Snippet created successfully!")
      router.push(`/preview/${result.snippet!.id}`)
    } else {
      toast.error(result.error || "Failed to create snippet")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="My awesome HTML snippet"
          required
        />
      </div>

      {/* HTML Editor */}
      <div className="space-y-2">
        <Label htmlFor="html">HTML</Label>
        <textarea
          id="html"
          value={formData.html}
          onChange={(e) => handleChange("html", e.target.value)}
          placeholder="<h1>Hello World</h1>"
          required
          className="w-full h-40 p-3 bg-input border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* CSS Editor */}
      <div className="space-y-2">
        <Label htmlFor="css">CSS (Optional)</Label>
        <textarea
          id="css"
          value={formData.css}
          onChange={(e) => handleChange("css", e.target.value)}
          placeholder="h1 { color: blue; font-size: 2rem; }"
          className="w-full h-40 p-3 bg-input border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* JS Editor */}
      <div className="space-y-2">
        <Label htmlFor="js">JavaScript (Optional)</Label>
        <textarea
          id="js"
          value={formData.js}
          onChange={(e) => handleChange("js", e.target.value)}
          placeholder="document.querySelector('h1').addEventListener('click', () => { console.log('Clicked!'); });"
          className="w-full h-40 p-3 bg-input border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Expiry */}
      <div className="space-y-2">
        <Label htmlFor="expiresIn">Expires in (days) - 0 = Never</Label>
        <Input
          id="expiresIn"
          type="number"
          value={formData.expiresIn}
          onChange={(e) => handleChange("expiresIn", Number.parseInt(e.target.value, 10) || 0)}
          placeholder="30"
          min="0"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Creating..." : "Create Snippet"}
      </Button>
    </form>
  )
}
