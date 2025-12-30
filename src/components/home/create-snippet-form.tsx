"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSnippet } from "@/actions/snippets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HtmlPreviewClient } from "@/components/preview/html-preview-client";

export function CreateSnippetForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    html: "<h1>Hello World</h1>",
    css: "",
    js: "",
    expiresIn: 30,
    expiryUnit: "days" as "hours" | "days",
  });

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!formData.html.trim()) {
      toast.error("Please enter HTML content");
      return;
    }

    setIsLoading(true);

    const result = await createSnippet({
      title: formData.title,
      html: formData.html,
      css: formData.css || undefined,
      js: formData.js || undefined,
      expiresIn: formData.expiresIn > 0 ? formData.expiresIn : undefined,
      expiryUnit: formData.expiryUnit,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success("Snippet created successfully!");
      router.push(`/preview/${result.snippet!.slug}`);
    } else {
      toast.error(result.error || "Failed to create snippet");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left side: Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-card p-6 rounded border border-border"
      >
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
            placeholder="h1 { color: blue; font-size: 2rem; }"
          />
        </div>

        {/* JS Editor */}
        <div className="space-y-2">
          <Label htmlFor="js">JavaScript (Optional)</Label>
          <Textarea
            id="js"
            value={formData.js}
            onChange={(e) => handleChange("js", e.target.value)}
            placeholder="document.querySelector('h1').addEventListener('click', () => { console.log('Clicked!'); });"
          />
        </div>

        {/* Expiry */}
        <div className="space-y-2">
          <Label htmlFor="expiresIn">Expires in (0 = Never)</Label>
          <div className="flex gap-2">
            <Input
              id="expiresIn"
              type="number"
              value={formData.expiresIn}
              onChange={(e) =>
                handleChange(
                  "expiresIn",
                  Number.parseInt(e.target.value, 10) || 0
                )
              }
              placeholder="30"
              min="0"
              className="flex-1"
            />
            <Select
              value={formData.expiryUnit}
              onValueChange={(value) => handleChange("expiryUnit", value)}
            >
              <SelectTrigger className="w-30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hours">Hours</SelectItem>
                <SelectItem value="days">Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Creating..." : "Create Snippet"}
        </Button>
      </form>

      {/* Right side: Live Preview */}
      <div className="sticky top-4">
        <HtmlPreviewClient
          html={formData.html}
          css={formData.css}
          js={formData.js}
          className="h-[calc(100vh-200px)]"
        />
      </div>
    </div>
  );
}
