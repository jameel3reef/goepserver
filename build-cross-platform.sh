#!/bin/bash

# Cross-platform build script for GoEPServer
echo "=== GoEPServer Cross-Platform Builder ==="
echo ""
echo "Select platforms to build (separate multiple choices with spaces):"
echo "1) Linux (amd64)"
echo "2) Linux (arm64)"
echo "3) Windows (amd64)"
echo "4) macOS (amd64)"
echo "5) macOS (arm64)"
echo "6) All platforms"
echo ""
read -p "Enter your choice(s) [1-6]: " -a choices

mkdir -p dist

build_linux_amd64() {
    echo "Building for Linux (amd64)..."
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -ldflags '-extldflags "-static" -s -w' -o dist/goepserver-linux-amd64 ./cmd/goepserver/
    if [ $? -eq 0 ]; then
        chmod +x dist/goepserver-linux-amd64
        echo "✓ Linux (amd64) build successful"
    else
        echo "✗ Linux (amd64) build failed"
    fi
}

build_linux_arm64() {
    echo "Building for Linux (arm64)..."
    CGO_ENABLED=0 GOOS=linux GOARCH=arm64 go build -a -ldflags '-extldflags "-static" -s -w' -o dist/goepserver-linux-arm64 ./cmd/goepserver/
    if [ $? -eq 0 ]; then
        chmod +x dist/goepserver-linux-arm64
        echo "✓ Linux (arm64) build successful"
    else
        echo "✗ Linux (arm64) build failed"
    fi
}

build_windows_amd64() {
    echo "Building for Windows (amd64)..."
    CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build -ldflags="-s -w" -o dist/goepserver-windows-amd64.exe ./cmd/goepserver/
    if [ $? -eq 0 ]; then
        echo "✓ Windows (amd64) build successful"
    else
        echo "✗ Windows (amd64) build failed"
    fi
}

build_macos_amd64() {
    echo "Building for macOS (amd64)..."
    CGO_ENABLED=0 GOOS=darwin GOARCH=amd64 go build -ldflags="-s -w" -o dist/goepserver-darwin-amd64 ./cmd/goepserver/
    if [ $? -eq 0 ]; then
        chmod +x dist/goepserver-darwin-amd64
        echo "✓ macOS (amd64) build successful"
    else
        echo "✗ macOS (amd64) build failed"
    fi
}

build_macos_arm64() {
    echo "Building for macOS (arm64)..."
    CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build -ldflags="-s -w" -o dist/goepserver-darwin-arm64 ./cmd/goepserver/
    if [ $? -eq 0 ]; then
        chmod +x dist/goepserver-darwin-arm64
        echo "✓ macOS (arm64) build successful"
    else
        echo "✗ macOS (arm64) build failed"
    fi
}

build_all() {
    echo "Building for all platforms..."
    build_linux_amd64
    build_linux_arm64
    build_windows_amd64
    build_macos_amd64
    build_macos_arm64
}

# Process user choices
for choice in "${choices[@]}"; do
    case $choice in
        1) build_linux_amd64 ;;
        2) build_linux_arm64 ;;
        3) build_windows_amd64 ;;
        4) build_macos_amd64 ;;
        5) build_macos_arm64 ;;
        6) build_all ;;
        *) echo "Invalid choice: $choice" ;;
    esac
done

echo ""
echo "=== Build Summary ==="
if [ -d "dist" ] && [ "$(ls -A dist)" ]; then
    echo "Built binaries:"
    ls -lh dist/
    echo ""
    echo "All binaries are standalone with embedded web assets and no external dependencies!"
    echo ""
    echo "Usage examples:"
    [ -f "dist/goepserver-linux-amd64" ] && echo "  Linux (amd64):   ./dist/goepserver-linux-amd64"
    [ -f "dist/goepserver-linux-arm64" ] && echo "  Linux (arm64):   ./dist/goepserver-linux-arm64"
    [ -f "dist/goepserver-windows-amd64.exe" ] && echo "  Windows (amd64): ./dist/goepserver-windows-amd64.exe"
    [ -f "dist/goepserver-darwin-amd64" ] && echo "  macOS (amd64):   ./dist/goepserver-darwin-amd64"
    [ -f "dist/goepserver-darwin-arm64" ] && echo "  macOS (arm64):   ./dist/goepserver-darwin-arm64"
else
    echo "No binaries were built successfully."
fi
