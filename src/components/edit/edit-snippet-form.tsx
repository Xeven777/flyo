"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSnippet } from "@/actions/snippets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { Snippet } from "../../../generated/prisma";

interface EditSnippetFormProps {
  snippet: Snippet;
}

export function EditSnippetForm({ snippet }: EditSnippetFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: snippet.title,
    html: snippet.html,
    css: snippet.css || "",
    js: snippet.js || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await updateSnippet({
      id: snippet.id,
      title: formData.title,
      html: formData.html,
      css: formData.css || undefined,
      js: formData.js || undefined,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Snippet updated successfully");
      router.push(`/preview/${snippet.id}`);
    } else {
      toast.error(result.error || "Failed to update snippet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Snippet title"
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
          placeholder="h1 { color: blue; }"
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
          placeholder="console.log('Hello');"
          className="w-full h-40 p-3 bg-input border border-border rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Link href={`/preview/${snippet.id}`}>
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
