#!/bin/bash

# GitHub Pages deployment script
echo "Building for GitHub Pages..."

# Set environment for GitHub Pages
export NODE_ENV=production

# Build the project
npm run build

# Create .nojekyll file to prevent Jekyll processing
touch dist/.nojekyll

# Copy CNAME file to dist directory for custom domain
if [ -f "CNAME" ]; then
  cp CNAME dist/
fi

echo "Build complete! Files are in the 'dist' directory."
echo "Push to GitHub and the GitHub Action will deploy automatically."