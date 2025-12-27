#!/usr/bin/env python3
"""
MEGA-MENU UPDATER
=================
A comprehensive tool for updating mega-menu content across all HTML files.

Since each HTML file has its own embedded header (no shared template),
this script performs find-and-replace operations across all files.

Usage:
    python mega_menu_updater.py --analyze                    # Analyze current mega-menu
    python mega_menu_updater.py --preview PATTERN            # Preview files matching pattern
    python mega_menu_updater.py --update --dry-run          # Show what would change
    python mega_menu_updater.py --update                    # Apply changes
    python mega_menu_updater.py --add-california-footer     # Add California link to footer
    python mega_menu_updater.py --update-insurance-section  # Update Insurance section links
"""

import os
import re
import sys
import argparse
import shutil
from datetime import datetime
from pathlib import Path
from typing import List, Dict, Tuple, Optional

# Configuration
DEMAND_LETTERS_DIR = Path("/Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/Demand-Letters")

# ============================================================================
# MEGA-MENU PATTERNS AND REPLACEMENTS
# ============================================================================

# Current footer
CURRENT_FOOTER = '''                        <div class="mega-menu-footer">
                            <a href="/Demand-Letters/Insurance/">&#128737; Insurance</a>
                            <a href="/Demand-Letters/Platforms/">&#128241; Platforms</a>
                            <a href="/Demand-Letters/IP-Content/">&#127912; IP & Content</a>
                            <a href="/Demand-Letters/PI/">&#9878; Personal Injury</a>
                        </div>'''

# New footer with California
NEW_FOOTER_WITH_CALIFORNIA = '''                        <div class="mega-menu-footer">
                            <a href="/Demand-Letters/Insurance/">&#128737; Insurance</a>
                            <a href="/Demand-Letters/Platforms/">&#128241; Platforms</a>
                            <a href="/Demand-Letters/IP-Content/">&#127912; IP & Content</a>
                            <a href="/Demand-Letters/PI/">&#9878; Personal Injury</a>
                            <a href="/Demand-Letters/California/">&#127774; California</a>
                        </div>'''

# Current Insurance section
CURRENT_INSURANCE_SECTION = '''                            <div class="mega-menu-section">
                                <div class="mega-menu-section-title"><span class="icon">&#128737;</span> Insurance</div>
                                <ul class="mega-menu-links">
                                    <li><a href="/Demand-Letters/Insurance/bad-faith-claim-denial.html">Bad Faith Denial</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-bad-faith-insurance-demand.html">California Bad Faith</a></li>
                                    <li><a href="/Demand-Letters/Insurance/delayed-claim-payment.html">Delayed Payment</a></li>
                                </ul>
                                <div class="mega-menu-more"><a href="/Demand-Letters/Insurance/">+ 8 more</a></div>
                            </div>'''

# Updated Insurance section with more California links
NEW_INSURANCE_SECTION = '''                            <div class="mega-menu-section">
                                <div class="mega-menu-section-title"><span class="icon">&#128737;</span> Insurance</div>
                                <ul class="mega-menu-links">
                                    <li><a href="/Demand-Letters/Insurance/bad-faith-claim-denial.html">Bad Faith Denial</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-bad-faith-insurance-demand.html">CA Bad Faith</a></li>
                                    <li><a href="/Demand-Letters/Insurance/california-um-uim-denial-demand.html">CA UM/UIM</a></li>
                                </ul>
                                <div class="mega-menu-more"><a href="/Demand-Letters/Insurance/">+ 17 more</a></div>
                            </div>'''

# California pages by category (for reference and potential section additions)
CALIFORNIA_PAGES = {
    "Insurance": [
        ("california-bad-faith-insurance-demand.html", "Bad Faith"),
        ("california-um-uim-denial-demand.html", "UM/UIM Denial"),
        ("california-delayed-insurance-payment-demand.html", "Delayed Payment"),
        ("california-property-damage-claim-demand.html", "Property Damage"),
        ("california-claim-investigation-demand.html", "Claim Investigation"),
        ("california-first-party-property-demand.html", "First Party Property"),
        ("california-life-insurance-denial-demand.html", "Life Insurance"),
        ("california-policy-interpretation-demand.html", "Policy Interpretation"),
        ("california-reservation-of-rights-demand.html", "Reservation of Rights"),
        ("california-undervalued-claim-demand.html", "Undervalued Claim"),
    ],
    "Employment": [
        ("california-unpaid-wages-demand.html", "Unpaid Wages"),
        ("california-wrongful-termination-demand.html", "Wrongful Termination"),
        ("california-employment-discrimination-demand.html", "Discrimination"),
        ("california-workplace-harassment-demand.html", "Harassment"),
        ("california-personnel-file-wage-statement-requests.html", "Personnel Files"),
    ],
    "Business": [
        ("california-breach-of-contract-demand.html", "Breach of Contract"),
        ("california-unpaid-invoice-demand.html", "Unpaid Invoice"),
        ("california-partnership-dispute-demand.html", "Partnership Dispute"),
        ("california-nda-breach-demand.html", "NDA Breach"),
        ("california-non-compete-demand.html", "Non-Compete"),
        ("california-vendor-non-performance-demand.html", "Vendor Issues"),
        ("california-franchise-dispute-demand.html", "Franchise"),
        ("california-commercial-lease-breach-demand.html", "Commercial Lease"),
    ],
    "Landlord-Tenant": [
        ("california-security-deposit-demand.html", "Security Deposit"),
        ("california-habitability-demand.html", "Habitability"),
        ("california-illegal-eviction-demand.html", "Illegal Eviction"),
        ("california-rent-overcharge-demand.html", "Rent Overcharge"),
    ],
    "Personal Injury": [
        ("california-car-accident-demand.html", "Car Accident"),
        ("california-rear-end-collision-demand.html", "Rear-End"),
        ("california-pedestrian-accident-demand.html", "Pedestrian"),
        ("california-motorcycle-accident-demand.html", "Motorcycle"),
        ("california-bicycle-accident-demand.html", "Bicycle"),
        ("california-premises-liability-demand.html", "Premises Liability"),
        ("california-grocery-store-slip-fall-demand.html", "Slip & Fall"),
    ],
    "Consumer": [
        ("california-clra-30-day-demand-letters.html", "CLRA 30-Day"),
        ("california-defective-product-demand.html", "Defective Product"),
        ("california-refund-denial-demand.html", "Refund Denial"),
        ("california-auto-renewal-fraud-demand.html", "Auto-Renewal"),
    ],
    "Real Estate": [
        ("california-earnest-money-demand.html", "Earnest Money"),
        ("california-seller-nondisclosure-demand.html", "Nondisclosure"),
        ("california-hoa-dispute-demand.html", "HOA Dispute"),
        ("california-agent-negligence-demand.html", "Agent Negligence"),
    ],
}


def find_html_files(directory: Path) -> List[Path]:
    """Find all HTML files in directory and subdirectories."""
    return list(directory.rglob("*.html"))


def find_files_with_pattern(directory: Path, pattern: str) -> List[Path]:
    """Find files containing a specific pattern."""
    files = []
    for html_file in find_html_files(directory):
        try:
            content = html_file.read_text(encoding='utf-8')
            if pattern in content:
                files.append(html_file)
        except Exception as e:
            print(f"Error reading {html_file}: {e}")
    return files


def analyze_mega_menu(directory: Path) -> Dict:
    """Analyze mega-menu usage across all files."""
    stats = {
        "total_html_files": 0,
        "files_with_mega_menu": 0,
        "files_with_footer": 0,
        "files_without_mega_menu": [],
        "unique_footer_variations": set(),
    }

    all_files = find_html_files(directory)
    stats["total_html_files"] = len(all_files)

    for html_file in all_files:
        try:
            content = html_file.read_text(encoding='utf-8')

            if "mega-menu" in content:
                stats["files_with_mega_menu"] += 1
            else:
                stats["files_without_mega_menu"].append(html_file)

            if "mega-menu-footer" in content:
                stats["files_with_footer"] += 1

        except Exception as e:
            print(f"Error reading {html_file}: {e}")

    return stats


def replace_in_file(file_path: Path, old_text: str, new_text: str, dry_run: bool = True) -> bool:
    """Replace text in a file. Returns True if replacement was made."""
    try:
        content = file_path.read_text(encoding='utf-8')

        if old_text not in content:
            return False

        new_content = content.replace(old_text, new_text)

        if not dry_run:
            file_path.write_text(new_content, encoding='utf-8')

        return True
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False


def create_backup(directory: Path) -> Path:
    """Create a backup of all HTML files."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir = directory / f".mega-menu-backup-{timestamp}"

    for html_file in find_html_files(directory):
        rel_path = html_file.relative_to(directory)
        backup_path = backup_dir / rel_path
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(html_file, backup_path)

    return backup_dir


def add_california_footer(directory: Path, dry_run: bool = True) -> Tuple[int, int]:
    """Add California link to mega-menu footer."""
    updated = 0
    skipped = 0

    for html_file in find_html_files(directory):
        if replace_in_file(html_file, CURRENT_FOOTER, NEW_FOOTER_WITH_CALIFORNIA, dry_run):
            updated += 1
            action = "Would update" if dry_run else "Updated"
            print(f"  {action}: {html_file.relative_to(directory)}")
        else:
            skipped += 1

    return updated, skipped


def update_insurance_section(directory: Path, dry_run: bool = True) -> Tuple[int, int]:
    """Update the Insurance section with more California links."""
    updated = 0
    skipped = 0

    for html_file in find_html_files(directory):
        if replace_in_file(html_file, CURRENT_INSURANCE_SECTION, NEW_INSURANCE_SECTION, dry_run):
            updated += 1
            action = "Would update" if dry_run else "Updated"
            print(f"  {action}: {html_file.relative_to(directory)}")
        else:
            skipped += 1

    return updated, skipped


def print_california_pages_summary():
    """Print summary of all California pages by category."""
    print("\n" + "=" * 70)
    print("CALIFORNIA-SPECIFIC PAGES BY CATEGORY")
    print("=" * 70)

    total = 0
    for category, pages in CALIFORNIA_PAGES.items():
        print(f"\n{category} ({len(pages)} pages):")
        print("-" * 40)
        for filename, label in pages:
            print(f"  - {label}: {filename}")
        total += len(pages)

    print(f"\n{'=' * 70}")
    print(f"TOTAL CALIFORNIA PAGES: {total}")
    print("=" * 70)


def main():
    parser = argparse.ArgumentParser(description="Mega-Menu Updater for Demand Letters")
    parser.add_argument("--analyze", action="store_true", help="Analyze current mega-menu usage")
    parser.add_argument("--preview", type=str, help="Preview files containing pattern")
    parser.add_argument("--add-california-footer", action="store_true", help="Add California link to footer")
    parser.add_argument("--update-insurance-section", action="store_true", help="Update Insurance section")
    parser.add_argument("--list-california", action="store_true", help="List all California pages")
    parser.add_argument("--dry-run", action="store_true", help="Show changes without applying")
    parser.add_argument("--backup", action="store_true", help="Create backup before changes")

    args = parser.parse_args()

    if args.analyze:
        print("\nAnalyzing mega-menu usage...")
        print("=" * 50)
        stats = analyze_mega_menu(DEMAND_LETTERS_DIR)
        print(f"Total HTML files: {stats['total_html_files']}")
        print(f"Files with mega-menu: {stats['files_with_mega_menu']}")
        print(f"Files with mega-menu-footer: {stats['files_with_footer']}")
        if stats['files_without_mega_menu']:
            print(f"\nFiles WITHOUT mega-menu ({len(stats['files_without_mega_menu'])}):")
            for f in stats['files_without_mega_menu'][:10]:
                print(f"  - {f.relative_to(DEMAND_LETTERS_DIR)}")
            if len(stats['files_without_mega_menu']) > 10:
                print(f"  ... and {len(stats['files_without_mega_menu']) - 10} more")
        return

    if args.preview:
        print(f"\nFiles containing '{args.preview}':")
        print("=" * 50)
        files = find_files_with_pattern(DEMAND_LETTERS_DIR, args.preview)
        for f in files:
            print(f"  {f.relative_to(DEMAND_LETTERS_DIR)}")
        print(f"\nTotal: {len(files)} files")
        return

    if args.list_california:
        print_california_pages_summary()
        return

    if args.backup:
        print("\nCreating backup...")
        backup_dir = create_backup(DEMAND_LETTERS_DIR)
        print(f"Backup created at: {backup_dir}")
        return

    if args.add_california_footer:
        dry_run = args.dry_run
        mode = "DRY RUN - " if dry_run else ""
        print(f"\n{mode}Adding California link to mega-menu footer...")
        print("=" * 50)
        updated, skipped = add_california_footer(DEMAND_LETTERS_DIR, dry_run)
        print(f"\n{'Would update' if dry_run else 'Updated'}: {updated} files")
        print(f"Skipped (pattern not found): {skipped} files")

        if dry_run:
            print("\nRun without --dry-run to apply changes")
        return

    if args.update_insurance_section:
        dry_run = args.dry_run
        mode = "DRY RUN - " if dry_run else ""
        print(f"\n{mode}Updating Insurance section...")
        print("=" * 50)
        updated, skipped = update_insurance_section(DEMAND_LETTERS_DIR, dry_run)
        print(f"\n{'Would update' if dry_run else 'Updated'}: {updated} files")
        print(f"Skipped (pattern not found): {skipped} files")

        if dry_run:
            print("\nRun without --dry-run to apply changes")
        return

    # Default: show help
    parser.print_help()


if __name__ == "__main__":
    main()
