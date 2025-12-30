import { CreateSnippetForm } from "@/components/home/create-snippet-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Code2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">HTML Preview</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Create a New Snippet
          </h2>
          <p className="text-muted-foreground mb-8">
            Create shareable HTML snippets with CSS and JavaScript. Get instant
            live previews and manage all your snippets in one place.
          </p>

          <CreateSnippetForm />
        </div>
      </div>
    </div>
  );
}
