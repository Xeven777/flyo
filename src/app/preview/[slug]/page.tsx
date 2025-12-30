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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">
            {snippet.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Views: {snippet.views} • Last updated:{" "}
            {snippet.updatedAt.toLocaleDateString()}
          </p>
          {snippet.expiresAt && (
            <p className="text-sm text-destructive mt-1">
              Expires: {snippet.expiresAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <HtmlPreviewClient
          html={snippet.html}
          css={snippet.css || ""}
          js={snippet.js || ""}
        />
      </div>
    </div>
  );
}
