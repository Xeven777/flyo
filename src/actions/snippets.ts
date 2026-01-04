"use server";

import prisma from "@/lib/prisma";
import { refresh, revalidatePath } from "next/cache";

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

// Check if slug exists and generate unique one
async function generateUniqueSlug(baseTitle: string): Promise<string> {
  let slug = generateSlug(baseTitle);
  let counter = 1;

  // Check if slug exists
  while (true) {
    const existing = await prisma.snippet.findUnique({
      where: { slug: counter === 1 ? slug : `${slug}-${counter}` },
    });

    if (!existing) {
      return counter === 1 ? slug : `${slug}-${counter}`;
    }
    counter++;
  }
}

export interface CreateSnippetInput {
  title: string;
  html: string;
  css?: string;
  js?: string;
  expiresIn?: number; // hours
  expiryUnit?: "hours" | "days"; // Unit for expiry
}

export interface UpdateSnippetInput {
  slug: string;
  title?: string;
  html?: string;
  css?: string;
  js?: string;
  expiresIn?: number;
  expiryUnit?: "hours" | "days";
  newSlug?: string;
}

// Create a new snippet
export async function createSnippet(input: CreateSnippetInput) {
  try {
    const slug = await generateUniqueSlug(input.title);

    let expiresAt: Date | null = null;
    if (input.expiresIn && input.expiresIn > 0) {
      const unit = input.expiryUnit || "days";
      const multiplier =
        unit === "hours" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      expiresAt = new Date(Date.now() + input.expiresIn * multiplier);
    }

    const snippet = await prisma.snippet.create({
      data: {
        slug,
        title: input.title,
        html: input.html,
        css: input.css || null,
        js: input.js || null,
        expiresAt,
      },
    });
    revalidatePath("/dashboard");
    return { success: true, snippet };
  } catch (error) {
    console.error("createSnippet error:", error);
    return { success: false, error: "Failed to create snippet" };
  }
}

// Get snippet by slug (for editing - no expiry check)
export async function getSnippet(slug: string) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { slug },
    });

    if (!snippet) {
      return { success: false, error: "Snippet not found" };
    }

    return { success: true, snippet };
  } catch (error) {
    console.error("getSnippet error:", error);
    return { success: false, error: "Failed to fetch snippet" };
  }
}

// Get snippet for preview (checks expiry and disabled status)
export async function getSnippetForPreview(slug: string) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { slug },
    });

    if (!snippet) {
      return { success: false, error: "Snippet not found" };
    }

    // Check expiry - only for previews
    if (snippet.expiresAt && new Date() > snippet.expiresAt) {
      return { success: false, error: "Snippet has expired" };
    }

    // Check if disabled
    if (snippet.isDisabled) {
      return { success: false, error: "Snippet is disabled" };
    }

    // Increment view count and update lastViewedAt
    await prisma.snippet.update({
      where: { slug },
      data: {
        views: snippet.views + 1,
        lastViewedAt: new Date(),
      },
    });
    return { success: true, snippet };
  } catch (error) {
    console.error("getSnippetForPreview error:", error);
    return { success: false, error: "Failed to fetch snippet" };
  }
}

// Update snippet
export async function updateSnippet(input: UpdateSnippetInput) {
  try {
    const updateData: any = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.html !== undefined) updateData.html = input.html;
    if (input.css !== undefined) updateData.css = input.css;
    if (input.js !== undefined) updateData.js = input.js;

    if (input.expiresIn !== undefined && input.expiresIn > 0) {
      const unit = input.expiryUnit || "days";
      const multiplier =
        unit === "hours" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
      updateData.expiresAt = new Date(
        Date.now() + input.expiresIn * multiplier
      );
    }

    // Handle slug change if requested
    if (input.newSlug) {
      const sanitized = generateSlug(input.newSlug);
      if (!sanitized) {
        return { success: false, error: "Invalid slug" };
      }

      // If slug is changing, ensure it's unique
      if (sanitized !== input.slug) {
        const existing = await prisma.snippet.findUnique({
          where: { slug: sanitized },
        });

        if (existing) {
          return { success: false, error: "Slug already exists" };
        }

        updateData.slug = sanitized;
      }
    }

    const snippet = await prisma.snippet.update({
      where: { slug: input.slug },
      data: updateData,
    });
    revalidatePath("/dashboard");
    revalidatePath(`/preview/${snippet.slug}`);
    revalidatePath(`/edit/${snippet.slug}`);
    refresh();
    return { success: true, snippet };
  } catch (error) {
    console.error("updateSnippet error:", error);
    return { success: false, error: "Failed to update snippet" };
  }
}

// Delete snippet
export async function deleteSnippet(slug: string) {
  try {
    await prisma.snippet.delete({
      where: { slug },
    });
    refresh();
    return { success: true };
  } catch (error) {
    console.error("deleteSnippet error:", error);
    return { success: false, error: "Failed to delete snippet" };
  }
}

// Disable snippet
export async function disableSnippet(slug: string) {
  try {
    const snippet = await prisma.snippet.update({
      where: { slug },
      data: { isDisabled: true },
    });
    refresh();
    return { success: true, snippet };
  } catch (error) {
    console.error("disableSnippet error:", error);
    return { success: false, error: "Failed to disable snippet" };
  }
}

// Enable snippet
export async function enableSnippet(slug: string) {
  try {
    const snippet = await prisma.snippet.update({
      where: { slug },
      data: { isDisabled: false },
    });
    refresh();
    return { success: true, snippet };
  } catch (error) {
    console.error("enableSnippet error:", error);
    return { success: false, error: "Failed to enable snippet" };
  }
}

// Get all snippets for dashboard
export async function getAllSnippets() {
  try {
    const snippets = await prisma.snippet.findMany({
      orderBy: { createdAt: "desc" },
    });

    return { success: true, snippets };
  } catch (error) {
    console.error("getAllSnippets error:", error);
    return { success: false, error: "Failed to fetch snippets" };
  }
}
