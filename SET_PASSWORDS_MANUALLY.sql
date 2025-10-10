-- Manual Password Setup for Existing Members
-- Use these SQL commands in phpMyAdmin to set passwords

-- IMPORTANT: First, check your member IDs and emails:
-- SELECT id, email, first_name, last_name FROM members;

-- Option 1: Set password for Member ID 1
-- Password: elektrame2025
UPDATE members 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE id = 1;

-- Option 2: Set password for Member ID 2
-- Password: elektrame2025
UPDATE members 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE id = 2;

-- Verify passwords were set:
SELECT id, email, first_name, last_name, 
       CASE WHEN password_hash IS NULL THEN 'NO PASSWORD' ELSE 'HAS PASSWORD' END as password_status
FROM members;

-- After running this SQL:
-- 1. Tell members their login credentials:
--    - Email: [their email]
--    - Password: elektrame2025
-- 2. They can log in at: https://www.elektr-ame.com/member-login
-- 3. (Optional) They should change their password after first login

