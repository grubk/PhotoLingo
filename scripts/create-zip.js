const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the platform
const platform = process.platform;

// Define the bundle directory based on platform
let bundleDir, outputName;

if (platform === 'win32') {
    bundleDir = path.join(__dirname, '..', 'src-tauri', 'target', 'release', 'bundle');
    outputName = 'photolingo-windows';
} else if (platform === 'darwin') {
    bundleDir = path.join(__dirname, '..', 'src-tauri', 'target', 'release', 'bundle');
    outputName = 'photolingo-macos';
} else {
    bundleDir = path.join(__dirname, '..', 'src-tauri', 'target', 'release', 'bundle');
    outputName = 'photolingo-linux';
}

// Function to create zip files
function createZipFiles() {
    console.log('Creating zip archives from Tauri build artifacts...');
    
    if (!fs.existsSync(bundleDir)) {
        console.error('Bundle directory not found:', bundleDir);
        return;
    }

    const outputDir = path.join(__dirname, '..', 'dist');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
        // Check what bundle formats were created
        const bundleContents = fs.readdirSync(bundleDir);
        console.log('Available bundle formats:', bundleContents);

        // Create zip files for different bundle types
        bundleContents.forEach(formatDir => {
            const formatPath = path.join(bundleDir, formatDir);
            
            if (fs.statSync(formatPath).isDirectory()) {
                const zipName = `${outputName}-${formatDir}.zip`;
                const zipPath = path.join(outputDir, zipName);
                
                console.log(`Creating ${zipName}...`);
                
                if (platform === 'win32') {
                    // Use PowerShell on Windows
                    execSync(`powershell -Command "Compress-Archive -Path '${formatPath}\\*' -DestinationPath '${zipPath}' -Force"`, { stdio: 'inherit' });
                } else {
                    // Use zip command on Unix-like systems
                    execSync(`cd "${formatPath}" && zip -r "${zipPath}" .`, { stdio: 'inherit' });
                }
                
                console.log(`✅ Created ${zipName}`);
            }
        });

        // Also create a zip of the main executable if it exists
        const executablePath = path.join(__dirname, '..', 'src-tauri', 'target', 'release');
        const executableName = platform === 'win32' ? 'app.exe' : 'app';
        const executableFile = path.join(executablePath, executableName);
        
        if (fs.existsSync(executableFile)) {
            const execZipName = `${outputName}-portable.zip`;
            const execZipPath = path.join(outputDir, execZipName);
            
            console.log(`Creating portable ${execZipName}...`);
            
            if (platform === 'win32') {
                execSync(`powershell -Command "Compress-Archive -Path '${executableFile}' -DestinationPath '${execZipPath}' -Force"`, { stdio: 'inherit' });
            } else {
                execSync(`cd "${executablePath}" && zip "${execZipPath}" "${executableName}"`, { stdio: 'inherit' });
            }
            
            console.log(`✅ Created ${execZipName}`);
        }

        console.log(`\n🎉 Zip files created successfully in: ${outputDir}`);
        
    } catch (error) {
        console.error('Error creating zip files:', error.message);
        process.exit(1);
    }
}

// Run the function
createZipFiles();
