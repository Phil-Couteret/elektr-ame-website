<?php
header('Content-Type: application/json');
// Allow both production and local development
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, ['https://www.elektr-ame.com', 'http://localhost:8080', 'http://127.0.0.1:8080'])) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/config.php';

try {
    $status = $_GET['status'] ?? 'all';
    $limit = (int)($_GET['limit'] ?? 100);
    $offset = (int)($_GET['offset'] ?? 0);

    $sql = "SELECT * FROM artists WHERE 1=1";
    $params = [];

    if ($status !== 'all') {
        $sql .= " AND status = ?";
        $params[] = $status;
    }

    $sql .= " ORDER BY name ASC";

    if ($limit > 0) {
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $artists = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get profile pictures from artist_images table (if it exists)
    $artistIds = array_column($artists, 'id');
    $profilePictures = [];
    
    try {
        if (!empty($artistIds)) {
            $placeholders = implode(',', array_fill(0, count($artistIds), '?'));
            $picStmt = $pdo->prepare("
                SELECT artist_id, filepath 
                FROM artist_images 
                WHERE artist_id IN ($placeholders) AND is_profile_picture = 1
            ");
            $picStmt->execute($artistIds);
            $pics = $picStmt->fetchAll(PDO::FETCH_ASSOC);
            
            foreach ($pics as $pic) {
                $profilePictures[$pic['artist_id']] = '/' . $pic['filepath'];
            }
        }
    } catch (PDOException $e) {
        // artist_images table might not exist yet, ignore
    }

    // Format for frontend
    foreach ($artists as &$artist) {
        // Parse JSON social_media field
        $socialMedia = json_decode($artist['social_media'] ?? '{}', true);
        if (!is_array($socialMedia)) {
            $socialMedia = [];
        }
        
        $artist['socialLinks'] = $socialMedia;
        // Use picture from artist_images if available, otherwise use picture column
        $artist['picture'] = $profilePictures[$artist['id']] ?? ($artist['picture'] ?? '');
        $artist['nickname'] = $artist['nickname'] ?? '';
        $artist['bioKey'] = $artist['bio_key'] ?? '';
        $artist['bioTranslations'] = []; // Not stored in DB yet
        $artist['createdAt'] = $artist['created_at'];
        $artist['updatedAt'] = $artist['updated_at'];
        unset($artist['created_at'], $artist['updated_at'], $artist['social_media']);
    }

    echo json_encode([
        'success' => true,
        'artists' => $artists,
        'count' => count($artists)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

