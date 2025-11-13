-- Gallery Video Migration - Skip Existing Columns
-- Since columns already exist, just ensure thumbnail_filepath is nullable
-- This is the ONLY step you need to run if columns already exist

-- Make thumbnail_filepath nullable (safe to run even if already nullable)
ALTER TABLE gallery_images 
MODIFY COLUMN thumbnail_filepath VARCHAR(500) NULL;

-- That's it! The other columns (media_type, video_duration) and index (idx_media_type) already exist.

