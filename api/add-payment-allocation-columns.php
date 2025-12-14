<?php
/**
 * Add payment allocation columns to payment_transactions table
 * Run this once to add the necessary columns for payment allocation tracking
 */

require_once __DIR__ . '/config.php';

try {
    // Check if columns already exist
    $checkStmt = $pdo->query("SHOW COLUMNS FROM payment_transactions LIKE 'allocated_amount'");
    $columnExists = $checkStmt && $checkStmt->rowCount() > 0;
    
    if ($columnExists) {
        echo "✅ Allocation columns already exist in payment_transactions table.\n";
        exit(0);
    }
    
    // Add columns
    $pdo->exec("
        ALTER TABLE payment_transactions
        ADD COLUMN allocated_amount DECIMAL(10, 2) DEFAULT 0.00 AFTER amount,
        ADD COLUMN allocation_type ENUM('membership_years', 'sponsor_donation') NULL AFTER allocated_amount,
        ADD COLUMN allocation_years INT NULL AFTER allocation_type,
        ADD COLUMN allocation_date TIMESTAMP NULL AFTER allocation_years
    ");
    
    // Add indexes
    $pdo->exec("
        ALTER TABLE payment_transactions
        ADD INDEX idx_allocated_amount (allocated_amount),
        ADD INDEX idx_allocation_type (allocation_type)
    ");
    
    echo "✅ Successfully added allocation columns to payment_transactions table.\n";
    echo "✅ Indexes created successfully.\n";
    
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}

