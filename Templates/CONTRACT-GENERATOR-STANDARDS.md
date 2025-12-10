# Contract Generator Standards & Requirements

## MANDATORY FEATURES CHECKLIST

Every contract generator on the Terms.Law Contract Library **MUST** implement ALL of the following features. No exceptions.

---

## 1. LIVE PREVIEW (MANDATORY)

Every generator must have a real-time document preview that updates instantly as the user types.

### Requirements:
- [ ] Split-pane layout: Form inputs on left, live preview on right
- [ ] Preview updates on EVERY keystroke (`oninput` event, NOT `onchange`)
- [ ] Preview must look like an actual legal document (proper formatting, fonts, spacing)
- [ ] All user inputs must appear in the preview with highlighting

---

## 2. SCROLL-TO-VIEW + HIGHLIGHT (MANDATORY - CRITICAL)

**THIS IS THE MOST IMPORTANT FEATURE. IMPLEMENT IT FIRST.**

When a user focuses on ANY input field, the corresponding text in the live preview MUST:
1. **SCROLL INTO VIEW** - The preview pane must automatically scroll to show the relevant section
2. **HIGHLIGHT** - The corresponding text must be visually highlighted so the user sees EXACTLY what they're changing

### Implementation Pattern:

```javascript
// Track which field was just edited
let lastEditedField = null;

function trackFieldEdit(fieldId) {
  // Check for custom edits warning (see Section 5)
  if (hasCustomEdits) {
    const proceed = confirm(
      'You have custom edits in the document preview.\n\n' +
      'Changing form inputs will regenerate the document and your custom edits will be lost.\n\n' +
      'Click OK to regenerate, or Cancel to keep your edits.'
    );
    if (!proceed) return;
    hasCustomEdits = false;
  }

  lastEditedField = fieldId;
  updatePreview();
}

function updatePreview() {
  // ... generate preview HTML ...

  // AFTER updating preview, scroll to and highlight the edited field
  if (lastEditedField) {
    setTimeout(() => {
      const highlight = document.querySelector(`[data-field="${lastEditedField}"]`);
      if (highlight) {
        // SCROLL INTO VIEW
        highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // HIGHLIGHT with animation
        highlight.classList.add('field-highlight-animation');
        setTimeout(() => {
          highlight.classList.remove('field-highlight-animation');
        }, 1500);
      }
    }, 50);
  }
}
```

### Required CSS:

```css
/* Highlighted fields in preview */
.doc-highlight {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  padding: 2px 6px;
  border-radius: 4px;
  border-bottom: 2px solid #f59e0b;
  font-weight: 600;
  transition: all 0.3s ease;
}

.doc-highlight.empty {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-bottom-color: #ef4444;
  color: #dc2626;
}

/* Animation when field is edited */
@keyframes highlightPulse {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
  50% { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
}

.field-highlight-animation {
  animation: highlightPulse 0.6s ease-out;
  background: linear-gradient(135deg, #fde047 0%, #facc15 100%) !important;
}
```

### HTML Pattern for Inputs:

```html
<!-- EVERY input must call trackFieldEdit with its field ID -->
<input type="text"
       id="companyName"
       class="form-input"
       placeholder="Acme Corp"
       oninput="trackFieldEdit('companyName')">
```

### HTML Pattern for Preview Highlights:

```javascript
// Helper function for generating highlighted spans
const h = (value, placeholder, fieldId) => {
  const isEmpty = !value || value.startsWith('[');
  const displayValue = isEmpty ? `[${placeholder}]` : value;
  const emptyClass = isEmpty ? ' empty' : '';
  return `<span class="doc-highlight${emptyClass}" data-field="${fieldId}" contenteditable="true">${displayValue}</span>`;
};

// Usage in preview generation:
const companyName = document.getElementById('companyName').value || '';
previewHTML += `<p>This Agreement is entered into by ${h(companyName, 'Company Name', 'companyName')}...</p>`;
```

---

## 3. INLINE EDITING (MANDATORY)

Users must be able to click on highlighted text in the preview and edit it directly.

### Requirements:
- [ ] All highlighted spans must have `contenteditable="true"`
- [ ] Changes in preview must sync back to form inputs
- [ ] Blur event must update the corresponding form field

### Implementation:

```javascript
// Field ID to input element mapping
const fieldInputMap = {
  'companyName': 'companyName',
  'companyAddress': 'companyAddress',
  'effectiveDate': 'effectiveDate',
  // ... map all fields
};

function setupInlineEditing() {
  document.querySelectorAll('.doc-highlight[contenteditable="true"]').forEach(el => {
    el.addEventListener('blur', function() {
      handleInlineEdit(this);
    });

    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.blur();
      }
    });
  });
}

function handleInlineEdit(element) {
  const fieldId = element.dataset.field;
  const newValue = element.textContent.trim();
  const inputId = fieldInputMap[fieldId];

  if (inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.value = newValue;
      // Don't call updatePreview() to preserve user's position
    }
  }
}

// Call after each preview update
function updatePreview() {
  // ... generate HTML ...
  document.getElementById('documentPreview').innerHTML = previewHTML;
  setupInlineEditing(); // Re-attach listeners
}
```

---

## 4. FULL EDIT MODE (MANDATORY)

Users must have the option to freely edit the entire document, including adding/removing paragraphs.

### Requirements:
- [ ] "Edit Mode" toggle button in preview toolbar
- [ ] When active, entire document body becomes editable
- [ ] Toolbar with: Bold, Italic, Underline, Add Paragraph, Add Section, Save, Cancel
- [ ] Save preserves all changes
- [ ] Cancel restores original generated content

### Implementation:

```javascript
let isFullEditMode = false;
let savedDocumentHTML = '';
let hasCustomEdits = false;

function toggleFullEditMode() {
  const docBody = document.getElementById('documentPreview');
  const toggleBtn = document.getElementById('editModeBtn');

  if (!isFullEditMode) {
    // ENTERING edit mode
    isFullEditMode = true;
    savedDocumentHTML = docBody.innerHTML; // Save current state
    docBody.contentEditable = 'true';
    docBody.classList.add('full-edit-mode');
    toggleBtn.innerHTML = '💾 Save Edits';
    toggleBtn.classList.add('active');

    // Show edit toolbar
    document.getElementById('editToolbar').style.display = 'flex';
  } else {
    // SAVING edits
    saveFullEdits();
  }
}

function saveFullEdits() {
  const docBody = document.getElementById('documentPreview');
  const toggleBtn = document.getElementById('editModeBtn');

  isFullEditMode = false;
  hasCustomEdits = true; // CRITICAL: Mark that user has custom edits
  docBody.contentEditable = 'false';
  docBody.classList.remove('full-edit-mode');
  toggleBtn.innerHTML = '✏️ Edit Mode';
  toggleBtn.classList.remove('active');

  document.getElementById('editToolbar').style.display = 'none';
  showToast('Edits saved! Your custom changes have been preserved.');
}

function cancelEditMode() {
  const docBody = document.getElementById('documentPreview');
  const toggleBtn = document.getElementById('editModeBtn');

  if (savedDocumentHTML) {
    docBody.innerHTML = savedDocumentHTML;
  }

  isFullEditMode = false;
  hasCustomEdits = false; // Clear flag since we're restoring
  docBody.contentEditable = 'false';
  docBody.classList.remove('full-edit-mode');
  toggleBtn.innerHTML = '✏️ Edit Mode';
  toggleBtn.classList.remove('active');

  document.getElementById('editToolbar').style.display = 'none';
  showToast('Changes discarded');
  setupInlineEditing();
}
```

---

## 5. WARN BEFORE OVERWRITING SAVED EDITS (MANDATORY - CRITICAL)

**If the user has saved custom edits in Full Edit Mode, they MUST be warned before any form input regenerates the document.**

### The Problem This Solves:
User enters Full Edit Mode → Makes custom changes → Clicks "Save" → Then clicks on a form input → Their custom edits are ERASED without warning.

### Implementation:

```javascript
let hasCustomEdits = false; // Track if user has saved custom edits

function trackFieldEdit(fieldId) {
  // CRITICAL: Check if user has custom edits before regenerating
  if (hasCustomEdits) {
    const proceed = confirm(
      'You have custom edits in the document preview.\n\n' +
      'Changing form inputs will regenerate the document and your custom edits will be lost.\n\n' +
      'Click OK to regenerate, or Cancel to keep your edits.'
    );
    if (!proceed) {
      return; // Don't update preview, keep their edits
    }
    hasCustomEdits = false; // Reset flag since they chose to regenerate
  }

  lastEditedField = fieldId;
  updatePreview();
}

// In saveFullEdits():
function saveFullEdits() {
  // ... other code ...
  hasCustomEdits = true; // SET THIS FLAG
}

// In cancelEditMode():
function cancelEditMode() {
  // ... other code ...
  hasCustomEdits = false; // CLEAR THIS FLAG
}
```

---

## 6. DOCUMENT STRUCTURE REQUIREMENTS

### Visual Layout:
- [ ] Document title centered at top
- [ ] Clear section headers (RECITALS, ARTICLE I, etc.)
- [ ] Proper paragraph spacing
- [ ] Professional typography (serif font for document body)

### Required CSS:

```css
/* Document preview container */
#documentPreview {
  font-family: 'Times New Roman', Georgia, serif;
  font-size: 14px;
  line-height: 1.8;
  color: #1a1a1a;
  padding: 60px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

/* Document title */
.doc-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #333;
}

/* Section headers */
.doc-section-header {
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
  margin-top: 30px;
  margin-bottom: 15px;
}

/* Paragraphs */
.doc-paragraph {
  text-align: justify;
  margin-bottom: 15px;
  text-indent: 40px;
}

/* Full edit mode styling */
.full-edit-mode {
  outline: 3px solid #3b82f6;
  background: #fefefe;
}
```

---

## 7. SIGNATURE SECTION (WHEN APPLICABLE)

For documents requiring signatures:

- [ ] Signature canvas (draw or type)
- [ ] Clear/reset button
- [ ] Date field
- [ ] Print name field
- [ ] Title/position field

---

## 8. EXPORT OPTIONS (MANDATORY)

Every generator must have:

- [ ] **Print** - Opens print dialog
- [ ] **Copy to Clipboard** - Copies formatted text
- [ ] **Download as DOCX** (preferred) or PDF

---

## 9. RESPONSIVE DESIGN

- [ ] Works on desktop (primary)
- [ ] Stacked layout on tablet/mobile (form above, preview below)
- [ ] Touch-friendly inputs

---

## 10. ACCESSIBILITY

- [ ] All form inputs have labels
- [ ] Proper heading hierarchy
- [ ] Keyboard navigable
- [ ] Focus indicators visible

---

## QUICK REFERENCE: ESSENTIAL CODE BLOCKS

### State Variables (add at top of script):
```javascript
let lastEditedField = null;
let isFullEditMode = false;
let savedDocumentHTML = '';
let hasCustomEdits = false;
```

### Input Pattern:
```html
<input type="text" id="fieldName" oninput="trackFieldEdit('fieldName')">
```

### Preview Highlight Pattern:
```javascript
const h = (value, placeholder, fieldId) => {
  const isEmpty = !value || value.startsWith('[');
  const displayValue = isEmpty ? `[${placeholder}]` : value;
  const emptyClass = isEmpty ? ' empty' : '';
  return `<span class="doc-highlight${emptyClass}" data-field="${fieldId}" contenteditable="true">${displayValue}</span>`;
};
```

### Scroll + Highlight After Update:
```javascript
if (lastEditedField) {
  setTimeout(() => {
    const highlight = document.querySelector(`[data-field="${lastEditedField}"]`);
    if (highlight) {
      highlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
      highlight.classList.add('field-highlight-animation');
      setTimeout(() => highlight.classList.remove('field-highlight-animation'), 1500);
    }
  }, 50);
}
```

---

## IMPLEMENTATION CHECKLIST FOR NEW GENERATORS

Before considering a generator complete, verify ALL items:

### Core Features:
- [ ] Live preview updates on every keystroke
- [ ] **SCROLL-TO-VIEW works for every input field**
- [ ] **HIGHLIGHT animation plays when field is edited**
- [ ] Inline editing works (click text in preview to edit)
- [ ] Full Edit Mode toggle works
- [ ] Full Edit Mode Save preserves changes
- [ ] Full Edit Mode Cancel restores original
- [ ] **Warning appears before overwriting saved custom edits**

### User Experience:
- [ ] Empty fields show placeholder text with red styling
- [ ] Filled fields show yellow highlight
- [ ] Animation draws attention to edited field
- [ ] Toast notifications confirm actions
- [ ] Breadcrumb navigation present

### Export:
- [ ] Print button works
- [ ] Copy to clipboard works
- [ ] Download works

---

## TESTING PROCEDURE

Before deploying any generator, manually test:

1. **Fill out form** → Verify preview updates live
2. **Click on each input field** → Verify preview SCROLLS and HIGHLIGHTS that field
3. **Click highlighted text in preview** → Verify you can edit inline
4. **Enter Full Edit Mode** → Add custom text → **Save**
5. **Click a form input** → **VERIFY WARNING APPEARS**
6. **Click Cancel on warning** → Verify custom edits are preserved
7. **Click OK on warning** → Verify document regenerates
8. **Print** → Verify print dialog opens
9. **Copy** → Paste somewhere → Verify content is correct
10. **Download** → Verify file downloads correctly

---

## REFERENCE IMPLEMENTATIONS

Working examples that follow these standards:

1. `/Templates/nda-mutual-confidentiality-agreement.html` - Original implementation
2. `/Templates/llc-amendment-generator.html` - Full featured with all protections
3. `/Templates/board-resolution-generator.html` - Multiple resolution types with hasCustomEdits
4. `/Templates/ip-assignment-agreement-generator.html` - Founder IP transfer with consideration options

---

## GENERATOR STATUS TRACKING

Use these CSS classes in `contract-library-landing.html` to indicate generator status:

| Status | CSS Class | Description |
|--------|-----------|-------------|
| **New** | `new-tag` | Just launched, fully functional |
| **Coming Soon** | `coming-soon` | Placeholder, not yet built |
| **Essential** | (default blue) | Core document, high priority |
| **Popular** | (default blue) | Frequently used |

Example markup:
```html
<!-- Active generator -->
<a href="ip-assignment-agreement-generator.html" class="category-template-item">
  <span class="category-template-name">IP Assignment Agreement</span>
  <span class="category-template-tag new-tag">New</span>
</a>

<!-- Placeholder -->
<a href="#" class="category-template-item">
  <span class="category-template-name">SAFE Agreement</span>
  <span class="category-template-tag coming-soon">Coming Soon</span>
</a>
```

---

## BUILD PRIORITY (Startups, Corporations & LLCs)

### Completed:
- [x] LLC Amendment
- [x] Board Resolutions
- [x] IP Assignment Agreement

### Next Up (by complexity - easiest first):
- [ ] Written Consent (Board/Stockholder) - Short, template-based
- [ ] Advisor Agreement - Standard FAST agreement format
- [ ] Founders Agreement - Multi-party, equity splits
- [ ] SAFE Agreement - YC standard with variations
- [ ] Convertible Note - Financial terms, maturity
- [ ] LLC Operating Agreement - Complex, multi-member
- [ ] Corporate Bylaws - Lengthy, many sections

---

*Document Version: 1.1*
*Last Updated: December 2024*
*Author: Terms.Law Development Team*
