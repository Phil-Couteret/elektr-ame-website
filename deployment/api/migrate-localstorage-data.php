<?php
/**
 * Migration Script: Move localStorage Events and Artists to Database
 * Run this once to migrate existing data from localStorage to MySQL
 * 
 * Usage: Visit http://localhost:8000/api/migrate-localstorage-data.php in browser
 * Or run: php api/migrate-localstorage-data.php
 */

session_start();

header('Content-Type: text/html; charset=utf-8');

// Include database config
require_once __DIR__ . '/config.php';

echo "<!DOCTYPE html><html><head><title>Data Migration</title>";
echo "<style>body{font-family:Arial,sans-serif;max-width:800px;margin:50px auto;padding:20px;background:#1a1a1a;color:#fff;}";
echo "h1{color:#4CAF50;}h2{color:#2196F3;}p{margin:10px 0;}";
echo ".success{color:#4CAF50;}.error{color:#f44336;}.info{color:#2196F3;background:#333;padding:15px;border-radius:5px;margin:20px 0;}";
echo "code{background:#000;padding:2px 6px;border-radius:3px;color:#4CAF50;}</style></head><body>";

echo "<h1>🔄 Data Migration: localStorage → Database</h1>";

try {
    // Test database connection
    $pdo->query("SELECT 1");
    echo "<p class='success'>✅ Database connection: SUCCESS</p>";
    
    // Sample data from the initialData in useAdminData.ts
    $sampleEvents = [
        [
            'title' => "Techno Night: Barcelona Underground",
            'description' => "A night of cutting-edge techno with Barcelona's best local talent.",
            'date' => '2025-05-28',
            'time' => '20:00',
            'location' => 'Club Apolo, Barcelona',
            'status' => 'published'
        ],
        [
            'title' => "Electronic Beach Session",
            'description' => "Sunset to sunrise electronic music experience on the beach.",
            'date' => '2025-06-15',
            'time' => '19:00',
            'location' => 'Barceloneta Beach',
            'status' => 'published'
        ],
        [
            'title' => "Digital Dreams Festival",
            'description' => "Our annual electronic music festival featuring international artists.",
            'date' => '2025-07-05',
            'time' => '18:00',
            'location' => 'Parc del Fòrum, Barcelona',
            'status' => 'published'
        ]
    ];

    $sampleArtists = [
        [
            'name' => 'Mixel',
            'nickname' => '',
            'bio' => "Barcelona-based electronic music producer known for blending deep house with ambient textures. Mixel has been crafting immersive soundscapes since 2018.",
            'bio_key' => 'artist.mixel.bio',
            'picture' => '/elektr-ame-media/999c996c-ad69-4db9-b585-0fcdc4c5f718.png',
            'social_media' => json_encode([
                'soundcloud' => '#',
                'instagram' => '#'
            ]),
            'status' => 'active'
        ],
        [
            'name' => 'Rakel',
            'nickname' => 'Raquel Porta',
            'bio' => "Born in Lleida, Raquel Porta —better known as Rakel— is passionate about music and everything related to creativity. Her artistic universe is marked by a wide and diverse musical influence that has been part of her life from a very young age, both personally and professionally. For Rakel, music is pure electricity. That energy that runs through the body is impossible to contain: you have to let it flow. After 15 years living in London, where she began her career as a DJ, Rakel moved to Barcelona, the city where she currently resides and where she has developed her career professionally. She has performed at numerous private events and clubs throughout Barcelona and beyond. Rakel doesn't just play music, she lives it, transforms it and shares it. Currently, co-founder of 'Elektr'Âme', a musical association based in Barcelona and focused on developing new projects.",
            'bio_key' => 'artist.rakel.bio',
            'picture' => '/elektr-ame-media/40fb0100-2718-415c-b9d2-84d7887d7471.png',
            'social_media' => json_encode([
                'soundcloud' => 'https://soundcloud.com/rakel_raquel-porta',
                'instagram' => '#',
                'linktree' => 'https://linktr.ee/rakel_raquel'
            ]),
            'status' => 'active'
        ]
    ];

    echo "<div class='info'>";
    echo "<h2>📋 Migration Plan</h2>";
    echo "<p>This script will migrate sample events and artists to the database.</p>";
    echo "<p><strong>Note:</strong> If you have data in localStorage, you'll need to export it manually and update this script.</p>";
    echo "</div>";

    // Migrate Events
    echo "<h2>📅 Migrating Events</h2>";
    $eventsMigrated = 0;
    $eventsSkipped = 0;

    foreach ($sampleEvents as $event) {
        // Check if event already exists (by title and date)
        $eventDate = $event['date'] . ' ' . $event['time'] . ':00';
        $stmt = $pdo->prepare("SELECT id FROM events WHERE title = ? AND event_date = ?");
        $stmt->execute([$event['title'], $eventDate]);
        
        if ($stmt->fetch()) {
            $eventsSkipped++;
            echo "<p>⏭️  Skipped: {$event['title']} (already exists)</p>";
            continue;
        }

        // Insert event
        $stmt = $pdo->prepare("
            INSERT INTO events (title, description, event_date, location, status)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $event['title'],
            $event['description'],
            $eventDate,
            $event['location'],
            $event['status']
        ]);
        
        $eventsMigrated++;
        echo "<p class='success'>✅ Migrated: {$event['title']}</p>";
    }

    echo "<p class='success'><strong>Events: {$eventsMigrated} migrated, {$eventsSkipped} skipped</strong></p>";

    // Migrate Artists
    echo "<h2>🎵 Migrating Artists</h2>";
    $artistsMigrated = 0;
    $artistsSkipped = 0;

    foreach ($sampleArtists as $artist) {
        // Check if artist already exists (by name)
        $stmt = $pdo->prepare("SELECT id FROM artists WHERE name = ?");
        $stmt->execute([$artist['name']]);
        
        if ($stmt->fetch()) {
            $artistsSkipped++;
            echo "<p>⏭️  Skipped: {$artist['name']} (already exists)</p>";
            continue;
        }

        // Insert artist
        $stmt = $pdo->prepare("
            INSERT INTO artists (name, nickname, bio, bio_key, picture, social_media, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $artist['name'],
            $artist['nickname'] ?? '',
            $artist['bio'],
            $artist['bio_key'] ?? '',
            $artist['picture'] ?? '',
            $artist['social_media'],
            $artist['status']
        ]);
        
        $artistsMigrated++;
        echo "<p class='success'>✅ Migrated: {$artist['name']}</p>";
    }

    echo "<p class='success'><strong>Artists: {$artistsMigrated} migrated, {$artistsSkipped} skipped</strong></p>";

    // Summary
    echo "<hr>";
    echo "<h2>✅ Migration Complete!</h2>";
    echo "<div class='info'>";
    echo "<p><strong>Summary:</strong></p>";
    echo "<ul>";
    echo "<li>Events: {$eventsMigrated} migrated, {$eventsSkipped} skipped</li>";
    echo "<li>Artists: {$artistsMigrated} migrated, {$artistsSkipped} skipped</li>";
    echo "</ul>";
    echo "<p><strong>Next Steps:</strong></p>";
    echo "<ol>";
    echo "<li>Clear your browser's localStorage (optional)</li>";
    echo "<li>Refresh the admin panel - data should now load from the database</li>";
    echo "<li>Delete this migration script for security</li>";
    echo "</ol>";
    echo "</div>";

} catch (PDOException $e) {
    echo "<p class='error'>❌ Database Error: " . htmlspecialchars($e->getMessage()) . "</p>";
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "</body></html>";
?>

