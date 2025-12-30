import { getAllSnippets } from "@/actions/snippets";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const metadata = {
  title: "Dashboard - HTML Preview",
  description: "Manage your HTML snippets",
};

export default async function DashboardPage() {
  const result = await getAllSnippets();

  if (!result.success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <p className="text-destructive">Failed to load snippets</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your HTML snippets
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <DashboardClient snippets={result.snippets || []} />
      </div>
    </div>
  );
}
