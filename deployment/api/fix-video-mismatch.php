<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

try {
    // Check for the orphaned database record
    $orphanedFile = '69163602ecbfe_1763063298.mp4';
    $stmt = $pdo->prepare("SELECT id, filename, filepath FROM artist_images WHERE filepath LIKE ?");
    $stmt->execute(['%' . $orphanedFile]);
    $orphanedRecord = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Check for the actual file on disk
    $actualFile = '6916376f48af0_1763063663.mp4';
    $stmt2 = $pdo->prepare("SELECT id, filename, filepath FROM artist_images WHERE filepath LIKE ?");
    $stmt2->execute(['%' . $actualFile]);
    $actualRecord = $stmt2->fetch(PDO::FETCH_ASSOC);
    
    $actions = [];
    
    // If orphaned record exists, update it to point to the actual file
    if ($orphanedRecord && !$actualRecord) {
        $updateStmt = $pdo->prepare("
            UPDATE artist_images 
            SET filepath = ?, filename = ? 
            WHERE id = ?
        ");
        $newPath = 'public/artist-images/' . $actualFile;
        $updateStmt->execute([
            $newPath,
            'WhatsApp Video 2025-11-12 at 12.12.31.mp4',
            $orphanedRecord['id']
        ]);
        $actions[] = "Updated database record ID {$orphanedRecord['id']} to point to existing file";
    }
    
    // Check for files on disk not in database
    $diskFile1 = '6915b9f57759f_1763031541.png';
    $stmt3 = $pdo->prepare("SELECT id FROM artist_images WHERE filepath LIKE ?");
    $stmt3->execute(['%' . $diskFile1]);
    if (!$stmt3->fetch()) {
        $actions[] = "Found orphaned file on disk: $diskFile1 (not in database)";
    }
    
    echo json_encode([
        'success' => true,
        'orphaned_db_record' => $orphanedRecord,
        'actual_file_in_db' => $actualRecord,
        'actions_taken' => $actions,
        'recommendation' => $orphanedRecord && !$actualRecord ? 'Record updated to match actual file' : 'Check manually'
    ], JSON_PRETTY_PRINT);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

