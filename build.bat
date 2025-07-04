@echo off
setlocal

:: Simple build script for Windows
echo === GoEPServer Windows Builder ===
echo Building for Windows (amd64)...

:: Create necessary directories
if not exist uploads mkdir uploads
if not exist tools mkdir tools
if not exist tools\linux mkdir tools\linux
if not exist tools\windows mkdir tools\windows
if not exist tools\linux\enumeration mkdir tools\linux\enumeration
if not exist tools\linux\attacking mkdir tools\linux\attacking
if not exist tools\windows\enumeration mkdir tools\windows\enumeration
if not exist tools\windows\attacking mkdir tools\windows\attacking

:: Build the binary
echo Building optimized Windows binary...
set CGO_ENABLED=0
set GOOS=windows
set GOARCH=amd64
go build -ldflags="-s -w" -o goepserver-windows-amd64.exe ./cmd/goepserver/

if %errorlevel% equ 0 (
    echo ✓ Build successful: goepserver-windows-amd64.exe
    echo.
    
    :: Show binary size
    for %%I in (goepserver-windows-amd64.exe) do echo Binary size: %%~zI bytes
    
    echo.
    echo ✓ Production build complete!
    echo ✓ All web assets are embedded in the binary
    echo ✓ No external dependencies required
    echo.
    echo Run with: goepserver-windows-amd64.exe
) else (
    echo ✗ Build failed
    exit /b 1
)

pause
