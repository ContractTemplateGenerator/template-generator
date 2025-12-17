#!/usr/bin/env python3
"""
Generate a signed version of the Word document with signature embedded.
Uses Pillow to create the signature image.
"""

import subprocess
import sys
from pathlib import Path
from datetime import datetime
import io

# Install dependencies if needed
try:
    from docx import Document
    from docx.shared import Inches, Pt
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'python-docx', '--user'])
    from docx import Document
    from docx.shared import Inches, Pt

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    subprocess.check_call([sys.executable, '-m', 'pip', 'install', 'pillow', '--user'])
    from PIL import Image, ImageDraw, ImageFont

# Paths
WORKROOM_DIR = Path(__file__).parent
PNG_PATH = WORKROOM_DIR / 'signature.png'
ORIGINAL_DOC = WORKROOM_DIR / 'Demand Letter - Shaw v Sunnova - Rescission.docx'
SIGNED_DOC = WORKROOM_DIR / 'Demand Letter - Shaw v Sunnova - Rescission - SIGNED.docx'

def create_signature_image():
    """Create a handwritten-style signature image using Pillow."""
    print("Creating signature image...")

    # Create image with white background
    width, height = 400, 100
    img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)

    # Try to use a script font, fall back to default
    font_size = 38
    try:
        # Try macOS fonts
        for font_path in [
            '/System/Library/Fonts/Supplemental/Brush Script.ttf',
            '/System/Library/Fonts/Supplemental/Bradley Hand Bold.ttf',
            '/System/Library/Fonts/Supplemental/Snell Roundhand.ttf',
            '/Library/Fonts/Brush Script.ttf',
        ]:
            if Path(font_path).exists():
                font = ImageFont.truetype(font_path, font_size)
                break
        else:
            font = ImageFont.load_default()
    except Exception:
        font = ImageFont.load_default()

    # Draw signature text with dark blue ink color
    ink_color = (26, 54, 93, 230)  # #1a365d with some transparency

    # Draw the signature with Esq.
    draw.text((20, 20), "/s/ Sergei Tokmakov, Esq.", fill=ink_color, font=font)

    # Add a flourish underline
    draw.line([(15, 70), (380, 70)], fill=(26, 54, 93, 150), width=2)

    # Save as PNG
    img.save(str(PNG_PATH), 'PNG')
    print(f"Created: {PNG_PATH}")

def create_signed_document():
    """Create signed version of the Word document."""
    print(f"Opening: {ORIGINAL_DOC}")
    doc = Document(ORIGINAL_DOC)

    # Find "Sincerely," and insert signature after it
    for i, para in enumerate(doc.paragraphs):
        if 'Sincerely,' in para.text:
            # Find the next paragraph(s) after "Sincerely,"
            # We need to find where to insert the signature
            for j in range(i + 1, min(i + 5, len(doc.paragraphs))):
                next_para = doc.paragraphs[j]
                text = next_para.text.strip()

                # Look for empty paragraph or signature line placeholder
                if text == '' or text.startswith('____') or text.startswith('['):
                    # Clear and add signature
                    next_para.clear()

                    # Add signature image
                    run = next_para.add_run()
                    run.add_picture(str(PNG_PATH), width=Inches(2.8))

                    # Add timestamp on new line
                    timestamp = datetime.now().strftime('%B %d, %Y at %I:%M %p')
                    ts_para = next_para.insert_paragraph_before('')
                    ts_run = ts_para.add_run()
                    ts_run.add_picture(str(PNG_PATH), width=Inches(2.8))

                    # Actually, let's just replace this paragraph
                    next_para.clear()
                    run = next_para.add_run()
                    run.add_picture(str(PNG_PATH), width=Inches(2.8))
                    next_para.add_run(f'\nElectronically signed {timestamp}').font.size = Pt(8)
                    next_para.runs[-1].font.italic = True

                    print("Signature inserted!")
                    break

                # If we hit the name line, insert signature before it
                if 'Sergei Tokmakov' in text:
                    # Insert a new paragraph before this one with the signature
                    new_para = next_para.insert_paragraph_before('')
                    run = new_para.add_run()
                    run.add_picture(str(PNG_PATH), width=Inches(2.8))

                    timestamp = datetime.now().strftime('%B %d, %Y at %I:%M %p')
                    new_para.add_run(f'\nElectronically signed {timestamp}').font.size = Pt(8)
                    new_para.runs[-1].font.italic = True

                    print("Signature inserted before name!")
                    break
            break

    # Save the signed document
    doc.save(SIGNED_DOC)
    print(f"Saved signed document: {SIGNED_DOC}")

def main():
    """Main function."""
    print("=" * 50)
    print("Generating Signed Word Document")
    print("=" * 50)

    # Check if original document exists
    if not ORIGINAL_DOC.exists():
        print(f"ERROR: Original document not found: {ORIGINAL_DOC}")
        sys.exit(1)

    # Create signature image
    create_signature_image()

    # Create signed document
    create_signed_document()

    print("\nDone!")

if __name__ == '__main__':
    main()
