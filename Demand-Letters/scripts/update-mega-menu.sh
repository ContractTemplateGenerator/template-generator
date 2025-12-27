#!/bin/bash

# ============================================================================
# MEGA-MENU UPDATE SCRIPT
# ============================================================================
# This script updates the mega-menu across all HTML files in Demand-Letters
#
# IMPORTANT: Each HTML file has its own embedded header/mega-menu (no shared file)
# This means updates must be applied to ALL HTML files
#
# Usage:
#   1. First, do a dry run to see what files would be affected:
#      ./update-mega-menu.sh --dry-run
#
#   2. Create backup before running:
#      ./update-mega-menu.sh --backup
#
#   3. Run the actual update:
#      ./update-mega-menu.sh --execute
# ============================================================================

DEMAND_LETTERS_DIR="/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Demand-Letters"
BACKUP_DIR="$DEMAND_LETTERS_DIR/.mega-menu-backup-$(date +%Y%m%d_%H%M%S)"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# CURRENT MEGA-MENU FOOTER (to find/replace)
# ============================================================================
read -r -d '' OLD_FOOTER << 'OLDEOF'
                        <div class="mega-menu-footer">
                            <a href="/Demand-Letters/Insurance/">&#128737; Insurance</a>
                            <a href="/Demand-Letters/Platforms/">&#128241; Platforms</a>
                            <a href="/Demand-Letters/IP-Content/">&#127912; IP & Content</a>
                            <a href="/Demand-Letters/PI/">&#9878; Personal Injury</a>
                        </div>
OLDEOF

# ============================================================================
# NEW MEGA-MENU FOOTER (with California added)
# ============================================================================
read -r -d '' NEW_FOOTER << 'NEWEOF'
                        <div class="mega-menu-footer">
                            <a href="/Demand-Letters/Insurance/">&#128737; Insurance</a>
                            <a href="/Demand-Letters/Platforms/">&#128241; Platforms</a>
                            <a href="/Demand-Letters/IP-Content/">&#127912; IP & Content</a>
                            <a href="/Demand-Letters/PI/">&#9878; Personal Injury</a>
                            <a href="/Demand-Letters/California/">&#127774; California</a>
                        </div>
NEWEOF

# ============================================================================
# ALTERNATIVE: Replace Insurance section to add more California links
# ============================================================================
read -r -d '' OLD_INSURANCE_SECTION << 'OLDEOF'
                            <div class="mega-menu-section">
                                <div class="mega-menu-section-title"><span class="icon">&#128737;</span> Insurance</div>
                                <ul class="mega-menu-links">
                                    <li><a href="/Demand-Letters/Insurance/bad-faith-claim-denial.html">Bad Faith Denial</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-bad-faith-insurance-demand.html">California Bad Faith</a></li>
                                    <li><a href="/Demand-Letters/Insurance/delayed-claim-payment.html">Delayed Payment</a></li>
                                </ul>
                                <div class="mega-menu-more"><a href="/Demand-Letters/Insurance/">+ 8 more</a></div>
                            </div>
OLDEOF

read -r -d '' NEW_INSURANCE_SECTION << 'NEWEOF'
                            <div class="mega-menu-section">
                                <div class="mega-menu-section-title"><span class="icon">&#128737;</span> Insurance</div>
                                <ul class="mega-menu-links">
                                    <li><a href="/Demand-Letters/Insurance/bad-faith-claim-denial.html">Bad Faith Denial</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-bad-faith-insurance-demand.html">CA Bad Faith</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-um-uim-denial-demand.html">CA UM/UIM Claims</a></li>
                                </ul>
                                <div class="mega-menu-more"><a href="/Demand-Letters/Insurance/">+ 17 more</a></div>
                            </div>
NEWEOF

# ============================================================================
# FUNCTIONS
# ============================================================================

count_files() {
    find "$DEMAND_LETTERS_DIR" -name "*.html" -type f | wc -l
}

list_files_with_megamenu() {
    grep -l "mega-menu-footer" "$DEMAND_LETTERS_DIR"/**/*.html 2>/dev/null || \
    find "$DEMAND_LETTERS_DIR" -name "*.html" -type f -exec grep -l "mega-menu-footer" {} \;
}

dry_run() {
    echo -e "${YELLOW}DRY RUN - No changes will be made${NC}"
    echo ""
    echo "Files that contain mega-menu-footer (would be updated):"
    echo "======================================================="

    count=0
    while IFS= read -r file; do
        echo "  $file"
        ((count++))
    done < <(list_files_with_megamenu)

    echo ""
    echo -e "${GREEN}Total files that would be updated: $count${NC}"
    echo ""
    echo "Current footer pattern being searched:"
    echo "---------------------------------------"
    echo "$OLD_FOOTER"
    echo ""
    echo "Would be replaced with:"
    echo "-----------------------"
    echo "$NEW_FOOTER"
}

create_backup() {
    echo -e "${YELLOW}Creating backup...${NC}"
    mkdir -p "$BACKUP_DIR"

    while IFS= read -r file; do
        # Create subdirectory structure in backup
        rel_path="${file#$DEMAND_LETTERS_DIR/}"
        backup_file="$BACKUP_DIR/$rel_path"
        mkdir -p "$(dirname "$backup_file")"
        cp "$file" "$backup_file"
    done < <(list_files_with_megamenu)

    echo -e "${GREEN}Backup created at: $BACKUP_DIR${NC}"
}

execute_update() {
    echo -e "${YELLOW}Executing mega-menu update...${NC}"
    echo ""

    count=0
    errors=0

    while IFS= read -r file; do
        # Use perl for multi-line replacement (more reliable than sed)
        if perl -i -0pe "s|\Q$OLD_FOOTER\E|$NEW_FOOTER|g" "$file" 2>/dev/null; then
            echo -e "${GREEN}Updated:${NC} $file"
            ((count++))
        else
            echo -e "${RED}Error updating:${NC} $file"
            ((errors++))
        fi
    done < <(list_files_with_megamenu)

    echo ""
    echo "======================================================="
    echo -e "${GREEN}Successfully updated: $count files${NC}"
    if [ $errors -gt 0 ]; then
        echo -e "${RED}Errors: $errors files${NC}"
    fi
}

show_usage() {
    echo "Mega-Menu Update Script"
    echo "======================="
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  --dry-run    Show what files would be updated (no changes)"
    echo "  --backup     Create backup of all files before updating"
    echo "  --execute    Actually perform the update"
    echo "  --count      Count files with mega-menu"
    echo "  --help       Show this help message"
    echo ""
    echo "Recommended workflow:"
    echo "  1. $0 --dry-run"
    echo "  2. $0 --backup"
    echo "  3. $0 --execute"
}

# ============================================================================
# MAIN
# ============================================================================

case "$1" in
    --dry-run)
        dry_run
        ;;
    --backup)
        create_backup
        ;;
    --execute)
        execute_update
        ;;
    --count)
        echo "Total HTML files: $(count_files)"
        echo "Files with mega-menu: $(list_files_with_megamenu | wc -l)"
        ;;
    --help|*)
        show_usage
        ;;
esac
