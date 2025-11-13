-- Check Gallery Video Support Status
-- Run this to see what columns/indexes already exist

SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gallery_images'
    AND COLUMN_NAME IN ('media_type', 'video_duration', 'thumbnail_filepath')
ORDER BY ORDINAL_POSITION;

-- Check for index
SELECT 
    INDEX_NAME,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'gallery_images'
    AND INDEX_NAME = 'idx_media_type';

