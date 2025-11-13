-- FIX WHITE/BROKEN IMAGES
-- This fixes old database entries that have paths missing the 'public/' prefix
-- The white images are 404s because paths like "gallery-images/..." should be "public/gallery-images/..."

-- STEP 1: Check which images need fixing
SELECT 
    id,
    filename,
    filepath,
    CASE 
        WHEN filepath LIKE 'public/%' THEN '✅ OK'
        ELSE '❌ NEEDS FIX'
    END as status
FROM gallery_images
ORDER BY uploaded_at DESC;

-- STEP 2: Fix gallery images (only run if you saw images needing fix above)
UPDATE gallery_images 
SET filepath = CONCAT('public/', filepath)
WHERE filepath NOT LIKE 'public/%' AND filepath != '';

UPDATE gallery_images 
SET thumbnail_filepath = CONCAT('public/', thumbnail_filepath)
WHERE thumbnail_filepath NOT LIKE 'public/%' AND thumbnail_filepath IS NOT NULL AND thumbnail_filepath != '';

-- STEP 3: Verify the fix
SELECT id, filename, filepath, thumbnail_filepath 
FROM gallery_images 
ORDER BY uploaded_at DESC 
LIMIT 10;

-- After running this, all images should display correctly and no more white images!

