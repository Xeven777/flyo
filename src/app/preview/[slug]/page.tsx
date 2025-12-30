import { getSnippet } from "@/actions/snippets";
import { notFound } from "next/navigation";
import { HtmlPreviewClient } from "@/components/preview/html-preview-client";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getSnippet(slug);

  if (!result.success) {
    return { title: "Snippet Not Found" };
  }

  return {
    title: result.snippet!.title + " - HTML Preview",
    description: `Preview of ${result.snippet!.title}`,
  };
}

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getSnippet(slug);

  if (!result.success) {
    notFound();
  }

  const snippet = result.snippet!;

  const srcdoc = (() => {
    if (!snippet.css && !snippet.js) {
      return snippet.html;
    }
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${snippet.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: system-ui, -apple-system, sans-serif; background: #fff; }
          ${snippet.css || ""}
        </style>
      </head>
      <body>
        ${snippet.html}
        <script>
          ${snippet.js || ""}
        <\/script>
      </body>
      </html>
    `;
  })();

  return (
    <div className="fixed inset-0 w-full h-full">
      <iframe
        srcDoc={srcdoc}
        className="w-full h-full border-0"
        title={snippet.title}
        sandbox="allow-scripts"
      />
    </div>
  );
}
