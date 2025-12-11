/**
 * Terms.Law Live Chat Widget
 * Embed with: <script src="https://terms.law/chat-widget/chat-widget.js"></script>
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = 'https://template-generator-aob3.vercel.app/api/telegram-chat';

  // State
  let isOpen = false;
  let currentStatus = 'away'; // 'online' | 'available' | 'away'
  let chatStarted = false;
  let visitorId = localStorage.getItem('termslaw_chat_id') || generateId();
  let visitorName = '';
  let visitorEmail = '';
  let visitorTopic = '';
  let lastMessageTimestamp = 0;
  let pollInterval = null;

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Check if it's late night in California (10pm - 6am PT)
  function isLateHoursPT() {
    const now = new Date();
    const pt = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const hour = pt.getHours();
    return hour >= 22 || hour < 6;
  }

  // Inject styles - Premium custom design
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    .tl-chat-button {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 64px;
      height: 64px;
      border-radius: 20px;
      background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      border: 1px solid rgba(255, 215, 0, 0.15);
      cursor: pointer;
      box-shadow:
        0 8px 32px rgba(15, 52, 96, 0.4),
        0 0 0 1px rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999999;
    }
    .tl-chat-button:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow:
        0 12px 40px rgba(15, 52, 96, 0.5),
        0 0 0 1px rgba(255, 215, 0, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    .tl-chat-button svg { width: 26px; height: 26px; fill: rgba(255, 255, 255, 0.9); }
    .tl-chat-button .tl-close-icon { display: none; }
    .tl-chat-button.tl-open .tl-chat-icon { display: none; }
    .tl-chat-button.tl-open .tl-close-icon { display: block; }
    .tl-chat-button.tl-open {
      border-radius: 50%;
      width: 56px;
      height: 56px;
    }

    .tl-chat-status {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #4b5563;
      border: 3px solid #1a1a2e;
      transition: all 0.3s ease;
    }
    .tl-chat-status.tl-online {
      background: #10b981;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.6);
      animation: tl-glow-green 2s ease-in-out infinite;
    }
    .tl-chat-status.tl-available {
      background: #f59e0b;
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.6);
      animation: tl-glow-amber 2s ease-in-out infinite;
    }
    @keyframes tl-glow-green {
      0%, 100% { box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 16px rgba(16, 185, 129, 0.7); }
    }
    @keyframes tl-glow-amber {
      0%, 100% { box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
      50% { box-shadow: 0 0 16px rgba(245, 158, 11, 0.7); }
    }

    .tl-chat-window {
      position: fixed;
      bottom: 108px;
      right: 28px;
      width: 400px;
      max-width: calc(100vw - 56px);
      height: 560px;
      max-height: calc(100vh - 140px);
      background: linear-gradient(180deg, #fefefe 0%, #f8f9fa 100%);
      border-radius: 24px;
      box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.15),
        0 10px 30px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(24px) scale(0.92);
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .tl-chat-window.tl-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    .tl-chat-header {
      background: linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      color: white;
      padding: 20px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }
    .tl-chat-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grain" patternUnits="userSpaceOnUse" width="60" height="60"><circle cx="30" cy="30" r="1" fill="rgba(255,215,0,0.03)"/></pattern></defs><rect width="100%" height="100%" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }
    .tl-chat-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 24px;
      right: 24px;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.2), transparent);
    }

    .tl-chat-avatar {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, #2d3748, #1a202c);
      border: 2px solid rgba(255, 215, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
      flex-shrink: 0;
    }
    .tl-chat-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .tl-chat-avatar-status {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #4b5563;
      border: 2px solid #1a1a2e;
    }
    .tl-chat-avatar-status.tl-online { background: #10b981; }
    .tl-chat-avatar-status.tl-available { background: #f59e0b; }

    .tl-chat-header-info { flex: 1; position: relative; z-index: 1; }
    .tl-chat-header-name {
      font-size: 1.1rem;
      font-weight: 600;
      font-family: 'Cormorant Garamond', Georgia, serif;
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .tl-chat-header-tagline {
      font-size: 0.8rem;
      opacity: 0.7;
      margin-top: 3px;
      font-weight: 400;
      letter-spacing: 0.02em;
    }
    .tl-chat-header-status {
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 6px;
      padding: 4px 0;
    }
    .tl-status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4b5563;
    }
    .tl-status-dot.tl-online { background: #4ade80; box-shadow: 0 0 8px rgba(74, 222, 128, 0.5); }
    .tl-status-dot.tl-available { background: #fbbf24; box-shadow: 0 0 8px rgba(251, 191, 36, 0.5); }

    .tl-verified-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #6ee7b7;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 0.65rem;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tl-verified-badge svg {
      width: 10px;
      height: 10px;
      fill: currentColor;
    }

    .tl-chat-intro {
      padding: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
      overflow-y: auto;
    }

    .tl-intro-welcome {
      padding: 24px 24px 20px;
      text-align: center;
      border-bottom: 1px solid #e5e7eb;
      background: white;
    }
    .tl-intro-welcome h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.35rem;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 8px;
      letter-spacing: -0.01em;
    }
    .tl-intro-welcome p {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }

    .tl-trust-signals {
      display: flex;
      justify-content: center;
      gap: 16px;
      padding: 16px 24px;
      background: #f8f9fa;
      border-bottom: 1px solid #e5e7eb;
    }
    .tl-trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: #64748b;
      font-weight: 500;
    }
    .tl-trust-item svg {
      width: 14px;
      height: 14px;
      fill: #10b981;
    }

    .tl-chat-intro-form {
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: 20px 24px 24px;
    }
    .tl-chat-intro-input, .tl-chat-intro-select {
      padding: 14px 18px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      background: white;
      transition: all 0.2s ease;
    }
    .tl-chat-intro-input:focus, .tl-chat-intro-select:focus {
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.1);
    }
    .tl-chat-intro-select {
      cursor: pointer;
      appearance: none;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%2364748b" d="M6 8L1 3h10z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 18px center;
    }
    .tl-chat-intro-select:invalid { color: #94a3b8; }

    .tl-chat-intro-btn {
      padding: 16px 24px;
      background: linear-gradient(145deg, #1a1a2e 0%, #0f3460 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.01em;
    }
    .tl-chat-intro-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transition: left 0.5s ease;
    }
    .tl-chat-intro-btn:hover::before { left: 100%; }
    .tl-chat-intro-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(15, 52, 96, 0.3);
    }

    .tl-email-note {
      font-size: 0.75rem;
      color: #94a3b8;
      text-align: center;
      margin-top: -6px;
    }

    .tl-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
    }
    .tl-chat-message {
      max-width: 82%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.9rem;
      line-height: 1.55;
      animation: tl-msgIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    @keyframes tl-msgIn {
      from { opacity: 0; transform: translateY(12px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .tl-chat-message.tl-visitor {
      align-self: flex-end;
      background: linear-gradient(145deg, #1a1a2e, #0f3460);
      color: white;
      border-bottom-right-radius: 6px;
    }
    .tl-chat-message.tl-sergei {
      align-self: flex-start;
      background: white;
      color: #1e293b;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 6px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }
    .tl-chat-message.tl-system {
      align-self: center;
      background: transparent;
      color: #94a3b8;
      font-size: 0.8rem;
      padding: 8px;
      text-align: center;
    }

    .tl-chat-input-area {
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #e5e7eb;
    }
    .tl-chat-input-wrapper { display: flex; gap: 10px; }
    .tl-chat-input {
      flex: 1;
      padding: 14px 20px;
      border: 1.5px solid #e2e8f0;
      border-radius: 24px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .tl-chat-input:focus {
      border-color: #0f3460;
      box-shadow: 0 0 0 3px rgba(15, 52, 96, 0.08);
    }
    .tl-chat-send-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(145deg, #1a1a2e, #0f3460);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }
    .tl-chat-send-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 16px rgba(15, 52, 96, 0.3);
    }
    .tl-chat-send-btn svg { width: 20px; height: 20px; fill: white; }

    .tl-status-notice {
      padding: 14px 20px;
      font-size: 0.8rem;
      line-height: 1.5;
      border-bottom: 1px solid;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .tl-status-notice svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .tl-status-notice.tl-away {
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      color: #92400e;
      border-color: #fde68a;
    }
    .tl-status-notice.tl-away svg { fill: #f59e0b; }
    .tl-status-notice.tl-available {
      background: linear-gradient(135deg, #f0fdf4, #dcfce7);
      color: #166534;
      border-color: #bbf7d0;
    }
    .tl-status-notice.tl-available svg { fill: #22c55e; }
    .tl-status-notice.tl-late {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      color: #1e40af;
      border-color: #bfdbfe;
    }
    .tl-status-notice.tl-late svg { fill: #3b82f6; }

    .tl-powered {
      padding: 10px;
      text-align: center;
      font-size: 0.65rem;
      color: #94a3b8;
      background: #f8f9fa;
      border-top: 1px solid #e5e7eb;
      letter-spacing: 0.02em;
    }
    .tl-powered a {
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
    }
    .tl-powered a:hover { text-decoration: underline; }

    @media (max-width: 480px) {
      .tl-chat-window {
        bottom: 0;
        right: 0;
        left: 0;
        width: 100%;
        max-width: 100%;
        height: 100%;
        max-height: 100%;
        border-radius: 0;
      }
      .tl-chat-button { bottom: 20px; right: 20px; }
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Inject Calendly for scheduling popup (if not already loaded)
  if (!window.Calendly) {
    const calendlyCSS = document.createElement('link');
    calendlyCSS.href = 'https://assets.calendly.com/assets/external/widget.css';
    calendlyCSS.rel = 'stylesheet';
    document.head.appendChild(calendlyCSS);

    const calendlyJS = document.createElement('script');
    calendlyJS.src = 'https://assets.calendly.com/assets/external/widget.js';
    calendlyJS.async = true;
    document.head.appendChild(calendlyJS);
  }

  // Create HTML
  const html = `
    <button class="tl-chat-button" id="tlChatButton">
      <span class="tl-chat-status" id="tlButtonStatus"></span>
      <svg class="tl-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg class="tl-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <div class="tl-chat-window" id="tlChatWindow">
      <div class="tl-chat-header">
        <div class="tl-chat-avatar">
          <img src="https://template.terms.law/chat-widget/sergei_small.jpg" alt="Attorney">
          <span class="tl-chat-avatar-status" id="tlAvatarStatus"></span>
        </div>
        <div class="tl-chat-header-info">
          <div class="tl-chat-header-name">
            Sergei Tokmakov, Esq.
            <span class="tl-verified-badge">
              <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
              Verified
            </span>
          </div>
          <div class="tl-chat-header-tagline">California State Bar #342637</div>
          <div class="tl-chat-header-status">
            <span class="tl-status-dot" id="tlHeaderStatus"></span>
            <span id="tlStatusText">Checking...</span>
          </div>
        </div>
      </div>
      <div class="tl-status-notice" id="tlStatusNotice" style="display: none;"></div>
      <div class="tl-chat-intro" id="tlChatIntro">
        <div class="tl-intro-welcome">
          <h3>Direct Line to Your Attorney</h3>
          <p>This goes straight to my phone — no assistants, no bots, no delays.</p>
        </div>
        <div class="tl-trust-signals">
          <div class="tl-trust-item">
            <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Licensed Attorney
          </div>
          <div class="tl-trust-item">
            <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Real Person
          </div>
          <div class="tl-trust-item">
            <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Confidential
          </div>
        </div>
        <form class="tl-chat-intro-form" id="tlIntroForm">
          <input type="text" class="tl-chat-intro-input" id="tlVisitorName" placeholder="Your first name" required>
          <select class="tl-chat-intro-select" id="tlVisitorTopic" required>
            <option value="" disabled selected>What brings you here today?</option>
            <option value="demand">Demand Letter</option>
            <option value="contract">Contract Review or Drafting</option>
            <option value="startup">Startup / Business Formation</option>
            <option value="ip">IP / Trademark / Copyright</option>
            <option value="dispute">Business Dispute</option>
            <option value="other">Other Legal Matter</option>
          </select>
          <input type="email" class="tl-chat-intro-input" id="tlVisitorEmail" placeholder="Email for follow-up (optional)">
          <span class="tl-email-note">I'll only use this to continue our conversation</span>
          <button type="submit" class="tl-chat-intro-btn">Start Conversation</button>
        </form>
      </div>
      <div class="tl-chat-messages" id="tlChatMessages" style="display: none;"></div>
      <div class="tl-chat-input-area" id="tlChatInputArea" style="display: none;">
        <div class="tl-chat-input-wrapper">
          <input type="text" class="tl-chat-input" id="tlChatInput" placeholder="Type your message...">
          <button class="tl-chat-send-btn" id="tlSendBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
      <div class="tl-powered">Direct chat by <a href="https://terms.law" target="_blank">Terms.Law</a></div>
    </div>
  `;

  // Inject HTML
  const container = document.createElement('div');
  container.id = 'termslaw-chat';
  container.innerHTML = html;
  document.body.appendChild(container);

  // Helper functions
  function generateId() {
    return 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  async function checkStatus() {
    try {
      const response = await fetch(`${API_BASE}?action=status`);
      const data = await response.json();
      currentStatus = data.status || (data.online ? 'online' : 'away');
      updateStatusUI();
    } catch (error) {
      currentStatus = 'away';
      updateStatusUI();
    }
  }

  function updateStatusUI() {
    const buttonStatus = document.getElementById('tlButtonStatus');
    const headerStatus = document.getElementById('tlHeaderStatus');
    const avatarStatus = document.getElementById('tlAvatarStatus');
    const statusText = document.getElementById('tlStatusText');
    const statusNotice = document.getElementById('tlStatusNotice');
    const lateHours = isLateHoursPT();

    // Reset classes
    buttonStatus.classList.remove('tl-online', 'tl-available');
    headerStatus.classList.remove('tl-online', 'tl-available');
    avatarStatus.classList.remove('tl-online', 'tl-available');
    statusNotice.classList.remove('tl-away', 'tl-available', 'tl-late');

    const clockIcon = '<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>';
    const globeIcon = '<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"/></svg>';

    if (currentStatus === 'online') {
      buttonStatus.classList.add('tl-online');
      headerStatus.classList.add('tl-online');
      avatarStatus.classList.add('tl-online');
      statusText.textContent = 'Available now';

      if (lateHours && chatStarted) {
        statusNotice.className = 'tl-status-notice tl-late';
        statusNotice.innerHTML = globeIcon + '<span>I work with international clients, so my hours are flexible.</span>';
        statusNotice.style.display = 'flex';
      } else {
        statusNotice.style.display = 'none';
      }
    } else if (currentStatus === 'available') {
      buttonStatus.classList.add('tl-available');
      headerStatus.classList.add('tl-available');
      avatarStatus.classList.add('tl-available');
      statusText.textContent = 'I respond quickly';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-available';
        if (lateHours) {
          statusNotice.innerHTML = checkIcon + '<span>I work with international clients and check messages regularly.</span>';
        } else {
          statusNotice.innerHTML = checkIcon + '<span>I\'m around but may not respond instantly. Go ahead and describe your situation.</span>';
        }
        statusNotice.style.display = 'flex';
      } else {
        statusNotice.style.display = 'none';
      }
    } else {
      // away
      statusText.textContent = 'I check messages periodically';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-away';
        if (visitorEmail) {
          statusNotice.innerHTML = clockIcon + '<span>I\'m not at my desk but I\'ll see your message. I\'ll follow up at <strong>' + visitorEmail + '</strong>.</span>';
        } else {
          statusNotice.innerHTML = clockIcon + '<span>I\'m not at my desk but I check messages periodically. Describe your situation or <a href="#" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting\'});return false;" style="color: inherit; text-decoration: underline;">schedule a call</a>.</span>';
        }
        statusNotice.style.display = 'flex';
      } else {
        statusNotice.style.display = 'none';
      }
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    const chatWindow = document.getElementById('tlChatWindow');
    const chatButton = document.getElementById('tlChatButton');

    if (isOpen) {
      chatWindow.classList.add('tl-open');
      chatButton.classList.add('tl-open');
      if (chatStarted) document.getElementById('tlChatInput').focus();
    } else {
      chatWindow.classList.remove('tl-open');
      chatButton.classList.remove('tl-open');
    }
  }

  function startChat(event) {
    event.preventDefault();
    visitorName = document.getElementById('tlVisitorName').value.trim();
    visitorEmail = document.getElementById('tlVisitorEmail').value.trim();
    visitorTopic = document.getElementById('tlVisitorTopic').value;
    if (!visitorName || !visitorTopic) return;

    chatStarted = true;
    document.getElementById('tlChatIntro').style.display = 'none';
    document.getElementById('tlChatMessages').style.display = 'flex';
    document.getElementById('tlChatInputArea').style.display = 'block';

    // Topic-specific prompts asking for relevant details
    const topicPrompts = {
      demand: `Hi ${visitorName}! For your demand letter, please tell me: (1) What happened? (2) Who owes you / wronged you? (3) What amount or action are you seeking?`,
      contract: `Hi ${visitorName}! For your contract matter: (1) What type of contract? (2) Reviewing existing or drafting new? (3) Any specific concerns or clauses?`,
      startup: `Hi ${visitorName}! For your startup/business formation: (1) What type of business? (2) How many founders/owners? (3) Which state are you forming in?`,
      ip: `Hi ${visitorName}! For your IP matter: (1) Trademark, copyright, or patent? (2) Protecting your own IP or dealing with infringement? (3) Brief description of the IP involved.`,
      dispute: `Hi ${visitorName}! For your business dispute: (1) Who is the dispute with? (2) What is it about? (3) What outcome are you hoping for?`,
      other: `Hi ${visitorName}! Please describe your legal matter and I'll let you know how I can help.`
    };

    let welcomeMsg = topicPrompts[visitorTopic] || topicPrompts.other;

    // Add status context if not online
    if (currentStatus === 'available') {
      welcomeMsg = `Hi ${visitorName}! I'll see your message shortly. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2);
    } else if (currentStatus !== 'online') {
      welcomeMsg = `Hi ${visitorName}, I'm not at my desk but I check messages regularly. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2) + (visitorEmail ? " I'll follow up by email." : "");
    }

    addMessageToUI(welcomeMsg, 'tl-sergei');

    document.getElementById('tlChatInput').focus();
    updateStatusUI();
    startPolling();
  }

  async function sendMessage() {
    const input = document.getElementById('tlChatInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    addMessageToUI(message, 'tl-visitor');

    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          visitorId,
          visitorName,
          visitorEmail,
          visitorTopic,
          message,
          page: window.location.href
        })
      });
    } catch (error) {
      addMessageToUI('Connection error. Please try again.', 'tl-system');
    }
  }

  function addMessageToUI(text, type) {
    const messagesContainer = document.getElementById('tlChatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `tl-chat-message ${type}`;
    messageEl.textContent = text;
    messagesContainer.appendChild(messageEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    if (type !== 'tl-system') lastMessageTimestamp = Date.now();
  }

  function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}?action=getMessages&visitorId=${visitorId}&since=${lastMessageTimestamp}`);
        const data = await response.json();
        currentStatus = data.status || (data.online ? 'online' : 'away');
        updateStatusUI();
        if (data.messages) {
          data.messages.forEach(msg => {
            if (msg.from === 'sergei') {
              addMessageToUI(msg.text, 'tl-sergei');
            }
            if (msg.timestamp > lastMessageTimestamp) {
              lastMessageTimestamp = msg.timestamp;
            }
          });
        }
      } catch (error) {}
    }, 3000);
  }

  // Event listeners
  document.getElementById('tlChatButton').addEventListener('click', toggleChat);
  document.getElementById('tlIntroForm').addEventListener('submit', startChat);
  document.getElementById('tlSendBtn').addEventListener('click', sendMessage);
  document.getElementById('tlChatInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Initialize
  checkStatus();
  setInterval(checkStatus, 30000);

})();
