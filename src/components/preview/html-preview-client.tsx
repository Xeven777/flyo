"use client";

import { useMemo } from "react";

interface HtmlPreviewClientProps {
  html: string;
  css: string;
  js: string;
  className?: string;
}

export function HtmlPreviewClient({
  html,
  css,
  js,
  className = "",
}: HtmlPreviewClientProps) {
  const srcdoc = useMemo(() => {
    if (!css && !js) {
      return html;
    } else {
      return `
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
        <\/script>
      </body>
      </html>
    `;
    }
  }, [html, css, js]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <iframe
          srcDoc={srcdoc}
          className="w-full bg-white h-[600px] lg:h-[calc(100vh-200px)]"
          title="HTML Preview"
          sandbox="allow-scripts"
        />
      </div>
      <p className="text-xs text-muted-foreground">
        This preview is sandboxed for security. Only JavaScript execution is
        allowed.
      </p>
    </div>
  );
}
