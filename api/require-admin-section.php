<?php
/**
 * Require admin login and optional section permission.
 * Call after session_start() and require config. Superadmin bypasses all section checks.
 *
 * @param string|null $section One of: events, artists, gallery, members, newsletter, email_automation, invitations, payment
 */
function requireAdminSection($section = null) {
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Unauthorized']);
        exit;
    }
    if ($section === null) {
        return;
    }
    $role = $_SESSION['admin_role'] ?? 'admin';
    if ($role === 'superadmin') {
        return;
    }
    $perms = $_SESSION['admin_permissions'] ?? [];
    if (empty($perms)) {
        global $pdo;
        $id = (int)($_SESSION['admin_id'] ?? 0);
        if ($id && isset($pdo)) {
            try {
                $s = $pdo->query("SHOW COLUMNS FROM admin_users LIKE 'permissions'");
                if ($s && $s->rowCount() > 0) {
                    $st = $pdo->prepare("SELECT permissions FROM admin_users WHERE id = ?");
                    $st->execute([$id]);
                    $row = $st->fetch(PDO::FETCH_ASSOC);
                    $perms = $row ? (json_decode($row['permissions'] ?? '[]', true) ?: []) : [];
                    $_SESSION['admin_permissions'] = $perms;
                }
            } catch (Exception $e) { /* ignore */ }
        }
    }
    if (!in_array($section, $perms)) {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Access denied to this section']);
        exit;
    }
}
