#!/usr/bin/env python3
"""Generate a tracked-changes Word document by comparing two .docx files.

This script opens the original and revised copies in Word via AppleScript and
runs the built-in Compare command (CompareTarget:=wdCompareTargetNew) so the
resulting document contains tracked changes ready for review.
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from typing import List, Optional
import tempfile


def vb_string_literal(value: str) -> str:
    escaped = value.replace("\"", '""')
    return f'"{escaped}"'


def applescript_string_literal(value: str) -> str:
    return '"' + value.replace('"', '\\"') + '"'


def posix_to_hfs(path: str) -> str:
    escaped = path.replace('"', '\\"')
    proc = subprocess.run(
        ["osascript", "-e", f'POSIX file "{escaped}" as text'],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        raise RuntimeError(f"Failed to convert path '{path}' to HFS format")
    return proc.stdout.strip()


def build_vb_lines(original: str, revised: str, output: str, flag_path: str) -> List[str]:
    original_hfs = posix_to_hfs(original)
    revised_hfs = posix_to_hfs(revised)
    output_hfs = posix_to_hfs(output)
    flag_hfs = posix_to_hfs(flag_path)
    return [
        "Dim originalPath As String",
        f"originalPath = {vb_string_literal(original_hfs)}",
        "Dim revisedPath As String",
        f"revisedPath = {vb_string_literal(revised_hfs)}",
        "Dim outputPath As String",
        f"outputPath = {vb_string_literal(output_hfs)}",
        "Dim flagPath As String",
        f"flagPath = {vb_string_literal(flag_hfs)}",
        "Dim docOriginal As Document",
        "Dim docRevised As Document",
        "Dim compareDoc As Document",
        "Dim revisedName As String",
        "Application.DisplayAlerts = 0",
        "Set docOriginal = Documents.Open(FileName:=originalPath, ReadOnly:=True, AddToRecentFiles:=False)",
        "Set docRevised = Documents.Open(FileName:=revisedPath, ReadOnly:=True, AddToRecentFiles:=False)",
        "revisedName = docRevised.FullName",
        "Set compareDoc = docOriginal.Compare(Name:=revisedName, AuthorName:=\"Redline Draft\", CompareTarget:=2, DetectFormatChanges:=False, IgnoreAllComparisonWarnings:=True, AddToRecentFiles:=False)",
        "compareDoc.SaveAs FileName:=outputPath, FileFormat:=12, AddToRecentFiles:=False",
        "compareDoc.Activate",
        "docOriginal.Close SaveChanges:=False",
        "docRevised.Close SaveChanges:=False",
        "Dim ff As Integer",
        "ff = FreeFile",
        "Open flagPath For Output As #ff",
        "Print #ff, \"OK\"",
        "Close #ff",
        "Application.DisplayAlerts = -1",
    ]


def run_compare(original: str, revised: str, output: str) -> None:
    with tempfile.NamedTemporaryFile("w", delete=False) as flag_file:
        flag_path = flag_file.name
    vb_lines = build_vb_lines(original, revised, output, flag_path)
    lines_literal = ", ".join(applescript_string_literal(line) for line in vb_lines)
    script = f"""tell application \"Microsoft Word\"
    activate
    set vbLines to {{{lines_literal}}}
    set AppleScript's text item delimiters to return
    set vbCode to vbLines as text
    set AppleScript's text item delimiters to \"\"
    do script vbCode
end tell"""
    completed = subprocess.run(
        ["osascript", "-"],
        input=script,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        raise RuntimeError(completed.stderr.strip() or "AppleScript failed")
    try:
        with open(flag_path, "r", encoding="utf-8") as fh:
            if "OK" not in fh.read():
                raise RuntimeError("Comparison macro completed without confirmation")
    except FileNotFoundError:
        raise RuntimeError("Comparison macro did not produce confirmation flag")
    finally:
        try:
            os.remove(flag_path)
        except OSError:
            pass


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Create a tracked-changes document by comparing original and revised copies in Word.")
    parser.add_argument("original", help="Path to the original .docx")
    parser.add_argument("revised", help="Path to the revised .docx")
    parser.add_argument("--output", help="Path for the comparison result (default adds _redline)")
    args = parser.parse_args(argv)

    original = os.path.abspath(args.original)
    revised = os.path.abspath(args.revised)
    for path in (original, revised):
        if not os.path.exists(path):
            print(f"File not found: {path}", file=sys.stderr)
            return 1

    output = os.path.abspath(args.output) if args.output else os.path.splitext(original)[0] + "_redline.docx"

    try:
        run_compare(original, revised, output)
    except RuntimeError as exc:
        print(f"Compare failed: {exc}", file=sys.stderr)
        return 1

    print(f"Tracked comparison saved to {output}\nOpen in Word to review/forward with full redlines.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
