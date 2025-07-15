#!/bin/bash

# Build script for nuxt-cosmos-offlinesigners module

echo "🌌 Building Nuxt Cosmos Offline Signers module..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the module
echo "🔨 Building module..."
npm run prepack

# Check TypeScript types
echo "🔍 Checking TypeScript types..."
npm run test:types

# Run linting
echo "🧹 Running ESLint..."
npm run lint

echo "✅ Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Test the module with: npm run dev"
echo "2. Publish with: npm publish"
echo "3. Create a GitHub release"
