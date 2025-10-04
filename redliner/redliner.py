#!/usr/bin/env python3
"""Redliner helper for Microsoft Word on macOS.

Reads structured instructions from the clipboard and applies them to the
specified Word document using Track Changes via AppleScript + VBA.
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
import tempfile
from dataclasses import dataclass
from typing import List, Optional


@dataclass
class Command:
    index: int
    action: str
    section: Optional[str]
    anchor: Optional[str]
    target: Optional[str]
    replacement: Optional[str]
    text: Optional[str]

    def label(self) -> str:
        bits = [f"#{self.index}", self.action.upper()]
        if self.section:
            bits.append(f"[{self.section}]")
        return " ".join(bits)


INSTRUCTION_HEADER = re.compile(r"^\s*\[(?P<action>[A-Za-z_\- ]+)\]\s*$")
FIELD_PATTERN = re.compile(r"^\s*([A-Za-z_ ]+):\s*(.*)\s*$")


class InstructionParseError(Exception):
    pass


def read_clipboard() -> str:
    try:
        result = subprocess.run(["pbpaste"], check=True, capture_output=True, text=True)
    except FileNotFoundError as exc:  # pragma: no cover - pbpaste always present on macOS
        raise RuntimeError("pbpaste command not found; clipboard access unavailable.") from exc
    return result.stdout.strip()


def parse_instructions(raw: str) -> List[Command]:
    commands: List[Command] = []
    current: Optional[dict] = None
    waiting_field: Optional[str] = None
    buffer: List[str] = []
    lines = raw.splitlines()

    def flush_buffer() -> str:
        nonlocal buffer
        text = "\n".join(buffer).strip()
        buffer = []
        return text

    def finalize_current():
        nonlocal current
        if current is None:
            return
        action = current.get("action")
        if not action:
            raise InstructionParseError("Instruction missing action header like [REPLACE].")
        action_key = action.strip().lower().replace(" ", "_")
        cmd = Command(
            index=len(commands) + 1,
            action=action_key,
            section=current.get("section"),
            anchor=current.get("anchor"),
            target=current.get("target"),
            replacement=current.get("replacement"),
            text=current.get("text"),
        )
        commands.append(cmd)
        current = None

    for line in lines + ["---END---"]:
        header_match = INSTRUCTION_HEADER.match(line)
        if header_match:
            finalize_current()
            current = {"action": header_match.group("action")}
            waiting_field = None
            buffer = []
            continue
        if line.strip() == "---" and waiting_field:
            # End of multi-line block
            current[waiting_field] = flush_buffer()
            waiting_field = None
            continue
        if line == "---END---":
            if waiting_field:
                current[waiting_field] = flush_buffer()
                waiting_field = None
            finalize_current()
            continue
        if waiting_field:
            buffer.append(line)
            continue
        field_match = FIELD_PATTERN.match(line)
        if field_match:
            field = field_match.group(1).strip().lower().replace(" ", "_")
            value = field_match.group(2).strip()
            if value == "<<<":
                waiting_field = field
                buffer = []
            else:
                if current is None:
                    raise InstructionParseError(f"Field '{field}' found before any instruction header.")
                current[field] = value
            continue
        if line.strip() == "":
            continue
        raise InstructionParseError(f"Unrecognized line: '{line}'")

    if not commands:
        raise InstructionParseError("No instructions found. Ensure you use [ACTION] headers.")
    return commands


def vb_string_literal(text: str) -> str:
    if text is None:
        return '""'
    parts = text.splitlines()
    if not parts:
        return '""'
    escaped_parts = [p.replace('"', '""') for p in parts]
    joined = '""'.join(escaped_parts)  # temporary placeholder
    # Build VB string with vbCrLf between lines
    vb_segments = []
    for idx, part in enumerate(escaped_parts):
        segment = f'"{part}"'
        if idx > 0:
            segment = 'vbCrLf & ' + segment
        vb_segments.append(segment)
    expression = ' & '.join(vb_segments)
    return expression or '""'


def applescript_string_literal(text: str) -> str:
    return '"' + text.replace('"', '\\"') + '"'


def build_vb_code(command: Command) -> List[str]:
    lines: List[str] = [
        "Dim doc As Document",
        "Set doc = ActiveDocument",
        "Dim rng As Range",
        "Set rng = doc.Content",
        "Dim resultValue As String",
        "resultValue = \"NOT_FOUND\"",
    ]

    if command.action == "replace":
        if not command.target or command.replacement is None:
            raise InstructionParseError(f"{command.label()} requires TARGET and REPLACEMENT blocks.")
        lines.extend([
            "With rng.Find",
            "    .ClearFormatting",
            "    .Replacement.ClearFormatting",
            f"    .Text = {vb_string_literal(command.target)}",
            f"    .Replacement.Text = {vb_string_literal(command.replacement)}",
            "    .Forward = True",
            "    .Wrap = 0",
            "    .MatchCase = False",
            "    .MatchWholeWord = False",
            "    .MatchWildcards = False",
            "    If .Execute(Replace:=1) Then",
            "        resultValue = \"OK\"",
            "    End If",
            "End With",
        ])
    elif command.action == "insert_after":
        if not command.anchor or command.text is None:
            raise InstructionParseError(f"{command.label()} requires ANCHOR and TEXT blocks.")
        lines.extend([
            "With rng.Find",
            "    .ClearFormatting",
            f"    .Text = {vb_string_literal(command.anchor)}",
            "    .Forward = True",
            "    .Wrap = 0",
            "    .MatchCase = False",
            "    .MatchWholeWord = False",
            "    .MatchWildcards = False",
            "    If .Execute Then",
            "        rng.Collapse Direction:=wdCollapseEnd",
            f"        rng.InsertAfter {vb_string_literal(command.text)}",
            "        resultValue = \"OK\"",
            "    End If",
            "End With",
        ])
    elif command.action == "insert_before":
        if not command.anchor or command.text is None:
            raise InstructionParseError(f"{command.label()} requires ANCHOR and TEXT blocks.")
        lines.extend([
            "With rng.Find",
            "    .ClearFormatting",
            f"    .Text = {vb_string_literal(command.anchor)}",
            "    .Forward = True",
            "    .Wrap = 0",
            "    .MatchCase = False",
            "    .MatchWholeWord = False",
            "    .MatchWildcards = False",
            "    If .Execute Then",
            "        rng.Collapse Direction:=wdCollapseStart",
            f"        rng.InsertBefore {vb_string_literal(command.text)}",
            "        resultValue = \"OK\"",
            "    End If",
            "End With",
        ])
    elif command.action in {"delete", "remove"}:
        if not command.target:
            raise InstructionParseError(f"{command.label()} requires TARGET block.")
        lines.extend([
            "With rng.Find",
            "    .ClearFormatting",
            "    .Replacement.ClearFormatting",
            f"    .Text = {vb_string_literal(command.target)}",
            "    .Replacement.Text = \"\"",
            "    .Forward = True",
            "    .Wrap = 0",
            "    .MatchCase = False",
            "    .MatchWholeWord = False",
            "    .MatchWildcards = False",
            "    If .Execute(Replace:=1) Then",
            "        resultValue = \"OK\"",
            "    End If",
            "End With",
        ])
    else:
        raise InstructionParseError(f"Unsupported action: {command.action}")

    lines.extend([
        "On Error Resume Next",
        "doc.Variables(\"REDLINER_RESULT\").Value = resultValue",
        "If Err.Number <> 0 Then",
        "    Err.Clear",
        "    doc.Variables.Add Name:=\"REDLINER_RESULT\", Value:=resultValue",
        "End If",
        "On Error GoTo 0",
    ])
    return lines


def run_command(doc_path: str, vb_lines: List[str]) -> str:
    with tempfile.NamedTemporaryFile("w", delete=False) as tmp:
        result_path = tmp.name
    escaped_path = result_path.replace("\\", "\\\\").replace("\"", "\\\"")
    convert_script = f'POSIX file "{escaped_path}" as text'
    convert = subprocess.run(
        ["osascript", "-e", convert_script],
        capture_output=True,
        text=True,
    )
    if convert.returncode != 0:
        hfs_path = result_path
    else:
        hfs_path = convert.stdout.strip()
    vb_lines = list(vb_lines) + [
        "Dim fnum As Integer",
        "fnum = FreeFile",
        f"Open \"{hfs_path}\" For Output As #fnum",
        "Print #fnum, resultValue",
        "Close #fnum",
    ]
    lines_literal = ", ".join(applescript_string_literal(line) for line in vb_lines)
    script = f"""on run {{docPath}}
    set docPathText to docPath as text
    set AppleScript's text item delimiters to "/"
    set pathItems to text items of docPathText
    set targetName to last item of pathItems
    set AppleScript's text item delimiters to ""
    tell application "Microsoft Word"
        activate
        set docRef to missing value
        repeat with d in documents
            try
                if (name of d) is targetName then
                    set docRef to d
                    exit repeat
                end if
            end try
        end repeat
        if docRef is missing value then
            set docRef to open file name docPathText
        end if
        set track revisions of docRef to true
        set active document to docRef
        set vbLines to {{{lines_literal}}}
        set AppleScript's text item delimiters to return
        set vbCode to vbLines as text
        set AppleScript's text item delimiters to ""
        do script vbCode
        return ""
    end tell
end run"""
    completed = subprocess.run(
        ["osascript", "-", doc_path],
        input=script,
        text=True,
        capture_output=True,
    )
    if completed.returncode != 0:
        stderr = completed.stderr.strip()
        raise RuntimeError(f"AppleScript failed: {stderr or 'Unknown error'}")
    try:
        with open(result_path, "r", encoding="utf-8") as fh:
            result_value = fh.read().strip()
    except FileNotFoundError:
        result_value = ""
    finally:
        try:
            os.remove(result_path)
        except OSError:
            pass
    return result_value or completed.stdout.strip()


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Apply tracked changes to a Word document using clipboard instructions.")
    parser.add_argument("document", help="Path to the .docx/.docm file to modify.")
    parser.add_argument(
        "--show-instructions",
        action="store_true",
        help="Print the raw instructions parsed from the clipboard and exit.",
    )
    args = parser.parse_args(argv)

    doc_path = os.path.abspath(args.document)
    if not os.path.exists(doc_path):
        print(f"Error: Document not found at {doc_path}", file=sys.stderr)
        return 1

    raw_instructions = read_clipboard()
    if not raw_instructions:
        print("Clipboard is empty. Copy your redline instructions first.", file=sys.stderr)
        return 1

    try:
        commands = parse_instructions(raw_instructions)
    except InstructionParseError as exc:
        print(f"Instruction error: {exc}", file=sys.stderr)
        return 1

    if args.show_instructions:
        for cmd in commands:
            print(cmd)
        return 0

    print(f"Applying {len(commands)} instruction(s) to {doc_path}...\n")
    failures = 0
    for command in commands:
        try:
            vb_lines = build_vb_code(command)
        except InstructionParseError as exc:
            print(f"- {command.label()}: {exc}")
            failures += 1
            continue
        try:
            result = run_command(doc_path, vb_lines)
        except RuntimeError as exc:
            print(f"- {command.label()}: ERROR -> {exc}")
            failures += 1
            continue
        if result == "OK":
            print(f"- {command.label()}: applied")
        elif result == "NOT_FOUND":
            print(f"- {command.label()}: target not found")
            failures += 1
        else:
            print(f"- {command.label()}: unexpected response '{result}'")
            failures += 1
    print("\nDone.")
    return 1 if failures else 0


if __name__ == "__main__":  # pragma: no cover
    sys.exit(main())
