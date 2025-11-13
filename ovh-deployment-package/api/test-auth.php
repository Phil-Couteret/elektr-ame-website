<!DOCTYPE html>
<html>
<head>
    <title>Admin API Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; }
        .test { margin: 10px 0; padding: 10px; background: #16213e; border-radius: 5px; }
        .success { border-left: 4px solid #00ff00; }
        .error { border-left: 4px solid #ff0000; }
        button { padding: 10px 20px; background: #0066ff; color: white; border: none; cursor: pointer; margin: 5px; }
        button:hover { background: #0052cc; }
        pre { background: #0a0a0a; padding: 10px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>🔍 Admin Portal Diagnostic</h1>
    
    <h2>Test 1: PHP Session</h2>
    <div class="test success">
        <?php
        session_start();
        echo "✅ PHP Session Working<br>";
        echo "Session ID: " . session_id();
        ?>
    </div>
    
    <h2>Test 2: Database Connection</h2>
    <div class="test <?php
        try {
            require_once __DIR__ . '/config.php';
            if (isset($pdo)) {
                echo 'success">✅ Database Connected';
            } else {
                echo 'error">❌ Database Connection Failed: $pdo not set';
            }
        } catch (Exception $e) {
            echo 'error">❌ Database Error: ' . htmlspecialchars($e->getMessage());
        }
    ?>
    </div>
    
    <h2>Test 3: Admin Users Table</h2>
    <div class="test <?php
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as count FROM admin_users");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            echo 'success">✅ Admin Users Table Exists<br>';
            echo 'Admin users in database: ' . $result['count'];
        } catch (Exception $e) {
            echo 'error">❌ Table Error: ' . htmlspecialchars($e->getMessage());
        }
    ?>
    </div>
    
    <h2>Test 4: API Endpoints</h2>
    <button onclick="testAuthCheck()">Test auth-check.php</button>
    <button onclick="testAuthLogin()">Test auth-login.php</button>
    <div id="apiResults"></div>
    
    <h2>Test 5: Current Session Info</h2>
    <div class="test">
        <pre><?php
        echo "Session Variables:\n";
        print_r($_SESSION);
        ?></pre>
    </div>
    
    <script>
    async function testAuthCheck() {
        const results = document.getElementById('apiResults');
        results.innerHTML = '<div class="test">Testing auth-check.php...</div>';
        
        try {
            const response = await fetch('/api/auth-check.php', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            
            results.innerHTML = `
                <div class="test success">
                    <strong>✅ auth-check.php Response:</strong>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                    <small>Status: ${response.status}</small>
                </div>
            `;
        } catch (error) {
            results.innerHTML = `
                <div class="test error">
                    <strong>❌ auth-check.php Error:</strong>
                    <pre>${error.message}</pre>
                </div>
            `;
        }
    }
    
    async function testAuthLogin() {
        const results = document.getElementById('apiResults');
        results.innerHTML = '<div class="test">Testing auth-login.php with test credentials...</div>';
        
        try {
            const response = await fetch('/api/auth-login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: 'test@test.com',
                    password: 'test123'
                })
            });
            const data = await response.json();
            
            results.innerHTML = `
                <div class="test ${data.success ? 'success' : 'error'}">
                    <strong>${data.success ? '✅' : '❌'} auth-login.php Response:</strong>
                    <pre>${JSON.stringify(data, null, 2)}</pre>
                    <small>Status: ${response.status}</small>
                    <small>Note: This is expected to fail with test credentials</small>
                </div>
            `;
        } catch (error) {
            results.innerHTML = `
                <div class="test error">
                    <strong>❌ auth-login.php Error:</strong>
                    <pre>${error.message}</pre>
                </div>
            `;
        }
    }
    </script>
    
    <hr style="margin: 30px 0;">
    <p><a href="/admin" style="color: #00aaff;">← Back to Admin Portal</a></p>
</body>
</html>

