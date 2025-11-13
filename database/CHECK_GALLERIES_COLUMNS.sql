-- Check which columns exist in the galleries table
DESCRIBE galleries;

-- Or check specific columns
SELECT 
    COLUMN_NAME,
    COLUMN_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'galleries'
ORDER BY ORDINAL_POSITION;

