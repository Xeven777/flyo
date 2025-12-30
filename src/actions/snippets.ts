"use server"

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export interface CreateSnippetInput {
  title: string
  html: string
  css?: string
  js?: string
  expiresIn?: number // days
}

export interface UpdateSnippetInput {
  id: string
  title?: string
  html?: string
  css?: string
  js?: string
  expiresIn?: number
}

// Create a new snippet
export async function createSnippet(input: CreateSnippetInput) {
  try {
    const expiresAt = input.expiresIn ? new Date(Date.now() + input.expiresIn * 24 * 60 * 60 * 1000) : null

    const snippet = await prisma.snippet.create({
      data: {
        title: input.title,
        html: input.html,
        css: input.css || null,
        js: input.js || null,
        expiresAt,
      },
    })

    return { success: true, snippet }
  } catch (error) {
    console.error("[v0] createSnippet error:", error)
    return { success: false, error: "Failed to create snippet" }
  }
}

// Get snippet by ID
export async function getSnippet(id: string) {
  try {
    const snippet = await prisma.snippet.findUnique({
      where: { id },
    })

    if (!snippet) {
      return { success: false, error: "Snippet not found" }
    }

    // Check expiry
    if (snippet.expiresAt && new Date() > snippet.expiresAt) {
      return { success: false, error: "Snippet has expired" }
    }

    // Check if disabled
    if (snippet.isDisabled) {
      return { success: false, error: "Snippet is disabled" }
    }

    // Increment view count and update lastViewedAt
    await prisma.snippet.update({
      where: { id },
      data: {
        views: snippet.views + 1,
        lastViewedAt: new Date(),
      },
    })

    return { success: true, snippet }
  } catch (error) {
    console.error("[v0] getSnippet error:", error)
    return { success: false, error: "Failed to fetch snippet" }
  }
}

// Update snippet
export async function updateSnippet(input: UpdateSnippetInput) {
  try {
    const updateData: any = {}

    if (input.title !== undefined) updateData.title = input.title
    if (input.html !== undefined) updateData.html = input.html
    if (input.css !== undefined) updateData.css = input.css
    if (input.js !== undefined) updateData.js = input.js

    if (input.expiresIn !== undefined) {
      updateData.expiresAt = new Date(Date.now() + input.expiresIn * 24 * 60 * 60 * 1000)
    }

    const snippet = await prisma.snippet.update({
      where: { id: input.id },
      data: updateData,
    })

    return { success: true, snippet }
  } catch (error) {
    console.error("[v0] updateSnippet error:", error)
    return { success: false, error: "Failed to update snippet" }
  }
}

// Delete snippet
export async function deleteSnippet(id: string) {
  try {
    await prisma.snippet.delete({
      where: { id },
    })

    return { success: true }
  } catch (error) {
    console.error("[v0] deleteSnippet error:", error)
    return { success: false, error: "Failed to delete snippet" }
  }
}

// Disable snippet
export async function disableSnippet(id: string) {
  try {
    const snippet = await prisma.snippet.update({
      where: { id },
      data: { isDisabled: true },
    })

    return { success: true, snippet }
  } catch (error) {
    console.error("[v0] disableSnippet error:", error)
    return { success: false, error: "Failed to disable snippet" }
  }
}

// Enable snippet
export async function enableSnippet(id: string) {
  try {
    const snippet = await prisma.snippet.update({
      where: { id },
      data: { isDisabled: false },
    })

    return { success: true, snippet }
  } catch (error) {
    console.error("[v0] enableSnippet error:", error)
    return { success: false, error: "Failed to enable snippet" }
  }
}

// Get all snippets for dashboard
export async function getAllSnippets() {
  try {
    const snippets = await prisma.snippet.findMany({
      orderBy: { createdAt: "desc" },
    })

    return { success: true, snippets }
  } catch (error) {
    console.error("[v0] getAllSnippets error:", error)
    return { success: false, error: "Failed to fetch snippets" }
  }
}
