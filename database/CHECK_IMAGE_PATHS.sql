-- Check image paths to identify which ones need fixing
-- Run this first to see the current state

-- Gallery images
SELECT 
    id,
    filename,
    filepath,
    CASE 
        WHEN filepath LIKE 'public/%' THEN 'OK'
        ELSE 'NEEDS FIX'
    END as path_status,
    media_type
FROM gallery_images
ORDER BY uploaded_at DESC
LIMIT 20;

-- Artist images (if table exists)
SELECT 
    id,
    filename,
    filepath,
    CASE 
        WHEN filepath LIKE 'public/%' THEN 'OK'
        ELSE 'NEEDS FIX'
    END as path_status,
    media_type
FROM artist_images
ORDER BY uploaded_at DESC
LIMIT 10;

