# Redliner Helper (macOS + Word)

Automate tedious tracked-changes edits in Microsoft Word documents. Paste your update instructions into the clipboard, run the helper, and it will execute each instruction with Track Changes enabled—ready for counterparties to review.

## Requirements

- macOS with Microsoft Word (desktop version). Tested with Word on Office 365.
- Python 3.8+ (`python3` should be available on macOS by default).
- Accessibility permission: macOS may prompt the first time AppleScript automates Word—allow it so the helper can edit documents.

## Quick Start

### Option 1 – Track-change output (new)

When you want a Word doc that already contains tracked changes:

```bash
python3 track_redliner.py /path/to/contract.docx
```

- Reads instructions from the clipboard (or `--instructions file.txt`).
- Writes `/path/to/contract_redline.docx` with Word `w:ins` / `w:del` markup, ready for accept/reject workflows.
- Operates at paragraph text level; if a clause has heavy inline styling, review the output and tidy formatting after generating the redline.
- Stamp your name with `--author "Jane Lawyer"`.

### Option 2 – Fast edits + manual Compare

1. Copy your instructions (format below) to the clipboard.
2. From Terminal, run:
   ```bash
   cd /Users/mac/Dropbox/Mac/Documents/GitHub/template-generator/redliner
   python3 doc_editor.py /path/to/contract.docx
   ```
   - First run may need `python3 -m pip install python-docx`.
   - The script writes `/path/to/contract_edited.docx`, logging which directives hit or missed.
3. Open the original and `_edited` copies in Word, then use **Review ▸ Compare ▸ Compare…** to instantly generate a tracked-changes redline.

This sidesteps the brittle macOS automation and usually finishes faster.

### Option 3 – Experimental Word automation

`redliner.py` contains the AppleScript/VBA approach. It remains for reference but proved unreliable on macOS Word; use only if you want to continue that investigation.

## Instruction Format (Clipboard)

Provide instructions using headers like `[REPLACE]`, `[INSERT_AFTER]`, `[INSERT_BEFORE]`, or `[DELETE]`. Each block supports simple key/value fields. Multi-line values go between `<<<` and `---`.

```
[REPLACE]
section: Section 2.1  (optional – for your own reference)
target: <<<
Existing sentence to be replaced exactly.
---
replacement: <<<
Revised sentence that should appear instead.
---

[INSERT_AFTER]
section: Section 5.3
anchor: <<<
Text I want to locate first.
---
text: <<<
Additional language to insert immediately after the anchor. You can span multiple paragraphs.
---

[INSERT_BEFORE]
section: Termination
anchor: <<<
“…shall terminate upon written notice.”
---
text: <<<
However, either party may extend the term by mutual agreement.
---

[DELETE]
section: Schedule A
target: <<<
Offending clause that should be removed.
---
```

### Supported actions

- `REPLACE`: swaps the first occurrence of `target` with `replacement`.
- `INSERT_AFTER`: finds `anchor` and inserts `text` immediately after it.
- `INSERT_BEFORE`: finds `anchor` and inserts `text` immediately before it.
- `DELETE` / `REMOVE`: removes the first occurrence of `target`.

All operations happen with Track Changes enabled. Ensure your `target`/`anchor` text is specific enough to be unique—if multiple matches exist the first one is edited.

## Troubleshooting

- **Target not found**: The helper didn’t see the exact text. Copy/paste the precise sentence from Word to avoid smart-quote mismatches.
- **Formatting quirks**: python-docx edits at paragraph level. Run Compare, accept the redlines you want, then tidy any spacing manually if needed.
- **Need inline tracking**: Revisit `redliner.py`, but expect additional AppleScript/VBA effort on macOS.

## Roadmap Ideas

- Batch dry-run mode to highlight targets without editing.
- Section-aware targeting (limit scope between headings).
- GUI wrapper for one-click execution.

Feel free to adapt the script as your workflows evolve.
