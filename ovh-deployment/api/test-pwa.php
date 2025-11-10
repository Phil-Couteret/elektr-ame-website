<!DOCTYPE html>
<html>
<head>
    <title>PWA Diagnostic Test</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #1a1a2e; color: white; max-width: 1000px; margin: 0 auto; }
        .test { margin: 15px 0; padding: 15px; background: #16213e; border-radius: 5px; }
        .success { border-left: 4px solid #00ff00; }
        .error { border-left: 4px solid #ff0000; }
        .warning { border-left: 4px solid #ffaa00; }
        button { padding: 10px 20px; background: #0066ff; color: white; border: none; cursor: pointer; margin: 5px; border-radius: 4px; }
        button:hover { background: #0052cc; }
        pre { background: #0a0a0a; padding: 10px; overflow-x: auto; border-radius: 4px; }
        h1 { color: #00aaff; }
        h2 { color: #00ff88; margin-top: 30px; }
        .status { font-size: 24px; }
        code { background: #333; padding: 2px 6px; border-radius: 3px; }
    </style>
</head>
<body>
    <h1>🔍 PWA Diagnostic Tool</h1>
    
    <h2>Test 1: HTTPS Status</h2>
    <div class="test <?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? 'success' : 'error'; ?>">
        <strong class="status"><?php echo (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') ? '✅' : '❌'; ?> HTTPS</strong><br>
        Current protocol: <code><?php echo isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'HTTPS' : 'HTTP'; ?></code><br>
        <?php if (!(isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on')): ?>
            <br><strong style="color: #ff6666;">⚠️ PWA REQUIRES HTTPS!</strong><br>
            Without HTTPS, PWA features (service worker, install prompt) will NOT work.<br>
            Check: Is your SSL certificate installed and active on OVH?
        <?php endif; ?>
    </div>
    
    <h2>Test 2: Required PWA Files</h2>
    <div class="test">
        <?php
        $files = [
            '/index.html' => 'Main HTML file',
            '/manifest.json' => 'PWA Manifest',
            '/service-worker.js' => 'Service Worker',
            '/offline.html' => 'Offline fallback page',
            '/.htaccess' => 'Apache configuration'
        ];
        
        $allGood = true;
        foreach ($files as $file => $desc) {
            $path = $_SERVER['DOCUMENT_ROOT'] . $file;
            $exists = file_exists($path);
            if (!$exists) $allGood = false;
            echo $exists ? '✅' : '❌';
            echo " <strong>" . htmlspecialchars($file) . "</strong> - " . htmlspecialchars($desc);
            echo "<br>";
        }
        ?>
    </div>
    <script>
    // Update the test 2 div class based on results
    document.addEventListener('DOMContentLoaded', function() {
        const test2 = document.querySelectorAll('.test')[1];
        const hasError = test2.innerHTML.includes('❌');
        test2.classList.add(hasError ? 'error' : 'success');
    });
    </script>
    
    <h2>Test 3: PWA Icons</h2>
    <button onclick="testPWAIcons()">Check PWA Icons</button>
    <div id="iconResults"></div>
    
    <h2>Test 4: Service Worker Registration</h2>
    <button onclick="testServiceWorker()">Test Service Worker</button>
    <div id="swResults"></div>
    
    <h2>Test 5: Manifest File</h2>
    <button onclick="testManifest()">Check Manifest</button>
    <div id="manifestResults"></div>
    
    <h2>Test 6: Browser DevTools Check</h2>
    <div class="test warning">
        <strong>📱 Manual Check Required:</strong><br><br>
        1. Open DevTools (F12 or Right-click → Inspect)<br>
        2. Go to <strong>Application</strong> tab<br><br>
        
        <strong>Check Service Workers:</strong><br>
        - Left sidebar → Service Workers<br>
        - Should show: <code>service-worker.js</code> with status "activated"<br>
        - If not: Check Console for errors<br><br>
        
        <strong>Check Manifest:</strong><br>
        - Left sidebar → Manifest<br>
        - Should show: Name, icons, colors<br>
        - If not: Check Console for errors<br><br>
        
        <strong>Check Console:</strong><br>
        - Look for: <code>[PWA] Service Worker registered successfully</code><br>
        - If errors: Read the error messages carefully
    </div>
    
    <h2>Test 7: Install Criteria</h2>
    <div class="test">
        <strong>PWA Install Requirements:</strong><br><br>
        Required for "Add to Home Screen":<br>
        ✓ HTTPS (with valid SSL certificate)<br>
        ✓ manifest.json with required fields<br>
        ✓ Service worker registered<br>
        ✓ User visits site at least once<br>
        ✓ User engages for at least 30 seconds OR navigates<br><br>
        
        <strong>Current Issues Preventing Install:</strong>
        <ul id="installIssues">
            <li>Checking...</li>
        </ul>
    </div>
    
    <h2>Test 8: SSL Certificate Check</h2>
    <button onclick="checkSSL()">Check SSL Certificate</button>
    <div id="sslResults"></div>
    
    <script>
    async function testPWAIcons() {
        const results = document.getElementById('iconResults');
        results.innerHTML = '<div class="test">Checking PWA icons...</div>';
        
        const iconSizes = ['72x72', '96x96', '128x128', '144x144', '152x152', '192x192', '384x384', '512x512'];
        let html = '<div class="test">';
        let allGood = true;
        
        for (const size of iconSizes) {
            const url = `/pwa-icons/icon-${size}.png`;
            try {
                const response = await fetch(url, { method: 'HEAD' });
                const exists = response.ok;
                html += `${exists ? '✅' : '❌'} Icon ${size}: <code>${url}</code><br>`;
                if (!exists) allGood = false;
            } catch (e) {
                html += `❌ Icon ${size}: <code>${url}</code> (Error)<br>`;
                allGood = false;
            }
        }
        
        html += '</div>';
        results.innerHTML = html;
        results.querySelector('.test').classList.add(allGood ? 'success' : 'error');
    }
    
    async function testServiceWorker() {
        const results = document.getElementById('swResults');
        results.innerHTML = '<div class="test">Testing service worker...</div>';
        
        try {
            // Check if service worker is supported
            if (!('serviceWorker' in navigator)) {
                results.innerHTML = `
                    <div class="test error">
                        <strong>❌ Service Workers Not Supported</strong><br>
                        Your browser doesn't support service workers.<br>
                        Try: Chrome, Firefox, Safari, or Edge (latest versions)
                    </div>
                `;
                return;
            }
            
            // Check if service worker file exists
            const swResponse = await fetch('/service-worker.js');
            if (!swResponse.ok) {
                results.innerHTML = `
                    <div class="test error">
                        <strong>❌ Service Worker File Missing</strong><br>
                        <code>/service-worker.js</code> returned status: ${swResponse.status}<br>
                        Make sure you uploaded the service-worker.js file to the root directory.
                    </div>
                `;
                return;
            }
            
            // Try to register
            const registration = await navigator.serviceWorker.register('/service-worker.js');
            
            results.innerHTML = `
                <div class="test success">
                    <strong>✅ Service Worker Registered!</strong><br>
                    <pre>Scope: ${registration.scope}
State: ${registration.active ? registration.active.state : 'installing...'}
Installing: ${registration.installing ? 'Yes' : 'No'}
Waiting: ${registration.waiting ? 'Yes' : 'No'}
Active: ${registration.active ? 'Yes' : 'No'}</pre>
                    
                    <strong>Next:</strong> The service worker is working. Check if HTTPS is active!
                </div>
            `;
            
            checkInstallCriteria();
            
        } catch (error) {
            results.innerHTML = `
                <div class="test error">
                    <strong>❌ Service Worker Registration Failed</strong><br>
                    <pre>${error.message}</pre>
                    
                    <strong>Common causes:</strong><br>
                    • HTTPS not active (required for service workers)<br>
                    • File path incorrect<br>
                    • CORS or security errors
                </div>
            `;
        }
    }
    
    async function testManifest() {
        const results = document.getElementById('manifestResults');
        results.innerHTML = '<div class="test">Checking manifest...</div>';
        
        try {
            const response = await fetch('/manifest.json');
            if (!response.ok) {
                results.innerHTML = `
                    <div class="test error">
                        <strong>❌ Manifest File Missing</strong><br>
                        <code>/manifest.json</code> returned status: ${response.status}<br>
                        Make sure you uploaded manifest.json to the root directory.
                    </div>
                `;
                return;
            }
            
            const manifest = await response.json();
            
            results.innerHTML = `
                <div class="test success">
                    <strong>✅ Manifest Found!</strong><br>
                    <pre>${JSON.stringify(manifest, null, 2)}</pre>
                    
                    <strong>Required fields:</strong><br>
                    ${manifest.name ? '✅' : '❌'} name<br>
                    ${manifest.short_name ? '✅' : '❌'} short_name<br>
                    ${manifest.start_url ? '✅' : '❌'} start_url<br>
                    ${manifest.display ? '✅' : '❌'} display<br>
                    ${manifest.icons && manifest.icons.length > 0 ? '✅' : '❌'} icons (${manifest.icons ? manifest.icons.length : 0} found)
                </div>
            `;
            
        } catch (error) {
            results.innerHTML = `
                <div class="test error">
                    <strong>❌ Manifest Error</strong><br>
                    <pre>${error.message}</pre>
                </div>
            `;
        }
    }
    
    async function checkSSL() {
        const results = document.getElementById('sslResults');
        const protocol = window.location.protocol;
        
        if (protocol === 'https:') {
            results.innerHTML = `
                <div class="test success">
                    <strong>✅ SSL Active</strong><br>
                    Your site is using HTTPS: <code>${window.location.href}</code><br><br>
                    
                    <strong>To verify SSL certificate:</strong><br>
                    1. Click the padlock 🔒 in the address bar<br>
                    2. Check "Certificate is valid"<br>
                    3. Check it's issued by a trusted authority
                </div>
            `;
        } else {
            results.innerHTML = `
                <div class="test error">
                    <strong>❌ HTTPS Not Active!</strong><br>
                    Current URL: <code>${window.location.href}</code><br>
                    You're using HTTP, not HTTPS.<br><br>
                    
                    <strong>To fix:</strong><br>
                    1. In OVH control panel, enable SSL/HTTPS<br>
                    2. Make sure .htaccess redirect is active<br>
                    3. Visit: <a href="https://${window.location.host}" style="color: #00aaff;">https://${window.location.host}</a>
                </div>
            `;
        }
    }
    
    async function checkInstallCriteria() {
        const issues = [];
        const list = document.getElementById('installIssues');
        
        // Check HTTPS
        if (window.location.protocol !== 'https:') {
            issues.push('❌ HTTPS not active - <strong>THIS IS THE MAIN ISSUE!</strong>');
        }
        
        // Check service worker
        if ('serviceWorker' in navigator) {
            const registrations = await navigator.serviceWorker.getRegistrations();
            if (registrations.length === 0) {
                issues.push('❌ Service worker not registered');
            }
        } else {
            issues.push('❌ Service worker not supported by browser');
        }
        
        // Check manifest
        try {
            const manifestResponse = await fetch('/manifest.json');
            if (!manifestResponse.ok) {
                issues.push('❌ Manifest file missing');
            }
        } catch (e) {
            issues.push('❌ Cannot load manifest');
        }
        
        if (issues.length === 0) {
            list.innerHTML = '<li style="color: #00ff00;">✅ All requirements met!</li><li>Wait 5 seconds for install prompt to appear</li><li>Or check browser menu for "Install" option</li>';
        } else {
            list.innerHTML = issues.map(i => `<li>${i}</li>`).join('');
        }
    }
    
    // Auto-run checks
    window.addEventListener('load', function() {
        checkSSL();
        checkInstallCriteria();
    });
    </script>
    
    <hr style="margin: 40px 0; border-color: #333;">
    
    <h2>📋 Quick Checklist</h2>
    <div class="test">
        <strong>If PWA not working, check in this order:</strong><br><br>
        
        1. <strong>HTTPS Active?</strong> (Most common issue!)<br>
        &nbsp;&nbsp;&nbsp;→ Visit: <code>https://www.elektr-ame.com</code><br>
        &nbsp;&nbsp;&nbsp;→ Should see padlock 🔒 in address bar<br>
        &nbsp;&nbsp;&nbsp;→ If not: Check OVH SSL settings<br><br>
        
        2. <strong>Files Uploaded?</strong><br>
        &nbsp;&nbsp;&nbsp;→ manifest.json<br>
        &nbsp;&nbsp;&nbsp;→ service-worker.js<br>
        &nbsp;&nbsp;&nbsp;→ pwa-icons/ folder<br><br>
        
        3. <strong>Browser Cache Cleared?</strong><br>
        &nbsp;&nbsp;&nbsp;→ Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R)<br>
        &nbsp;&nbsp;&nbsp;→ Or test in incognito/private mode<br><br>
        
        4. <strong>DevTools Shows Errors?</strong><br>
        &nbsp;&nbsp;&nbsp;→ F12 → Console tab<br>
        &nbsp;&nbsp;&nbsp;→ Look for service worker or manifest errors<br>
    </div>
    
    <p><a href="/" style="color: #00aaff; font-size: 18px;">← Back to Home</a></p>
</body>
</html>

