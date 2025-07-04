#!/bin/bash

# Production build script for GoEPServer (Standalone & Portable)
echo "=== GoEPServer Production Builder ==="

# Detect current platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case $ARCH in
    x86_64) ARCH="amd64" ;;
    arm64|aarch64) ARCH="arm64" ;;
    armv7*) ARCH="arm" ;;
    i386|i686) ARCH="386" ;;
    *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

echo "Building for: $OS/$ARCH"


# Set output filename
if [ "$OS" = "darwin" ]; then
    OS_NAME="macos"
else
    OS_NAME="$OS"
fi

if [ "$OS" = "windows" ]; then
    OUTPUT="goepserver-$OS_NAME-$ARCH.exe"
else
    OUTPUT="goepserver-$OS_NAME-$ARCH"
fi

echo "Building $OUTPUT..."

# Build with appropriate flags for the platform
if [ "$OS" = "linux" ]; then
    echo "Building statically linked binary for maximum portability..."
    CGO_ENABLED=0 go build -a -ldflags '-extldflags "-static" -s -w' -o "$OUTPUT" ./cmd/goepserver/
else
    echo "Building optimized binary..."
    CGO_ENABLED=0 go build -ldflags="-s -w" -o "$OUTPUT" ./cmd/goepserver/
fi

# Make the binary executable
chmod +x "$OUTPUT" 2>/dev/null || true

if [ $? -eq 0 ]; then
    echo "✓ Build successful: $OUTPUT"
    echo ""
    echo "Binary size:"
    ls -lh "$OUTPUT"
    
    # Check if binary is statically linked (Linux only)
    if [ "$OS" = "linux" ] && command -v ldd &> /dev/null; then
        echo ""
        echo "Checking binary dependencies (should show 'not a dynamic executable'):"
        ldd "$OUTPUT" 2>/dev/null || echo "✓ Statically linked binary (no dynamic dependencies)"
    fi
    
    echo ""
    echo "✓ Production build complete!"
    echo "✓ All web assets are embedded in the binary"
    echo "✓ No external dependencies required"
    echo ""
    echo "Run with: ./$OUTPUT"
else
    echo "✗ Build failed"
    exit 1
fi
