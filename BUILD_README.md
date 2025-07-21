# Building PhotoLingo with Zip Archives

This document explains how to build PhotoLingo with zip file generation for distribution.

## Quick Start

To build the app and automatically create zip archives:

```bash
npm run tauri:build-zip
```

This command will:
1. Build the Next.js frontend
2. Build the Tauri app with all bundle formats
3. Create zip archives for distribution

## Available Commands

- `npm run tauri:build` - Build the app without zip creation
- `npm run tauri:build-zip` - Build the app and create zip files
- `npm run create-zip` - Create zip files from existing build artifacts

## Output Files

After running `npm run tauri:build-zip`, you'll find the following files in the `dist/` directory:

### Windows
- `photolingo-windows-msi.zip` - MSI installer package
- `photolingo-windows-nsis.zip` - NSIS installer package  
- `photolingo-portable.zip` - Standalone executable (no installation required)

### macOS (when building on macOS)
- `photolingo-macos-dmg.zip` - DMG disk image
- `photolingo-macos-app.zip` - App bundle
- `photolingo-portable.zip` - Standalone executable

### Linux (when building on Linux)
- `photolingo-linux-deb.zip` - Debian package
- `photolingo-linux-rpm.zip` - RPM package
- `photolingo-portable.zip` - Standalone executable

## Distribution Recommendations

- **Windows Users**: Distribute `photolingo-windows-msi.zip` for easy installation
- **Portable Use**: Use `photolingo-portable.zip` for users who don't want to install
- **Advanced Users**: Provide multiple formats so users can choose their preferred installation method

## Manual Zip Creation

If you need to create zip files from an existing build:

1. First, build the app:
   ```bash
   npm run tauri:build
   ```

2. Then create the zip files:
   ```bash
   npm run create-zip
   ```

## Customization

To customize the zip creation process, edit the `scripts/create-zip.ps1` file. You can:
- Change the naming convention for zip files
- Add additional files to the archives
- Modify the compression settings
- Add version numbers to file names

## Troubleshooting

If zip creation fails:
1. Ensure the Tauri build completed successfully
2. Check that PowerShell execution policy allows script execution
3. Verify that the `src-tauri/target/release/bundle` directory exists
4. Run `npm run tauri:build` first if you only ran `npm run create-zip`

## File Sizes

The generated zip files will vary in size:
- Portable executable: ~15-30 MB (just the .exe file)
- Installer packages: ~20-40 MB (includes installer logic)
- Full bundles: May be larger depending on included assets and dependencies
