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
    <div
      className={`bg-card border border-border rounded-lg overflow-hidden ${className}`}
    >
      <iframe
        srcDoc={srcdoc}
        className="w-full bg-white h-full min-h-[500px]"
        title="HTML Preview"
        sandbox="allow-scripts"
      />
    </div>
  );
}
