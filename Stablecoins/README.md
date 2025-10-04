# Merchant Stablecoin Acceptance Generator

A zero-build, browser-only generator that assembles an SMB-ready **Merchant Addendum for Stablecoin Acceptance** plus operational annexes and a CSV configuration for your checkout stack. The app now includes a legal-grade live preview that mirrors the exported files.

## Features

- Collects merchant profile, token/network matrix, pricing tolerances, finality schedule, refunds, AML/OFAC controls, ops playbooks, and liability posture.
- Side-by-side input and preview panes with 250 ms debounced rendering and clause delta highlighting.
- Live clause numbering, cross-references, defined-term tooltips, pricing ribbons, finality tables, refund engine explainer, PSP disclosure card, and jurisdiction badges.
- Validation panel with fix links; autosaves after 2 s idle and on window blur.
- Outputs:
  - Main Addendum with parameterized clauses for Quote-Locked, Confirmation-Locked, or Immediate-Convert pricing models.
  - Annex A (Operations SOP), Annex B (Finality Schedule), Annex C (Customer Notices).
  - Optional Security Annex and other toggleable modules (marketplace, subscriptions, CCPA/CPRA, VAT flags).
  - CSV of checkout configuration values (token + network whitelist, pricing model, thresholds).
- Includes local draft save/load via `localStorage`.
- Built entirely in a single `index.html` file—open directly in any modern browser.

## Getting Started

1. Open `index.html` in Chrome, Edge, Safari, or Firefox (no build step required).
2. Navigate between tabs to supply required inputs. Validation appears on the **Outputs** tab.
3. Use **Generate documents** to render the Addendum, Annexes, and CSV—copy text directly from each panel.
4. Optional modules can be toggled to append extra clauses (marketplace, subscription billing, security, privacy, VAT guidance).

## Draft Management

- **Save draft** persists state to `localStorage` under the key `stablecoin-acceptance-generator`.
- **Load draft** restores the saved JSON and re-renders the interface.
- **Clear draft** resets inputs and removes the stored copy.
- Autosave also writes to `localStorage` after two seconds of inactivity and whenever the window loses focus.

## Validation Checklist

- At least one token + network combination.
- Oracle / reference price sources specified.
- Refund basis selected.
- Merchant name provided.

## Notes

- The generator focuses on acceptance terms when a PSP or light self-custody is used for USD stablecoins.
- Network access is not required; all logic executes locally in the browser.
- Customize clause language within `index.html` if deeper localization or additional modules are needed. Preview and exports share the same template pipeline to keep WordPress embeds and DOCX exports in sync.
