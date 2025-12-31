import { getAllSnippets } from "@/actions/snippets";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PasswordProtection } from "@/components/auth/password-protection";

export default async function DashboardPage() {
  const result = await getAllSnippets();

  if (!result.success) {
    return (
      <PasswordProtection>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-destructive">Failed to load snippets</p>
          </div>
        </div>
      </PasswordProtection>
    );
  }

  return (
    <PasswordProtection>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your HTML snippets
                </p>
              </div>
              <Link href="/">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Snippet
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <DashboardClient snippets={result.snippets || []} />
        </div>
      </div>
    </PasswordProtection>
  );
}
