@echo off
setlocal enabledelayedexpansion

:: Cross-platform build script for GoEPServer (Windows Batch Version)
echo === GoEPServer Cross-Platform Builder ===
echo.
echo Select platforms to build:
echo 1) Linux (amd64)
echo 2) Linux (arm64)
echo 3) Windows (amd64)
echo 4) macOS (amd64)
echo 5) macOS (arm64)
echo 6) All platforms
echo.
set /p "choice=Enter your choice [1-6]: "

if not exist dist mkdir dist

goto choice_%choice%

:choice_1
call :build_linux_amd64
goto end

:choice_2
call :build_linux_arm64
goto end

:choice_3
call :build_windows_amd64
goto end

:choice_4
call :build_macos_amd64
goto end

:choice_5
call :build_macos_arm64
goto end

:choice_6
call :build_all
goto end

:build_linux_amd64
echo Building for Linux (amd64)...
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=amd64
go build -a -ldflags "-extldflags \"-static\" -s -w" -o dist/goepserver-linux-amd64 ./cmd/goepserver/
if %errorlevel% equ 0 (
    echo ✓ Linux (amd64) build successful
) else (
    echo ✗ Linux (amd64) build failed
)
goto :eof

:build_linux_arm64
echo Building for Linux (arm64)...
set CGO_ENABLED=0
set GOOS=linux
set GOARCH=arm64
go build -a -ldflags "-extldflags \"-static\" -s -w" -o dist/goepserver-linux-arm64 ./cmd/goepserver/
if %errorlevel% equ 0 (
    echo ✓ Linux (arm64) build successful
) else (
    echo ✗ Linux (arm64) build failed
)
goto :eof

:build_windows_amd64
echo Building for Windows (amd64)...
set CGO_ENABLED=0
set GOOS=windows
set GOARCH=amd64
go build -ldflags="-s -w" -o dist/goepserver-windows-amd64.exe ./cmd/goepserver/
if %errorlevel% equ 0 (
    echo ✓ Windows (amd64) build successful
) else (
    echo ✗ Windows (amd64) build failed
)
goto :eof

:build_macos_amd64
echo Building for macOS (amd64)...
set CGO_ENABLED=0
set GOOS=darwin
set GOARCH=amd64
go build -ldflags="-s -w" -o dist/goepserver-darwin-amd64 ./cmd/goepserver/
if %errorlevel% equ 0 (
    echo ✓ macOS (amd64) build successful
) else (
    echo ✗ macOS (amd64) build failed
)
goto :eof

:build_macos_arm64
echo Building for macOS (arm64)...
set CGO_ENABLED=0
set GOOS=darwin
set GOARCH=arm64
go build -ldflags="-s -w" -o dist/goepserver-darwin-arm64 ./cmd/goepserver/
if %errorlevel% equ 0 (
    echo ✓ macOS (arm64) build successful
) else (
    echo ✗ macOS (arm64) build failed
)
goto :eof

:build_all
echo Building for all platforms...
call :build_linux_amd64
call :build_linux_arm64
call :build_windows_amd64
call :build_macos_amd64
call :build_macos_arm64
goto :eof

:end
echo.
echo === Build Summary ===
if exist dist (
    echo Built binaries:
    dir dist /b
    echo.
    echo All binaries are standalone with embedded web assets and no external dependencies!
    echo.
    echo Usage examples:
    if exist "dist\goepserver-linux-amd64" echo   Linux (amd64):   ./dist/goepserver-linux-amd64
    if exist "dist\goepserver-linux-arm64" echo   Linux (arm64):   ./dist/goepserver-linux-arm64
    if exist "dist\goepserver-windows-amd64.exe" echo   Windows (amd64): dist\goepserver-windows-amd64.exe
    if exist "dist\goepserver-darwin-amd64" echo   macOS (amd64):   ./dist/goepserver-darwin-amd64
    if exist "dist\goepserver-darwin-arm64" echo   macOS (arm64):   ./dist/goepserver-darwin-arm64
) else (
    echo No binaries were built successfully.
)

echo.
pause

:invalid_choice
echo Invalid choice: %choice%
goto end
