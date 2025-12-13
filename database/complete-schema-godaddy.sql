-- Complete Database Schema for Elektr-Âme - GoDaddy Deployment
-- Run this SQL file in GoDaddy phpMyAdmin or MySQL client
-- Database should already be created in GoDaddy cPanel

-- ============================================
-- 1. MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified TINYINT(1) DEFAULT 0,
    email_verification_token VARCHAR(64) NULL,
    email_verified_at DATETIME NULL,
    phone VARCHAR(20) NOT NULL,
    street VARCHAR(255) NULL,
    zip_code VARCHAR(20) NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    INDEX idx_email_verification_token (email_verification_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. PASSWORD RESET TOKENS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at DATETIME NULL,
    ip_address VARCHAR(45) NULL,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_member_id (member_id),
    INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('superadmin', 'admin') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by INT NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    FOREIGN KEY (created_by) REFERENCES admin_users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. ARTISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS artists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NULL,
    bio TEXT,
    bio_key VARCHAR(255) NULL,
    genre VARCHAR(100),
    website VARCHAR(255),
    social_media JSON,
    picture VARCHAR(500) NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. ARTIST IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS artist_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    artist_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    thumbnail_filepath VARCHAR(500) NULL,
    alt_text VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('profile', 'stage', 'studio', 'fans', 'behind_scenes', 'other') DEFAULT 'other',
    media_type ENUM('image', 'video') DEFAULT 'image',
    is_profile_picture BOOLEAN DEFAULT FALSE,
    width INT DEFAULT 0,
    height INT DEFAULT 0,
    file_size INT DEFAULT 0,
    video_duration INT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_artist_id (artist_id),
    INDEX idx_category (category),
    INDEX idx_media_type (media_type),
    INDEX idx_is_profile_picture (is_profile_picture),
    INDEX idx_uploaded_at (uploaded_at),
    FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location VARCHAR(255),
    capacity INT,
    price DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('draft', 'published', 'cancelled') DEFAULT 'draft',
    picture VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_event_date (event_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. MEMBER EVENTS TABLE (Event Registrations)
-- ============================================
CREATE TABLE IF NOT EXISTS member_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    event_id INT NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('registered', 'attended', 'cancelled') DEFAULT 'registered',
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_event (member_id, event_id),
    INDEX idx_member_id (member_id),
    INDEX idx_event_id (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. GALLERIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_id INT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_display_order (display_order),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. GALLERY IMAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS gallery_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    gallery_id INT NULL,
    filename VARCHAR(255) NOT NULL,
    filepath VARCHAR(500) NOT NULL,
    thumbnail_filepath VARCHAR(500) NULL,
    alt_text VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('events', 'artists', 'venue', 'community', 'other') DEFAULT 'other',
    width INT DEFAULT 0,
    height INT DEFAULT 0,
    file_size INT DEFAULT 0,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_gallery_id (gallery_id),
    INDEX idx_category (category),
    INDEX idx_uploaded_at (uploaded_at),
    FOREIGN KEY (gallery_id) REFERENCES galleries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. CONSULTANCY INQUIRIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS consultancy_inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    company_name VARCHAR(255) NULL,
    inquiry_type ENUM('general', 'strategy', 'legal', 'financial', 'other') NOT NULL,
    message TEXT NOT NULL,
    preferred_contact_method ENUM('email', 'phone', 'both') NOT NULL DEFAULT 'email',
    due_date DATE NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. COMPANY CREATION REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS company_creation_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    company_type ENUM('LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 'Other') NOT NULL,
    business_activity TEXT NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    share_capital VARCHAR(50) NULL,
    additional_notes TEXT NULL,
    urgency ENUM('low', 'medium', 'high') NOT NULL DEFAULT 'medium',
    due_date DATE NULL,
    consultancy_inquiry_id INT NULL,
    status ENUM('pending', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_urgency (urgency),
    INDEX idx_consultancy_inquiry_id (consultancy_inquiry_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (consultancy_inquiry_id) REFERENCES consultancy_inquiries(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 12. COMPANY PARTNERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS company_partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id INT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    date_of_birth DATE NOT NULL,
    nationality VARCHAR(100) NOT NULL,
    passport_number VARCHAR(50) NOT NULL,
    passport_expiry DATE NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    tax_id VARCHAR(50) NULL,
    share_percentage DECIMAL(5,2) NOT NULL,
    role ENUM('director', 'shareholder', 'both') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES company_creation_requests(id) ON DELETE CASCADE,
    INDEX idx_request_id (request_id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 13. EMAIL TEMPLATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    template_key VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    subject_en TEXT NOT NULL,
    subject_es TEXT NOT NULL,
    subject_ca TEXT NOT NULL,
    body_en TEXT NOT NULL,
    body_es TEXT NOT NULL,
    body_ca TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_template_key (template_key),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 14. EMAIL AUTOMATION RULES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_automation_rules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rule_name VARCHAR(255) NOT NULL,
    trigger_type ENUM(
        'member_registered',
        'member_approved',
        'member_rejected',
        'membership_expiring_7d',
        'membership_expiring_3d',
        'membership_expiring_1d',
        'membership_expired',
        'membership_renewed',
        'newsletter_welcome',
        'scheduled_campaign'
    ) NOT NULL,
    template_id INT NOT NULL,
    days_offset INT DEFAULT 0 COMMENT 'Days before/after trigger (negative = before)',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (template_id) REFERENCES email_templates(id) ON DELETE CASCADE,
    INDEX idx_trigger_type (trigger_type),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 15. EMAIL QUEUE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_email VARCHAR(255) NOT NULL,
    recipient_name VARCHAR(255),
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    template_key VARCHAR(100),
    member_id INT,
    priority ENUM('low', 'normal', 'high') DEFAULT 'normal',
    status ENUM('pending', 'processing', 'sent', 'failed') DEFAULT 'pending',
    scheduled_for TIMESTAMP NULL DEFAULT NULL,
    sent_at TIMESTAMP NULL DEFAULT NULL,
    error_message TEXT,
    retry_count INT DEFAULT 0,
    max_retries INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_for),
    INDEX idx_priority (priority),
    INDEX idx_member_id (member_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 16. EMAIL LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    email VARCHAR(255) NOT NULL,
    template_key VARCHAR(100),
    subject TEXT NOT NULL,
    trigger_type VARCHAR(100),
    status ENUM('sent', 'failed', 'bounced') DEFAULT 'sent',
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    error_message TEXT,
    FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_member_id (member_id),
    INDEX idx_email (email),
    INDEX idx_sent_at (sent_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 17. NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    first_name VARCHAR(100) NULL,
    last_name VARCHAR(100) NULL,
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    source VARCHAR(100) NULL,
    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 18. NEWSLETTER CAMPAIGNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('draft', 'scheduled', 'sending', 'sent', 'cancelled') DEFAULT 'draft',
    scheduled_for TIMESTAMP NULL,
    sent_at TIMESTAMP NULL,
    recipients_count INT DEFAULT 0,
    opened_count INT DEFAULT 0,
    clicked_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_scheduled_for (scheduled_for)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify all tables were created:
-- SHOW TABLES;
-- 
-- Expected tables:
-- 1. members
-- 2. password_reset_tokens
-- 3. admin_users
-- 4. artists
-- 5. artist_images
-- 6. events
-- 7. member_events
-- 8. galleries
-- 9. gallery_images
-- 10. consultancy_inquiries
-- 11. company_creation_requests
-- 12. company_partners
-- 13. email_templates
-- 14. email_automation_rules
-- 15. email_queue
-- 16. email_logs
-- 17. newsletter_subscribers
-- 18. newsletter_campaigns

