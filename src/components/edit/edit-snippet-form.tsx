"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSnippet } from "@/actions/snippets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Snippet } from "../../../generated/prisma";
import { HtmlPreviewClient } from "@/components/preview/html-preview-client";

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
    expiresIn: "",
    expiryUnit: "days" as "hours" | "days",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const expiresIn = formData.expiresIn
      ? parseInt(formData.expiresIn)
      : undefined;

    const result = await updateSnippet({
      slug: snippet.slug,
      title: formData.title,
      html: formData.html,
      css: formData.css || undefined,
      js: formData.js || undefined,
      expiresIn: expiresIn,
      expiryUnit: formData.expiryUnit,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Snippet updated successfully");
      router.push(`/preview/${snippet.slug}`);
    } else {
      toast.error(result.error || "Failed to update snippet");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side: Form */}
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
          <Textarea
            id="html"
            value={formData.html}
            onChange={(e) => handleChange("html", e.target.value)}
            placeholder="<h1>Hello World</h1>"
            required
          />
        </div>

        {/* CSS Editor */}
        <div className="space-y-2">
          <Label htmlFor="css">CSS (Optional)</Label>
          <Textarea
            id="css"
            value={formData.css}
            onChange={(e) => handleChange("css", e.target.value)}
            placeholder="h1 { color: blue; }"
          />
        </div>

        {/* JS Editor */}
        <div className="space-y-2">
          <Label htmlFor="js">JavaScript (Optional)</Label>
          <Textarea
            id="js"
            value={formData.js}
            onChange={(e) => handleChange("js", e.target.value)}
            placeholder="console.log('Hello');"
          />
        </div>

        {/* Expiry Settings */}
        <div className="space-y-2 border-t pt-4">
          <Label>Snippet Expiry (Optional)</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={formData.expiresIn}
              onChange={(e) => handleChange("expiresIn", e.target.value)}
              placeholder="e.g., 24"
              min="0"
              className="flex-1"
            />
            <Select
              value={formData.expiryUnit}
              onValueChange={(value) =>
                handleChange("expiryUnit", value as "hours" | "days")
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">
            Leave empty to remove expiry date
          </p>
        </div>

        {/* Buttons */}
        <div className="pt-4">
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>

      <HtmlPreviewClient
        html={formData.html}
        css={formData.css}
        js={formData.js}
        className="h-full min-h-160"
      />
    </div>
  );
}
