-- COMPLETE SQL for Gallery Video Support
-- Copy and paste these statements ONE AT A TIME into phpMyAdmin
-- Or run all at once if your MySQL version supports it

-- Step 1: Add media_type column
ALTER TABLE gallery_images 
ADD COLUMN media_type ENUM('image', 'video') DEFAULT 'image' AFTER category;

-- Step 2: Add video_duration column
ALTER TABLE gallery_images 
ADD COLUMN video_duration INT NULL AFTER file_size;

-- Step 3: Make thumbnail_filepath nullable (videos might not have thumbnails)
ALTER TABLE gallery_images 
MODIFY COLUMN thumbnail_filepath VARCHAR(500) NULL;

-- Step 4: Add index for faster queries
ALTER TABLE gallery_images 
ADD INDEX idx_media_type (media_type);

