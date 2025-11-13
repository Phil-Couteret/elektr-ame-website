-- Fix old image paths that are missing the 'public/' prefix
-- Run this on OVH database to fix white/broken images

-- Fix gallery_images paths
UPDATE gallery_images 
SET filepath = CONCAT('public/', filepath)
WHERE filepath NOT LIKE 'public/%' AND filepath != '';

UPDATE gallery_images 
SET thumbnail_filepath = CONCAT('public/', thumbnail_filepath)
WHERE thumbnail_filepath NOT LIKE 'public/%' AND thumbnail_filepath IS NOT NULL AND thumbnail_filepath != '';

-- Fix artist_images paths (if table exists)
UPDATE artist_images 
SET filepath = CONCAT('public/', filepath)
WHERE filepath NOT LIKE 'public/%' AND filepath != '';

UPDATE artist_images 
SET thumbnail_filepath = CONCAT('public/', thumbnail_filepath)
WHERE thumbnail_filepath NOT LIKE 'public/%' AND thumbnail_filepath IS NOT NULL AND thumbnail_filepath != '';

-- Fix events picture paths (if applicable)
UPDATE events 
SET picture = CONCAT('public/', picture)
WHERE picture NOT LIKE 'public/%' AND picture IS NOT NULL AND picture != '';

-- Verify the fix
SELECT id, filename, filepath, thumbnail_filepath 
FROM gallery_images 
ORDER BY uploaded_at DESC 
LIMIT 10;

