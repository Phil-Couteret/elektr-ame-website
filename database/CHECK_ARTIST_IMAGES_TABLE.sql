-- Check if artist_images table exists and its structure
DESCRIBE artist_images;

-- Check for any existing records
SELECT COUNT(*) as total_records FROM artist_images;

-- Show any recent records
SELECT id, artist_id, filename, media_type, is_profile_picture 
FROM artist_images 
ORDER BY uploaded_at DESC 
LIMIT 5;

