-- event_id already exists, so just add the rest
-- Run these statements one at a time

-- 1. Add artist_id (only if it doesn't exist)
ALTER TABLE galleries 
ADD COLUMN artist_id INT NULL AFTER event_id;

-- 2. Add gallery_type (only if it doesn't exist)
ALTER TABLE galleries 
ADD COLUMN gallery_type ENUM('general', 'event', 'artist') DEFAULT 'general' AFTER title;

-- 3. Add indexes (only if they don't exist)
ALTER TABLE galleries 
ADD INDEX idx_event_id (event_id);

ALTER TABLE galleries 
ADD INDEX idx_artist_id (artist_id);

-- If you get "Duplicate" errors, that column/index already exists - just skip that statement!

