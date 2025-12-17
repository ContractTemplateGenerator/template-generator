# Client Workroom Features

Standard features for Terms.Law secure client workrooms. Include these when creating new workrooms.

## Password Protection

```html
<div class="password-gate" id="passwordGate">
  <div class="password-box">
    <h2>Secure Client Workroom</h2>
    <div class="subtitle">Enter the access code provided by counsel</div>
    <input type="text" class="password-input" id="passwordInput" value="[PREFILLED_PASSWORD]" autocomplete="off">
    <button class="password-submit" onclick="checkPassword()">Access Workroom</button>
  </div>
</div>
```

- Pre-fill password in visible text mode for easy client access
- One-click login
- Session storage to remember auth during session

---

## Document Editor Toolbar

### Core Controls
| Button | Function |
|--------|----------|
| Font dropdown | Arial, Times New Roman, Georgia, Verdana, Courier |
| Size dropdown | 9-18pt |
| B / I / U | Bold, Italic, Underline |
| ↩ | Undo (up to 50 steps) |
| ↪ | Redo |

### Quick Actions
| Button | Function |
|--------|----------|
| **Arial 11 Everything** | Changes ONLY font-family and font-size to Arial 11pt across entire document. Preserves all other formatting (bold, italic, paragraphs, etc.) |
| **Plain Text Everything** | Strips ALL formatting, converts to plain paragraphs |

### Suggesting Mode (Track Changes)
| Button | Function |
|--------|----------|
| **Suggesting** | Toggle suggesting mode on/off |
| **+Ins** | Insert text as suggestion (green underlined) |
| **-Del** | Mark selected text for deletion (red strikethrough) |
| **Accept All** | Accept all pending changes |
| **Reject All** | Reject all pending changes |

Each suggested change shows ✓ / ✗ buttons to accept/reject individually.

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl/Cmd + Z | Undo (multi-step, up to 50) |
| Ctrl/Cmd + Shift + Z | Redo |
| Ctrl/Cmd + B | Bold |
| Ctrl/Cmd + I | Italic |
| Ctrl/Cmd + U | Underline |

---

## Undo Stack

- Saves document state on every input
- Remembers up to 50 steps
- Custom implementation (not browser's limited undo)
- Works with Ctrl+Z / Cmd+Z

---

## Comments Section

- Real-time sync via Firebase
- User can set their own name (saved to localStorage)
- Edit/Delete own comments on hover
- Telegram notifications to attorney when comments submitted
- Enter key submits, Shift+Enter for new line

---

## CSS Classes for Suggesting Mode

```css
.doc-insertion {
  background: #dcfce7;
  color: #166534;
  text-decoration: underline;
}

.doc-deletion {
  background: #fee2e2;
  color: #dc2626;
  text-decoration: line-through;
}
```

---

## Firebase Configuration

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxBPHNaWTatubO3CDrWbFiJJJxuEBxOQg",
  authDomain: "terms-law.firebaseapp.com",
  databaseURL: "https://terms-law-default-rtdb.firebaseio.com",
  projectId: "terms-law",
  storageBucket: "terms-law.firebasestorage.app",
  messagingSenderId: "394698037958",
  appId: "1:394698037958:web:6749e22542f84ef3fc1efc"
};

// Each workroom gets unique ref:
const workroomRef = db.ref('workrooms/[unique-workroom-id]');
```

---

## Telegram Notifications

```javascript
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';

async function sendTelegramNotification(comment) {
  const message = `New Comment - ${WORKROOM_NAME}\n\nFrom: ${comment.author}\n${comment.text}`;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message
    })
  });
}
```

---

## Template Checklist

When creating a new workroom:

1. [ ] Create unique directory: `/TermsDocs/secure-[random]/`
2. [ ] Set unique password and pre-fill in input
3. [ ] Set unique Firebase ref path
4. [ ] Update workroom name for notifications
5. [ ] Add document content
6. [ ] Copy `.docx` file if download needed
7. [ ] Test password, editor, comments, undo

---

## Example Workrooms

- `/TermsDocs/secure-ax7k9m2/` - Story Cannabis MSA (Niki)
- `/TermsDocs/secure-ws3k8p/` - Shaw v. Sunnova (Wendy)
