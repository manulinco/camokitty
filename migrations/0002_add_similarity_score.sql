-- Migration number: 0002_add_similarity_score.sql

ALTER TABLE hides ADD COLUMN similarity_score REAL DEFAULT 0;
