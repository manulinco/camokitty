-- Migration: Add missing columns if user had an old version of the DB
ALTER TABLE hides ADD COLUMN pose_id TEXT;
ALTER TABLE hides ADD COLUMN rotation INTEGER DEFAULT 0;
ALTER TABLE hides ADD COLUMN rotation_x INTEGER DEFAULT 0;
ALTER TABLE hides ADD COLUMN rotation_y INTEGER DEFAULT 0;
ALTER TABLE hides ADD COLUMN scale REAL DEFAULT 1.0;
ALTER TABLE hides ADD COLUMN pos_left REAL DEFAULT 50.0;
ALTER TABLE hides ADD COLUMN pos_top REAL DEFAULT 50.0;
