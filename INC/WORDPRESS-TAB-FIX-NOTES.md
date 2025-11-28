# WordPress Tab Scrolling Fix - Important Note for Future Builds

## Problem
When tabbed interfaces are inserted into WordPress Custom HTML blocks, clicking tabs causes unwanted scrolling/jumping. The page scrolls to top or moves unexpectedly, even though the tabs work fine everywhere else.

## Root Cause
WordPress event handlers interfere with onclick events on buttons/links, causing default scroll behaviors to trigger.

## Solution (Apply to ALL tabbed interfaces)

### 1. Function signature must accept event parameter:
```javascript
function switchTab(tabId, event) {  // ← Add event parameter
  // Prevent default behavior and stop propagation for WordPress compatibility
  if (event) {
    event.preventDefault();      // ← Prevents default button/anchor behavior
    event.stopPropagation();     // ← Stops WordPress from handling the event
  }

  // Rest of your tab switching logic...
}
```

### 2. All onclick handlers must pass event:
```html
<!-- CORRECT: Pass event parameter -->
<button onclick="switchTab('overview', event)">📚 Overview</button>

<!-- WRONG: Missing event parameter -->
<button onclick="switchTab('overview')">📚 Overview</button>
```

### 3. Remove any scroll-to-top calls:
```javascript
// REMOVE THIS - causes jumping in WordPress:
window.scrollTo({ top: 0, behavior: 'smooth' });
```

## Files Where This Fix Has Been Applied
- `/INC/DE-inc/real-estate-entity-structures.html` (2025-11-28)
- `/INC/NV/nevada-corporation-guide.html` (2025-11-28)
- `/INC/GA/georgia-llc-formation-guide.html` (2025-11-28)

## Testing Checklist
- [ ] Test in standalone HTML file (should work)
- [ ] Test in WordPress Custom HTML block (should work WITHOUT scrolling)
- [ ] Verify no scroll jump when clicking between tabs
- [ ] Verify content loads at current scroll position
- [ ] Test on mobile (tabs should work same as desktop)

## Key Takeaway
**Always include `event.preventDefault()` and `event.stopPropagation()` in tab switching functions when building for WordPress compatibility.**
