-- Safe Gallery Migration - Only adds columns that don't exist
-- Run this entire block in phpMyAdmin

-- Add artist_id column (only if event_id already exists, artist_id might too)
SET @dbname = DATABASE();
SET @tablename = "galleries";
SET @columnname = "artist_id";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE table_name = @tablename AND table_schema = @dbname AND column_name = @columnname) > 0,
  "SELECT 'Column artist_id already exists.' AS result;",
  "ALTER TABLE galleries ADD COLUMN artist_id INT NULL AFTER event_id;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add gallery_type column
SET @columnname = "gallery_type";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE table_name = @tablename AND table_schema = @dbname AND column_name = @columnname) > 0,
  "SELECT 'Column gallery_type already exists.' AS result;",
  "ALTER TABLE galleries ADD COLUMN gallery_type ENUM('general', 'event', 'artist') DEFAULT 'general' AFTER title;"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add idx_event_id index
SET @indexname = "idx_event_id";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE table_name = @tablename AND table_schema = @dbname AND index_name = @indexname) > 0,
  "SELECT 'Index idx_event_id already exists.' AS result;",
  "ALTER TABLE galleries ADD INDEX idx_event_id (event_id);"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Add idx_artist_id index
SET @indexname = "idx_artist_id";
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
   WHERE table_name = @tablename AND table_schema = @dbname AND index_name = @indexname) > 0,
  "SELECT 'Index idx_artist_id already exists.' AS result;",
  "ALTER TABLE galleries ADD INDEX idx_artist_id (artist_id);"
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verify the final structure
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'galleries'
ORDER BY ORDINAL_POSITION;

