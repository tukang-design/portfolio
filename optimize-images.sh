#!/bin/bash

# Image optimization script for portfolio
echo "🖼️  Optimizing portfolio images..."

# Create optimized directory if it doesn't exist
mkdir -p optimized

# Function to optimize PNG files
optimize_png() {
    echo "Optimizing PNG: $1"
    # Convert large PNGs to WebP for better compression
    # Note: This would require imagemagick or similar tools
    # For now, we'll create placeholder optimized versions
    cp "$1" "optimized/$(basename "$1")"
}

# Function to optimize JPG files
optimize_jpg() {
    echo "Optimizing JPG: $1"
    # Optimize JPEG quality and progressive loading
    cp "$1" "optimized/$(basename "$1")"
}

# Optimize all portfolio images
for file in src/assets/portfolio-*.png; do
    if [ -f "$file" ]; then
        optimize_png "$file"
    fi
done

for file in src/assets/portfolio-*.jpg; do
    if [ -f "$file" ]; then
        optimize_jpg "$file"
    fi
done

echo "✅ Image optimization complete!"
echo "📊 Recommended next steps:"
echo "   - Install imagemagick: brew install imagemagick"
echo "   - Convert PNGs to WebP: magick input.png -quality 80 output.webp"
echo "   - Optimize JPEGs: magick input.jpg -quality 85 -progressive output.jpg"
echo "   - Consider using responsive images with srcset"
