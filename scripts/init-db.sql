-- SQLite initialization script for HTML Preview App
-- This file is for reference. Prisma will handle migrations.

CREATE TABLE IF NOT EXISTS Snippet (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  html TEXT NOT NULL,
  css TEXT,
  js TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  expiresAt DATETIME,
  isDisabled BOOLEAN DEFAULT 0,
  views INTEGER DEFAULT 0,
  lastViewedAt DATETIME
);

CREATE INDEX idx_snippet_created ON Snippet(createdAt);
CREATE INDEX idx_snippet_expires ON Snippet(expiresAt);
