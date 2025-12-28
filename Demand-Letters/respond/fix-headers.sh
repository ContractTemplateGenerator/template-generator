#!/bin/bash
# Script to update all respond pages to use shared header system
# Handles both inline headers AND pages with no header at all

RESPOND_DIR="/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Demand-Letters/respond"

find "$RESPOND_DIR" -name "*.html" -type f | while read file; do
    echo "Processing: $file"

    # Skip if already properly configured with site-header div
    if grep -q 'id="site-header"' "$file"; then
        echo "  Already using shared header, skipping"
        continue
    fi

    # Check if it has the old inline header (class="site-header")
    if grep -q 'class="site-header"' "$file"; then
        echo "  Found inline header, replacing..."

        perl -i -0pe '
            # Add shared styles after fonts if not present
            s|(<link href="https://fonts.googleapis.com/css2[^>]+>)|$1\n\n    <!-- Shared site-wide styles (includes header) -->\n    <link rel="stylesheet" href="/shared/styles.css">|s unless /shared\/styles\.css/;

            # Replace the entire inline header section with the placeholder
            s|<!-- UNIFIED SITE-WIDE MEGA-HEADER -->.*?</header>|<!-- SHARED SITE-WIDE HEADER (loaded dynamically) -->\n    <div id="site-header"></div>|s;

            # Also handle variant without the comment
            s|<header class="site-header">.*?</header>|<!-- SHARED SITE-WIDE HEADER (loaded dynamically) -->\n    <div id="site-header"></div>|s;

            # Add the loader script before closing body if not present
            s|(</body>)|    <!-- Shared header loader -->\n    <script src="/shared/header-loader.js"></script>\n\n$1|s unless /header-loader\.js/;
        ' "$file"

        echo "  Updated!"
    else
        # No inline header - add the shared header system
        echo "  No inline header found, adding shared header..."

        perl -i -0pe '
            # Add shared styles in head if not present
            s|(<link[^>]*fonts.googleapis.com[^>]*>)|$1\n\n    <!-- Shared site-wide styles (includes header) -->\n    <link rel="stylesheet" href="/shared/styles.css">|s unless /shared\/styles\.css/;

            # If no fonts link, add after meta viewport
            s|(<meta name="viewport"[^>]*>)|$1\n\n    <!-- Shared site-wide styles (includes header) -->\n    <link rel="stylesheet" href="/shared/styles.css">|s unless /shared\/styles\.css/;

            # Add site-header div right after body tag (before any content)
            s|(<body[^>]*>)|$1\n\n    <!-- SHARED SITE-WIDE HEADER (loaded dynamically) -->\n    <div id="site-header"></div>\n|s unless /id="site-header"/;

            # Add the loader script before closing body if not present
            s|(</body>)|    <!-- Shared header loader -->\n    <script src="/shared/header-loader.js"></script>\n\n$1|s unless /header-loader\.js/;
        ' "$file"

        echo "  Added shared header!"
    fi
done

echo ""
echo "Done! All respond pages now use the shared header system."
