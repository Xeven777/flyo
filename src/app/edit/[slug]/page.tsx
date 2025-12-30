import { getSnippet } from "@/actions/snippets";
import { notFound } from "next/navigation";
import { EditSnippetForm } from "@/components/edit/edit-snippet-form";
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
    title: "Edit " + result.snippet!.title,
  };
}

export default async function EditPage({
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
            Edit: {snippet.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <EditSnippetForm snippet={snippet} />
      </div>
    </div>
  );
}
