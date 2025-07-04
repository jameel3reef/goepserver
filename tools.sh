#!/bin/bash
mkdir -p "$HOME/goepserver"

echo "Cloning LinWinTools..."

# Clone LinWinTools repository to a temporary location
git clone https://github.com/jameel3reef/LinWinTools /tmp/LinWinTools

# Create subdirectories if they don't exist
mkdir -p "$HOME/goepserver/windows/attacking"
mkdir -p "$HOME/goepserver/windows/enumeration"
mkdir -p "$HOME/goepserver/linux/attacking"
mkdir -p "$HOME/goepserver/linux/enumeration"

# Copy files without overwriting existing ones
echo "Copying Windows attacking tools..."
cp /tmp/LinWinTools/windows/attacking/* "$HOME/goepserver/windows/attacking/" 2>/dev/null || true

echo "Copying Windows enumeration tools..."
cp /tmp/LinWinTools/windows/enumeration/* "$HOME/goepserver/windows/enumeration/" 2>/dev/null || true

echo "Copying Linux attacking tools..."
cp /tmp/LinWinTools/linux/attacking/* "$HOME/goepserver/linux/attacking/" 2>/dev/null || true

echo "Copying Linux enumeration tools..."
cp /tmp/LinWinTools/linux/enumeration/* "$HOME/goepserver/linux/enumeration/" 2>/dev/null || true

# Clean up temporary directory
rm -rf /tmp/LinWinTools

echo "LinWinTools successfully integrated into goepserver!"