#!/usr/bin/env python3
"""Create a tracked-changes Word document directly from instruction blocks.

Workflow:
1. Read instructions (clipboard or file) in the same format as `doc_editor.py`.
2. Apply them to the original document, rewriting affected paragraphs with
   w:ins / w:del markup so Word displays full tracked changes.
3. Save to `{original}_redline.docx` (or a user-specified path).

Limitations: paragraph-level rewrite preserves text but not inline formatting.
For agreements with heavy styling, review the output and adjust formatting if
needed after accepting/rejecting the changes.
"""
from __future__ import annotations

import argparse
import os
import shutil
import sys
import tempfile
from datetime import datetime
from typing import List, Optional
from zipfile import ZipFile

from lxml import etree

import doc_editor  # reuse instruction parser and clipboard helper

W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
XML_NS = "http://www.w3.org/XML/1998/namespace"
NS = {"w": W_NS}


def paragraph_text(paragraph: etree._Element) -> str:
    texts = []
    for node in paragraph.xpath('.//w:t | .//w:delText', namespaces=NS):
        if node.text:
            texts.append(node.text)
    return "".join(texts)


def set_space(node: etree._Element, text: str) -> None:
    if text.startswith(" ") or text.endswith(" "):
        node.set(f"{{{XML_NS}}}space", "preserve")


def new_run(text: str) -> etree._Element:
    r = etree.Element(f"{{{W_NS}}}r")
    t = etree.SubElement(r, f"{{{W_NS}}}t")
    set_space(t, text)
    t.text = text
    return r


def new_change(tag: str, text: str, change_id: int, author: str, timestamp: str) -> etree._Element:
    change = etree.Element(
        f"{{{W_NS}}}{tag}",
        {
            f"{{{W_NS}}}id": str(change_id),
            f"{{{W_NS}}}author": author,
            f"{{{W_NS}}}date": timestamp,
        },
    )
    r = etree.SubElement(change, f"{{{W_NS}}}r")
    child_tag = "delText" if tag == "del" else "t"
    el = etree.SubElement(r, f"{{{W_NS}}}{child_tag}")
    set_space(el, text)
    el.text = text
    return change


def rewrite_paragraph(paragraph: etree._Element, parts: List[etree._Element]) -> None:
    for child in list(paragraph):
        paragraph.remove(child)
    paragraph.extend(parts)


def apply_replace(paragraph: etree._Element, target: str, replacement: str, change_id: int, author: str, timestamp: str) -> bool:
    text = paragraph_text(paragraph)
    idx = text.find(target)
    if idx == -1:
        return False
    before = text[:idx]
    after = text[idx + len(target) :]
    parts: List[etree._Element] = []
    if before:
        parts.append(new_run(before))
    parts.append(new_change("del", target, change_id, author, timestamp))
    if replacement:
        parts.append(new_change("ins", replacement, change_id + 1, author, timestamp))
    if after:
        parts.append(new_run(after))
    rewrite_paragraph(paragraph, parts)
    return True


def apply_delete(paragraph: etree._Element, target: str, change_id: int, author: str, timestamp: str) -> bool:
    return apply_replace(paragraph, target, "", change_id, author, timestamp)


def apply_insert(paragraph: etree._Element, anchor: str, new_text: str, change_id: int, author: str, timestamp: str, *, before: bool) -> bool:
    text = paragraph_text(paragraph)
    idx = text.find(anchor)
    if idx == -1:
        return False
    parts: List[etree._Element] = []
    if before:
        before_text = text[:idx]
        after_anchor = text[idx:]
        if before_text:
            parts.append(new_run(before_text))
        parts.append(new_change("ins", new_text, change_id, author, timestamp))
        if after_anchor:
            parts.append(new_run(after_anchor))
    else:
        before_anchor = text[: idx + len(anchor)]
        after_text = text[idx + len(anchor) :]
        if before_anchor:
            parts.append(new_run(before_anchor))
        parts.append(new_change("ins", new_text, change_id, author, timestamp))
        if after_text:
            parts.append(new_run(after_text))
    rewrite_paragraph(paragraph, parts)
    return True


def process_commands(tree: etree._ElementTree, commands: List[doc_editor.Command], author: str) -> List[str]:
    paragraphs = tree.findall(".//w:p", namespaces=NS)
    timestamp = datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    change_id = 1
    log: List[str] = []

    for command in commands:
        matched = False
        for paragraph in paragraphs:
            if command.action == "replace" and command.target and command.replacement is not None:
                matched = apply_replace(paragraph, command.target, command.replacement, change_id, author, timestamp)
            elif command.action in {"delete", "remove"} and command.target:
                matched = apply_delete(paragraph, command.target, change_id, author, timestamp)
            elif command.action == "insert_after" and command.anchor and command.text:
                matched = apply_insert(paragraph, command.anchor, command.text, change_id, author, timestamp, before=False)
            elif command.action == "insert_before" and command.anchor and command.text:
                matched = apply_insert(paragraph, command.anchor, command.text, change_id, author, timestamp, before=True)
            if matched:
                change_id += 2
                log.append(f"- {command.label()}: applied")
                break
        if not matched:
            log.append(f"- {command.label()}: target not found")
    return log


def build_redline(original: str, commands: List[doc_editor.Command], output: str, author: str) -> List[str]:
    with tempfile.TemporaryDirectory() as tmpdir:
        with ZipFile(original) as zf:
            zf.extractall(tmpdir)

        document_path = os.path.join(tmpdir, "word", "document.xml")
        tree = etree.parse(document_path)
        log = process_commands(tree, commands, author)
        tree.write(document_path, encoding="utf-8", xml_declaration=True)

        with ZipFile(original) as src, ZipFile(output, "w") as dst:
            for item in src.infolist():
                source_path = os.path.join(tmpdir, item.filename)
                if os.path.isdir(source_path):
                    dst.writestr(item, b"")
                else:
                    with open(source_path, "rb") as fh:
                        dst.writestr(item, fh.read())
    return log


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Apply instruction-driven edits and emit a tracked-changes .docx")
    parser.add_argument("document", help="Original Word document (.docx)")
    parser.add_argument("--output", help="Output path (default adds _redline.docx)")
    parser.add_argument("--instructions", help="Optional path to instruction text (defaults to clipboard)")
    parser.add_argument("--author", default="Redline Assistant", help="Author name to stamp on tracked changes")
    args = parser.parse_args(argv)

    doc_path = os.path.abspath(args.document)
    if not os.path.exists(doc_path):
        print(f"Document not found: {doc_path}", file=sys.stderr)
        return 1

    if args.instructions:
        with open(args.instructions, "r", encoding="utf-8") as fh:
            raw_instructions = fh.read()
    else:
        raw_instructions = doc_editor.read_clipboard()

    try:
        commands = doc_editor.parse_instructions(raw_instructions)
    except doc_editor.InstructionParseError as exc:
        print(f"Instruction error: {exc}", file=sys.stderr)
        return 1

    output_path = os.path.abspath(args.output) if args.output else os.path.splitext(doc_path)[0] + "_redline.docx"

    log = build_redline(doc_path, commands, output_path, args.author)
    for entry in log:
        print(entry)
    print(f"\nTracked document saved to {output_path}")
    print("Open in Word to review with full accept/reject controls.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
