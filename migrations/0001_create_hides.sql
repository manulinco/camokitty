-- Migration: Create hides table for Camo Kitty
-- This creates the core table that stores all hide entries

CREATE TABLE IF NOT EXISTS hides (
  id TEXT PRIMARY KEY,
  paint_data TEXT NOT NULL,
  bg_id TEXT,
  pose_id TEXT,
  rotation INTEGER DEFAULT 0,
  rotation_x INTEGER DEFAULT 0,
  rotation_y INTEGER DEFAULT 0,
  scale REAL DEFAULT 1.0,
  pos_left REAL DEFAULT 50.0,
  pos_top REAL DEFAULT 50.0,
  created_at INTEGER NOT NULL,
  times_played INTEGER DEFAULT 0,
  average_seek_time REAL DEFAULT 0
);

-- Index for faster random lookups by bgId
CREATE INDEX IF NOT EXISTS idx_hides_bg_id ON hides(bg_id);
