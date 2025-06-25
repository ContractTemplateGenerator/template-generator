#!/bin/bash

# Word Add-in Installation Script
# This script helps install the Redline Processor add-in

echo "🚀 Word Redline Processor Add-in Installation"
echo "============================================="
echo ""

# Check if server is running
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server is running on http://localhost:3000"
else
    echo "❌ Server is not running. Starting server..."
    cd "$(dirname "$0")"
    node server.js &
    sleep 3
    if curl -s http://localhost:3000/health > /dev/null; then
        echo "✅ Server started successfully"
    else
        echo "❌ Failed to start server"
        exit 1
    fi
fi

echo ""
echo "📁 Add-in files location:"
echo "$(pwd)"
echo ""
echo "📋 Installation Instructions:"
echo ""
echo "METHOD 1 - Try First (Office 365/2019+):"
echo "1. Open Microsoft Word"
echo "2. Go to: Insert → My Add-ins → Upload My Add-in"
echo "3. Browse to: $(pwd)/manifest.xml"
echo "4. Click Upload"
echo ""
echo "METHOD 2 - If Method 1 doesn't work:"
echo "1. Open Word"
echo "2. File → Options → Trust Center → Trust Center Settings"
echo "3. Trusted Add-in Catalogs"
echo "4. Add URL: http://localhost:3000"
echo "5. Check 'Show in Menu'"
echo "6. Restart Word"
echo "7. Insert → My Add-ins → Shared Folder"
echo ""
echo "METHOD 3 - Developer Mode:"
echo "1. File → Options → Customize Ribbon"
echo "2. Check 'Developer' tab"
echo "3. Developer → Add-ins → Office Add-ins"
echo "4. Upload manifest.xml"
echo ""
echo "METHOD 4 - Word Online (Often easier):"
echo "1. Go to office.com"
echo "2. Open Word Online"
echo "3. Insert → Office Add-ins → Upload My Add-in"
echo "4. Upload manifest.xml"
echo ""
echo "🌐 Testing URLs:"
echo "Health Check: http://localhost:3000/health"
echo "Task Pane: http://localhost:3000/taskpane.html"
echo "Manifest: http://localhost:3000/manifest.xml"
echo ""
echo "✅ Installation script complete!"
echo ""
echo "💡 If you need help, run: open $(pwd)/INSTALL-GUIDE.md"