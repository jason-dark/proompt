#!/bin/bash

# Proompt CLI Build Script
# Compiles TypeScript and copies prompt templates to dist directory

set -e  # Exit on any error

echo "🔨 Building Proompt CLI..."

# Run linting
echo "🔍 Running linter..."
npm run lint

# Run formatter
echo "🔍 Running formatter..."
npm run format

# Clean dist directory
if [ -d "dist" ]; then
    echo "🧹 Cleaning dist directory..."
    rm -rf dist
fi

# Compile TypeScript
echo "📦 Compiling TypeScript..."
tsc

# Copy prompt templates
echo "📄 Copying prompt templates..."
find src/commands -name 'proompt.md' -exec sh -c '
    cmd_dir=$(basename $(dirname $1))
    target_dir="dist/commands/$cmd_dir"
    mkdir -p "$target_dir"
    cp "$1" "$target_dir/"
    echo "  Copied: $1 → $target_dir/proompt.md"
' sh {} \;

# Make CLI executable
echo "🔧 Setting executable permissions..."
chmod +x dist/index.js

echo "✅ Build complete!"