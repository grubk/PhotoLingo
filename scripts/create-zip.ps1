# PowerShell script to create zip archives from Tauri build artifacts
param()

Write-Host "Creating zip archives from Tauri build artifacts..." -ForegroundColor Green

# Define paths
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BundleDir = Join-Path $ProjectRoot "src-tauri\target\release\bundle"
$ExecutableDir = Join-Path $ProjectRoot "src-tauri\target\release"
$OutputDir = Join-Path $ProjectRoot "dist"

# Check if bundle directory exists
if (-not (Test-Path $BundleDir)) {
    Write-Host "Bundle directory not found: $BundleDir" -ForegroundColor Red
    Write-Host "Please run 'npm run tauri build' first." -ForegroundColor Yellow
    exit 1
}

# Create output directory if it doesn't exist
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    Write-Host "Created output directory: $OutputDir" -ForegroundColor Blue
}

# Get available bundle formats
$BundleFormats = Get-ChildItem -Path $BundleDir -Directory
Write-Host "Available bundle formats: $($BundleFormats.Name -join ', ')" -ForegroundColor Cyan

$ZipCount = 0

# Create zip files for each bundle format
foreach ($Format in $BundleFormats) {
    $FormatPath = $Format.FullName
    $ZipName = "photolingo-windows-$($Format.Name).zip"
    $ZipPath = Join-Path $OutputDir $ZipName
    
    Write-Host "Creating $ZipName..." -ForegroundColor Yellow
    
    try {
        # Remove existing zip if it exists
        if (Test-Path $ZipPath) {
            Remove-Item $ZipPath -Force
        }
        
        # Create zip archive
        Compress-Archive -Path "$FormatPath\*" -DestinationPath $ZipPath -CompressionLevel Optimal
        
        if (Test-Path $ZipPath) {
            $ZipCount++
            Write-Host "Created $ZipName" -ForegroundColor Green
        } else {
            Write-Host "Failed to create $ZipName" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error creating ${ZipName}: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Create portable executable zip
$ExecutableName = "app.exe"
$ExecutablePath = Join-Path $ExecutableDir $ExecutableName

if (Test-Path $ExecutablePath) {
    $PortableZipName = "photolingo-portable.zip"
    $PortableZipPath = Join-Path $OutputDir $PortableZipName
    
    Write-Host "Creating portable $PortableZipName..." -ForegroundColor Yellow
    
    try {
        # Remove existing zip if it exists
        if (Test-Path $PortableZipPath) {
            Remove-Item $PortableZipPath -Force
        }
        
        # Create zip with just the executable
        Compress-Archive -Path $ExecutablePath -DestinationPath $PortableZipPath -CompressionLevel Optimal
        
        if (Test-Path $PortableZipPath) {
            $ZipCount++
            Write-Host "Created $PortableZipName" -ForegroundColor Green
        } else {
            Write-Host "Failed to create $PortableZipName" -ForegroundColor Red
        }
    } catch {
        Write-Host "Error creating ${PortableZipName}: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "Executable not found: $ExecutablePath" -ForegroundColor Yellow
}

# Display results
Write-Host ""
Write-Host "Summary:" -ForegroundColor Magenta
Write-Host "  Output directory: $OutputDir" -ForegroundColor White
Write-Host "  Zip files created: $ZipCount" -ForegroundColor White

if ($ZipCount -gt 0) {
    Write-Host ""
    Write-Host "Created files:" -ForegroundColor Cyan
    Get-ChildItem -Path $OutputDir -Filter "*.zip" | ForEach-Object {
        $SizeKB = [math]::Round($_.Length / 1KB, 2)
        Write-Host "  $($_.Name) (${SizeKB} KB)" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "Zip files created successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "No zip files were created. Please check the build output." -ForegroundColor Red
    exit 1
}