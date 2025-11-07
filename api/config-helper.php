<?php
/**
 * Configuration Helper for Elektr-Âme
 * Provides environment-aware settings for local development and OVH production
 */

// Detect environment
function isLocalEnvironment() {
    // Check if running on localhost or development server
    $host = $_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? '';
    
    // If no HTTP context (CLI), check if we're in a local development directory
    if (empty($host)) {
        // Check if we're in a typical local development path
        $scriptPath = __DIR__;
        return (
            strpos($scriptPath, '/Users/') !== false ||
            strpos($scriptPath, '/home/') !== false && strpos($scriptPath, '/www/') === false
        );
    }
    
    return (
        strpos($host, 'localhost') !== false ||
        strpos($host, '127.0.0.1') !== false ||
        strpos($host, ':8080') !== false ||
        strpos($host, ':8000') !== false ||
        (isset($_SERVER['HTTP_X_FORWARDED_HOST']) && strpos($_SERVER['HTTP_X_FORWARDED_HOST'], 'localhost') !== false)
    );
}

// Get allowed CORS origins based on environment
function getAllowedOrigins() {
    if (isLocalEnvironment()) {
        return [
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'https://www.elektr-ame.com' // Allow production origin even in local dev
        ];
    } else {
        return [
            'https://www.elektr-ame.com',
            'https://elektr-ame.com'
        ];
    }
}

// Set CORS headers based on environment
function setCorsHeaders() {
    $allowedOrigins = getAllowedOrigins();
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else if (isLocalEnvironment()) {
        // Fallback for file uploads and other cases
        header('Access-Control-Allow-Origin: *');
    } else {
        // Production: only allow specific origins
        header('Access-Control-Allow-Origin: https://www.elektr-ame.com');
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
}

// Get upload directory path based on environment
function getUploadDirectory($subdirectory = '') {
    if (isLocalEnvironment()) {
        // Local: relative to API directory
        $baseDir = __DIR__ . '/../public/';
    } else {
        // OVH Production: use document root
        // OVH structure: www/ is the document root
        // So public/ is at www/public/
        $baseDir = $_SERVER['DOCUMENT_ROOT'] . '/public/';
        
        // Fallback: if DOCUMENT_ROOT doesn't work, try relative
        if (!file_exists($baseDir) && file_exists(dirname(__DIR__) . '/public/')) {
            $baseDir = dirname(__DIR__) . '/public/';
        }
    }
    
    $fullPath = $baseDir . $subdirectory;
    
    // Ensure directory exists
    if (!file_exists($fullPath)) {
        mkdir($fullPath, 0755, true);
    }
    
    return $fullPath;
}

// Get base URL for file paths
function getBaseUrl() {
    if (isLocalEnvironment()) {
        return 'http://localhost:8080';
    } else {
        return 'https://www.elektr-ame.com';
    }
}

// Get file URL path (for database storage)
function getFileUrlPath($relativePath) {
    // Remove leading slash if present, ensure it starts with /
    $path = ltrim($relativePath, '/');
    return '/' . $path;
}
?>

