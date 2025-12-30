"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteSnippet,
  disableSnippet,
  enableSnippet,
} from "@/actions/snippets";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Edit2, Copy, Trash2, MoreVertical } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Snippet } from "../../../generated/prisma";

interface DashboardClientProps {
  snippets: Snippet[];
}

export function DashboardClient({ snippets }: DashboardClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Snippet | null>(null);

  const handleDelete = async () => {
    if (!toDelete) return;

    setIsDeleting(toDelete.id);
    const result = await deleteSnippet(toDelete.id);
    setIsDeleting(null);

    if (result.success) {
      toast.success("Snippet deleted");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete snippet");
    }

    setToDelete(null);
  };

  const handleToggleDisable = async (snippet: Snippet) => {
    const result = snippet.isDisabled
      ? await enableSnippet(snippet.id)
      : await disableSnippet(snippet.id);

    if (result.success) {
      toast.success(
        snippet.isDisabled ? "Snippet enabled" : "Snippet disabled"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update snippet");
    }
  };

  const handleCopyLink = (id: string) => {
    const link = `${window.location.origin}/preview/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No snippets yet. Create one to get started!
        </p>
        <Link href="/">
          <Button>Create Snippet</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {snippets.map((snippet) => (
              <TableRow key={snippet.id}>
                <TableCell className="font-medium">{snippet.title}</TableCell>
                <TableCell>{snippet.views}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      snippet.isDisabled
                        ? "bg-destructive/10 text-destructive"
                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {snippet.isDisabled ? "Disabled" : "Active"}
                  </span>
                </TableCell>
                <TableCell>{snippet.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  {snippet.expiresAt
                    ? snippet.expiresAt.toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/preview/${snippet.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/edit/${snippet.id}`}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleCopyLink(snippet.id)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Copy className="h-4 w-4" />
                        Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleToggleDisable(snippet)}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        {snippet.isDisabled ? "Enable" : "Disable"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setToDelete(snippet)}
                        className="flex items-center gap-2 cursor-pointer text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!toDelete}
        onOpenChange={(open) => !open && setToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogTitle>Delete Snippet?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{toDelete?.title}"? This action
            cannot be undone.
          </AlertDialogDescription>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting === toDelete?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting === toDelete?.id ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
