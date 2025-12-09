import { Client } from 'basic-ftp';
import { readFileSync, existsSync, statSync } from 'fs';
import { join, dirname, relative } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
function loadEnv() {
    const envPath = join(__dirname, '.env');
    if (!existsSync(envPath)) {
        throw new Error('.env file not found');
    }
    
    const envContent = readFileSync(envPath, 'utf-8');
    const env = {};
    
    envContent.split('\n').forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('#')) {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
                env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
            }
        }
    });
    
    return env;
}

// Upload a single file
async function uploadFile(client, localPath, remotePath) {
    try {
        console.log(`Uploading: ${localPath} -> ${remotePath}`);
        await client.uploadFrom(localPath, remotePath);
        console.log(`✅ Uploaded: ${remotePath}`);
    } catch (error) {
        console.error(`❌ Failed to upload ${remotePath}:`, error.message);
        throw error;
    }
}

// Upload a directory recursively
async function uploadDirectory(client, localDir, remoteDir) {
    const fs = await import('fs/promises');
    const entries = await fs.readdir(localDir, { withFileTypes: true });
    
    // Ensure remote directory exists
    await client.ensureDir(remoteDir);
    await client.cd(remoteDir);
    
    for (const entry of entries) {
        const localPath = join(localDir, entry.name);
        const remotePath = entry.name;
        
        if (entry.isDirectory()) {
            await uploadDirectory(client, localPath, remotePath);
            await client.cd('..');
        } else {
            await uploadFile(client, localPath, remotePath);
        }
    }
}

// Delete old hashed files
async function deleteOldHashedFiles(client, directory) {
    try {
        await client.cd(directory);
        const files = await client.list();
        
        const oldJsFiles = files.filter(f => 
            f.name.startsWith('index-') && f.name.endsWith('.js')
        );
        const oldCssFiles = files.filter(f => 
            f.name.startsWith('index-') && f.name.endsWith('.css')
        );
        
        for (const file of [...oldJsFiles, ...oldCssFiles]) {
            try {
                await client.remove(file.name);
                console.log(`🗑️  Deleted old file: ${file.name}`);
            } catch (error) {
                console.warn(`⚠️  Could not delete ${file.name}:`, error.message);
            }
        }
    } catch (error) {
        console.warn(`⚠️  Could not clean old files in ${directory}:`, error.message);
    }
}

async function deploy() {
    const client = new Client();
    client.ftp.verbose = true;
    
    try {
        // Load environment variables
        console.log('📋 Loading FTP credentials from .env...');
        const env = loadEnv();
        
        const FTP_HOST = env.FTP_HOST || process.env.FTP_HOST;
        const FTP_USER = env.FTP_USER || process.env.FTP_USER;
        const FTP_PASSWORD = env.FTP_PASSWORD || process.env.FTP_PASSWORD;
        
        if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
            throw new Error('Missing FTP credentials in .env file. Required: FTP_HOST, FTP_USER, FTP_PASSWORD');
        }
        
        // Connect to FTP server
        console.log(`🔌 Connecting to ${FTP_HOST}...`);
        await client.access({
            host: FTP_HOST,
            user: FTP_USER,
            password: FTP_PASSWORD,
            secure: false
        });
        
        // Check current directory
        const startPwd = await client.pwd();
        console.log(`📍 Starting directory: ${startPwd}`);
        
        // Navigate to public_html/app
        console.log('📂 Navigating to /public_html/app...');
        
        // Try to navigate to public_html
        try {
            await client.cd('public_html');
            console.log(`✅ Entered public_html: ${await client.pwd()}`);
        } catch (error) {
            throw new Error(`Failed to navigate to public_html. Current directory: ${await client.pwd()}`);
        }
        
        // Navigate to app directory
        try {
            await client.cd('app');
            console.log(`✅ Entered app directory: ${await client.pwd()}`);
        } catch (error) {
            // If app doesn't exist, create it
            console.log('📁 Creating app directory...');
            await client.ensureDir('app');
            await client.cd('app');
            console.log(`✅ Created and entered app directory: ${await client.pwd()}`);
        }
        
        const finalPwd = await client.pwd();
        console.log(`📍 Final working directory: ${finalPwd}`);
        
        // Check if dist directory exists
        const distPath = join(__dirname, 'dist');
        if (!existsSync(distPath)) {
            throw new Error('dist directory not found. Please run "npm run build" first.');
        }
        
        // Delete old hashed files in assets directory
        console.log('🧹 Cleaning old hashed files...');
        try {
            await client.cd('assets');
            await deleteOldHashedFiles(client, 'assets');
            await client.cd('..');
        } catch (error) {
            console.log('ℹ️  Assets directory does not exist yet, will be created');
        }
        
        // Upload files from dist
        console.log('📤 Uploading files from dist/...');
        const fs = await import('fs/promises');
        const entries = await fs.readdir(distPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const localPath = join(distPath, entry.name);
            const remotePath = entry.name;
            
            if (entry.isDirectory()) {
                // For directories (like assets), upload recursively
                console.log(`📁 Uploading directory: ${entry.name}`);
                await client.ensureDir(remotePath);
                await client.cd(remotePath);
                
                const subEntries = await fs.readdir(localPath, { withFileTypes: true });
                for (const subEntry of subEntries) {
                    const subLocalPath = join(localPath, subEntry.name);
                    const subRemotePath = subEntry.name;
                    
                    if (subEntry.isDirectory()) {
                        await uploadDirectory(client, subLocalPath, subRemotePath);
                    } else {
                        await uploadFile(client, subLocalPath, subRemotePath);
                    }
                }
                
                await client.cd('..');
            } else {
                // For root files (index.html, etc.), upload directly
                await uploadFile(client, localPath, remotePath);
            }
        }
        
        console.log('\n✅ Deployment completed successfully!');
        console.log('🌐 Files are now live at: /public_html/app/');
        console.log('💡 Clear browser cache (Cmd+Shift+R) to see changes');
        
    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        process.exit(1);
    } finally {
        client.close();
    }
}

deploy();

