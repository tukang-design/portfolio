#!/bin/bash

# Performance Analysis Script for Tukang Design Portfolio
echo "🚀 Performance Analysis Report"
echo "=============================="

# File sizes analysis
echo "📊 File Size Analysis:"
echo "----------------------"
echo "HTML: $(wc -c < index.html) bytes"
echo "CSS Main: $(wc -c < css/main.css) bytes"
echo "CSS Critical: $(wc -c < css/critical.css) bytes"
echo "CSS Responsive: $(wc -c < css/responsive.css) bytes"
echo "JS Main: $(wc -c < js/main.js) bytes"
echo "JS Contact: $(wc -c < js/contact.js) bytes"
echo "JS Portfolio: $(wc -c < js/portfolio.js) bytes"
echo ""

# Image analysis
echo "🖼️  Image Analysis:"
echo "-------------------"
echo "Logo: $(ls -la logo.png | awk '{print $5}') bytes"
echo "Portfolio Images:"
for file in src/assets/portfolio-*.{png,jpg}; do
    if [ -f "$file" ]; then
        echo "  $(basename "$file"): $(ls -la "$file" | awk '{print $5}') bytes"
    fi
done
echo ""

# Total bundle size
echo "📦 Total Bundle Analysis:"
echo "------------------------"
CSS_SIZE=$(find css -name "*.css" -exec wc -c {} + | tail -1 | awk '{print $1}')
JS_SIZE=$(find js -name "*.js" -exec wc -c {} + | tail -1 | awk '{print $1}')
IMG_SIZE=$(find . -name "*.png" -o -name "*.jpg" | xargs ls -la | awk '{sum += $5} END {print sum}')

echo "Total CSS: $CSS_SIZE bytes"
echo "Total JS: $JS_SIZE bytes"
echo "Total Images: $IMG_SIZE bytes"
echo "HTML: $(wc -c < index.html) bytes"

TOTAL=$((CSS_SIZE + JS_SIZE + IMG_SIZE + $(wc -c < index.html)))
echo "Total Bundle: $TOTAL bytes ($(echo "scale=2; $TOTAL/1024" | bc)KB)"
echo ""

# Performance recommendations
echo "⚡ Performance Optimizations Applied:"
echo "------------------------------------"
echo "✅ Critical CSS inlined"
echo "✅ Non-critical CSS loaded asynchronously"
echo "✅ JavaScript deferred"
echo "✅ Images optimized with lazy loading"
echo "✅ Service Worker for caching"
echo "✅ PWA manifest added"
echo "✅ Preload hints for critical resources"
echo "✅ Performance monitoring in place"
echo ""

echo "🎯 Performance Targets:"
echo "----------------------"
echo "• First Contentful Paint: < 1.5s"
echo "• Largest Contentful Paint: < 2.5s"
echo "• Time to Interactive: < 3.5s"
echo "• Cumulative Layout Shift: < 0.1"
echo "• Total Bundle Size: < 500KB"
echo ""

echo "📈 Next Steps for Further Optimization:"
echo "-------------------------------------"
echo "1. Install and run: npm install -g lighthouse"
echo "2. Test with: lighthouse http://localhost:8080 --view"
echo "3. Consider WebP image format conversion"
echo "4. Implement CSS/JS minification in build process"
echo "5. Add Content Security Policy headers"
echo "6. Enable Gzip compression on server"
echo "7. Consider HTTP/2 server push"
