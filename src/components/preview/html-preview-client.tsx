"use client"

import { useEffect, useRef } from "react"

interface HtmlPreviewClientProps {
  html: string
  css: string
  js: string
}

export function HtmlPreviewClient({ html, css, js }: HtmlPreviewClientProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (!iframeRef.current) return

    const doc = iframeRef.current.contentDocument
    if (!doc) return

    // Build complete HTML document with CSS and JS
    const completeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #fff; }
          ${css}
        </style>
      </head>
      <body>
        ${html}
        <script>
          ${js}
        </script>
      </body>
      </html>
    `

    doc.open()
    doc.write(completeHtml)
    doc.close()
  }, [html, css, js])

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <iframe
          ref={iframeRef}
          className="w-full h-[600px] bg-white"
          title="HTML Preview"
          sandbox="allow-scripts"
          style={{ border: "none" }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        This preview is sandboxed for security. Only JavaScript execution is allowed.
      </p>
    </div>
  )
}
