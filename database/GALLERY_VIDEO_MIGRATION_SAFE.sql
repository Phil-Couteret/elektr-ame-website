-- Safe Gallery Video Migration
-- This script checks if columns exist before adding them
-- Run this entire block in phpMyAdmin

-- Step 1: Add media_type column (only if it doesn't exist)
SET @dbname = DATABASE();
SET @tablename = "gallery_images";
SET @columnname = "media_type";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'Column media_type already exists.' AS result;",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " ENUM('image', 'video') DEFAULT 'image' AFTER category;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 2: Add video_duration column (only if it doesn't exist)
SET @columnname = "video_duration";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 'Column video_duration already exists.' AS result;",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " INT NULL AFTER file_size;")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Step 3: Make thumbnail_filepath nullable (safe to run multiple times)
ALTER TABLE gallery_images 
MODIFY COLUMN thumbnail_filepath VARCHAR(500) NULL;

-- Step 4: Add index (only if it doesn't exist)
SET @indexname = "idx_media_type";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (index_name = @indexname)
  ) > 0,
  "SELECT 'Index idx_media_type already exists.' AS result;",
  CONCAT("ALTER TABLE ", @tablename, " ADD INDEX ", @indexname, " (media_type);")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

