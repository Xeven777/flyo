import { getSnippet } from "@/actions/snippets";
import { notFound } from "next/navigation";
import { EditSnippetForm } from "@/components/edit/edit-snippet-form";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye } from "lucide-react";
import { PasswordProtection } from "@/components/auth/password-protection";

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
    <PasswordProtection>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl flex items-center justify-between mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-foreground">
                Edit: {snippet.title}
              </h1>
            </div>
            <Link href={`/preview/${snippet.slug}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <EditSnippetForm snippet={snippet} />
        </div>
      </div>
    </PasswordProtection>
  );
}
