<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'config.php';

try {
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? 'all';
    $limit = (int)($_GET['limit'] ?? 50);
    $offset = (int)($_GET['offset'] ?? 0);

    $sql = "SELECT * FROM gallery_images WHERE 1=1";
    $params = [];

    if (!empty($search)) {
        $sql .= " AND (filename LIKE ? OR description LIKE ? OR alt_text LIKE ?)";
        $searchTerm = "%{$search}%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if ($category !== 'all') {
        $sql .= " AND category = ?";
        $params[] = $category;
    }

    $sql .= " ORDER BY uploaded_at DESC";

    if ($limit > 0) {
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $countSql = "SELECT COUNT(*) as total FROM gallery_images WHERE 1=1";
    $countParams = [];

    if (!empty($search)) {
        $countSql .= " AND (filename LIKE ? OR description LIKE ? OR alt_text LIKE ?)";
        $searchTerm = "%{$search}%";
        $countParams[] = $searchTerm;
        $countParams[] = $searchTerm;
        $countParams[] = $searchTerm;
    }

    if ($category !== 'all') {
        $countSql .= " AND category = ?";
        $countParams[] = $category;
    }

    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($countParams);
    $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    $imagesByCategory = [];
    foreach ($images as $image) {
        $cat = $image['category'];
        if (!isset($imagesByCategory[$cat])) {
            $imagesByCategory[$cat] = [];
        }
        $imagesByCategory[$cat][] = $image;
    }

    $categoryLabels = [
        'events' => 'Events',
        'artists' => 'Artists',
        'venue' => 'Venue',
        'community' => 'Community',
        'other' => 'Other'
    ];

    echo json_encode([
        'success' => true,
        'data' => [
            'images' => $images,
            'images_by_category' => $imagesByCategory,
            'total_count' => (int)$totalCount,
            'category_labels' => $categoryLabels,
            'pagination' => [
                'limit' => $limit,
                'offset' => $offset,
                'has_more' => ($offset + $limit) < $totalCount
            ]
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>