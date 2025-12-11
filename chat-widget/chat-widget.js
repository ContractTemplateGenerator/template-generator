/**
 * Terms.Law Live Chat Widget
 * Embed with: <script src="https://terms.law/chat-widget/chat-widget.js"></script>
 */

(function() {
  'use strict';

  // Configuration
  const API_BASE = 'https://template-generator-aob3.vercel.app/api/telegram-chat';
  const PHOTO_URL = 'https://template.terms.law/chat-widget/sergei_small.jpg';

  // State
  let isOpen = false;
  let currentStatus = 'away';
  let chatStarted = false;
  let visitorId = localStorage.getItem('termslaw_chat_id') || generateId();
  let visitorName = '';
  let visitorEmail = '';
  let visitorTopic = '';
  let lastMessageTimestamp = 0;
  let pollInterval = null;

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Inject styles - Highly personalized attorney chat design
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    /* Floating button - Photo-based, not generic icon */
    .tl-chat-button {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 3px solid white;
      cursor: pointer;
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 999999;
      overflow: visible;
    }
    .tl-chat-button:hover {
      transform: scale(1.08);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(0, 0, 0, 0.08);
    }
    .tl-chat-button.tl-open {
      transform: scale(0.9);
      opacity: 0.7;
    }

    /* Status indicator on button */
    .tl-chat-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #6b7280;
      border: 3px solid white;
      transition: all 0.3s ease;
    }
    .tl-chat-status.tl-online {
      background: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.3);
      animation: tl-pulse 2s ease-in-out infinite;
    }
    .tl-chat-status.tl-available {
      background: #eab308;
      box-shadow: 0 0 0 3px rgba(234, 179, 8, 0.3);
    }
    @keyframes tl-pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    /* "Chat with me" tooltip on hover */
    .tl-chat-button::before {
      content: 'Chat with Sergei';
      position: absolute;
      right: 80px;
      top: 50%;
      transform: translateY(-50%);
      background: #1a1a2e;
      color: white;
      padding: 10px 16px;
      border-radius: 10px;
      font-family: 'Inter', sans-serif;
      font-size: 0.85rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .tl-chat-button::after {
      content: '';
      position: absolute;
      right: 72px;
      top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: #1a1a2e;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }
    .tl-chat-button:hover::before,
    .tl-chat-button:hover::after {
      opacity: 1;
      visibility: visible;
    }
    .tl-chat-button.tl-open::before,
    .tl-chat-button.tl-open::after {
      display: none;
    }

    /* Main chat window */
    .tl-chat-window {
      position: fixed;
      bottom: 112px;
      right: 28px;
      width: 400px;
      max-width: calc(100vw - 56px);
      height: 580px;
      max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 24px;
      box-shadow:
        0 25px 80px rgba(0, 0, 0, 0.18),
        0 10px 30px rgba(0, 0, 0, 0.12);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .tl-chat-window.tl-open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0) scale(1);
    }

    /* Header with large photo and personal touch */
    .tl-chat-header {
      background: linear-gradient(165deg, #1a1a2e 0%, #16213e 100%);
      color: white;
      padding: 0;
      position: relative;
    }

    /* Top bar with close hint */
    .tl-header-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px 0;
      font-size: 0.7rem;
      opacity: 0.6;
    }

    /* Profile section */
    .tl-header-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 24px 20px;
    }

    .tl-header-photo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 3px solid rgba(255,255,255,0.2);
      flex-shrink: 0;
      position: relative;
    }
    .tl-header-photo-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #6b7280;
      border: 3px solid #1a1a2e;
    }
    .tl-header-photo-status.tl-online { background: #22c55e; }
    .tl-header-photo-status.tl-available { background: #eab308; }

    .tl-header-info {
      flex: 1;
    }
    .tl-header-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.4rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }
    .tl-header-title {
      font-size: 0.8rem;
      opacity: 0.8;
      margin-bottom: 2px;
    }
    .tl-header-bar {
      font-size: 0.75rem;
      opacity: 0.6;
    }
    .tl-header-bar a {
      color: inherit;
      text-decoration: none;
    }
    .tl-header-bar a:hover {
      text-decoration: underline;
    }
    .tl-header-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 0.8rem;
    }
    .tl-status-indicator {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #6b7280;
    }
    .tl-status-indicator.tl-online {
      background: #4ade80;
      box-shadow: 0 0 8px rgba(74, 222, 128, 0.6);
    }
    .tl-status-indicator.tl-available {
      background: #facc15;
      box-shadow: 0 0 8px rgba(250, 204, 21, 0.6);
    }

    /* Handwritten-style signature line */
    .tl-header-signature {
      padding: 12px 24px;
      background: rgba(255,255,255,0.03);
      border-top: 1px solid rgba(255,255,255,0.08);
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-style: italic;
      font-size: 0.9rem;
      opacity: 0.85;
    }

    /* Status notice bar */
    .tl-status-notice {
      padding: 14px 20px;
      font-size: 0.82rem;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .tl-status-notice svg {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      margin-top: 0;
    }
    .tl-status-notice.tl-away {
      background: #fef9c3;
      color: #854d0e;
      border-bottom: 1px solid #fde047;
    }
    .tl-status-notice.tl-away svg { fill: #ca8a04; }
    .tl-status-notice.tl-available {
      background: #f0fdf4;
      color: #166534;
      border-bottom: 1px solid #bbf7d0;
    }
    .tl-status-notice.tl-available svg { fill: #22c55e; }

    /* Intro section */
    .tl-chat-intro {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      background: #fafafa;
    }

    /* Trust banner */
    .tl-trust-banner {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 16px 20px;
      background: white;
      border-bottom: 1px solid #f0f0f0;
    }
    .tl-trust-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: #666;
      font-weight: 500;
    }
    .tl-trust-item svg {
      width: 14px;
      height: 14px;
    }
    .tl-trust-item.tl-verified svg { fill: #22c55e; }
    .tl-trust-item.tl-human svg { fill: #3b82f6; }
    .tl-trust-item.tl-secure svg { fill: #8b5cf6; }

    /* Form */
    .tl-intro-form {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .tl-form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .tl-form-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #444;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tl-form-input, .tl-form-select {
      padding: 14px 16px;
      border: 2px solid #e5e5e5;
      border-radius: 12px;
      font-size: 1rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
      background: white;
    }
    .tl-form-input:focus, .tl-form-select:focus {
      border-color: #1a1a2e;
      box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.1);
    }
    .tl-form-select {
      cursor: pointer;
      appearance: none;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill="%23666" d="M8 11L3 6h10z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 14px center;
    }
    .tl-form-hint {
      font-size: 0.75rem;
      color: #888;
      margin-top: 2px;
    }

    .tl-submit-btn {
      padding: 16px 24px;
      background: linear-gradient(145deg, #1a1a2e 0%, #2d3a5a 100%);
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      margin-top: 8px;
      position: relative;
      overflow: hidden;
    }
    .tl-submit-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
      transition: left 0.6s ease;
    }
    .tl-submit-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(26, 26, 46, 0.35);
    }
    .tl-submit-btn:hover::before {
      left: 100%;
    }

    /* Messages area */
    .tl-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(180deg, #f8f8f8 0%, #ffffff 100%);
    }

    /* Message bubbles with attorney branding */
    .tl-message {
      display: flex;
      gap: 12px;
      animation: tl-fadeUp 0.35s ease;
    }
    @keyframes tl-fadeUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .tl-message.tl-from-visitor {
      flex-direction: row-reverse;
    }
    .tl-message-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
      background: #ddd;
    }
    .tl-message.tl-from-sergei .tl-message-avatar {
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid #e5e5e5;
    }
    .tl-message.tl-from-visitor .tl-message-avatar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
    }
    .tl-message-content {
      max-width: 75%;
    }
    .tl-message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.9rem;
      line-height: 1.55;
    }
    .tl-message.tl-from-sergei .tl-message-bubble {
      background: white;
      color: #1a1a2e;
      border: 1px solid #e8e8e8;
      border-bottom-left-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .tl-message.tl-from-visitor .tl-message-bubble {
      background: linear-gradient(145deg, #1a1a2e, #2d3a5a);
      color: white;
      border-bottom-right-radius: 6px;
    }
    .tl-message-name {
      font-size: 0.7rem;
      font-weight: 600;
      color: #888;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .tl-message.tl-from-visitor .tl-message-name {
      text-align: right;
    }

    .tl-message-system {
      text-align: center;
      font-size: 0.8rem;
      color: #999;
      padding: 8px;
    }

    /* Input area */
    .tl-chat-input-area {
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #f0f0f0;
    }
    .tl-input-wrapper {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .tl-chat-input {
      flex: 1;
      padding: 14px 18px;
      border: 2px solid #e5e5e5;
      border-radius: 24px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
    }
    .tl-chat-input:focus {
      border-color: #1a1a2e;
      box-shadow: 0 0 0 3px rgba(26, 26, 46, 0.08);
    }
    .tl-send-btn {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(145deg, #1a1a2e, #2d3a5a);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }
    .tl-send-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 16px rgba(26, 26, 46, 0.3);
    }
    .tl-send-btn svg {
      width: 20px;
      height: 20px;
      fill: white;
      margin-left: 2px;
    }

    /* Typing indicator */
    .tl-typing {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
      color: #888;
      font-size: 0.8rem;
    }
    .tl-typing-dots {
      display: flex;
      gap: 3px;
    }
    .tl-typing-dots span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #ccc;
      animation: tl-typing 1.4s infinite;
    }
    .tl-typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .tl-typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes tl-typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    /* Footer */
    .tl-footer {
      padding: 10px;
      text-align: center;
      font-size: 0.65rem;
      color: #aaa;
      background: #fafafa;
      border-top: 1px solid #f0f0f0;
    }
    .tl-footer a {
      color: #888;
      text-decoration: none;
    }
    .tl-footer a:hover {
      text-decoration: underline;
    }

    /* Mobile */
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
      .tl-chat-button {
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
      }
      .tl-chat-button::before,
      .tl-chat-button::after {
        display: none;
      }
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Inject Calendly
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
    </button>
    <div class="tl-chat-window" id="tlChatWindow">
      <div class="tl-chat-header">
        <div class="tl-header-topbar">
          <span>DIRECT LINE</span>
          <span style="cursor:pointer;" onclick="document.getElementById('tlChatButton').click()">✕</span>
        </div>
        <div class="tl-header-profile">
          <div class="tl-header-photo">
            <span class="tl-header-photo-status" id="tlPhotoStatus"></span>
          </div>
          <div class="tl-header-info">
            <div class="tl-header-name">Sergei Tokmakov</div>
            <div class="tl-header-title">Business Attorney</div>
            <div class="tl-header-bar"><a href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/279869" target="_blank">CA Bar #279869</a></div>
            <div class="tl-header-status">
              <span class="tl-status-indicator" id="tlStatusIndicator"></span>
              <span id="tlStatusText">Checking...</span>
            </div>
          </div>
        </div>
        <div class="tl-header-signature">"Messages here come directly to my phone."</div>
      </div>
      <div class="tl-status-notice" id="tlStatusNotice" style="display: none;"></div>
      <div class="tl-chat-intro" id="tlChatIntro">
        <div class="tl-trust-banner">
          <div class="tl-trust-item tl-verified">
            <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Licensed
          </div>
          <div class="tl-trust-item tl-human">
            <svg viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            Real Person
          </div>
          <div class="tl-trust-item tl-secure">
            <svg viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>
            Private
          </div>
        </div>
        <form class="tl-intro-form" id="tlIntroForm">
          <div class="tl-form-group">
            <label class="tl-form-label">Your Name</label>
            <input type="text" class="tl-form-input" id="tlVisitorName" placeholder="First name" required>
          </div>
          <div class="tl-form-group">
            <label class="tl-form-label">What Can I Help With?</label>
            <select class="tl-form-select" id="tlVisitorTopic" required>
              <option value="" disabled selected>Select a topic...</option>
              <option value="demand">Demand Letter</option>
              <option value="contract">Contract Review / Drafting</option>
              <option value="startup">Startup / Business Formation</option>
              <option value="ip">Trademark / Copyright / IP</option>
              <option value="dispute">Business Dispute</option>
              <option value="other">Something Else</option>
            </select>
          </div>
          <div class="tl-form-group">
            <label class="tl-form-label">Email <span style="opacity:0.5;text-transform:none;font-weight:400">(optional)</span></label>
            <input type="email" class="tl-form-input" id="tlVisitorEmail" placeholder="For follow-up if I'm away">
            <span class="tl-form-hint">I'll only use this to continue our conversation</span>
          </div>
          <button type="submit" class="tl-submit-btn">Send Message to Sergei</button>
        </form>
      </div>
      <div class="tl-chat-messages" id="tlChatMessages" style="display: none;"></div>
      <div class="tl-chat-input-area" id="tlChatInputArea" style="display: none;">
        <div class="tl-input-wrapper">
          <input type="text" class="tl-chat-input" id="tlChatInput" placeholder="Type a message...">
          <button class="tl-send-btn" id="tlSendBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
      <div class="tl-footer">Direct chat powered by <a href="https://terms.law" target="_blank">Terms.Law</a></div>
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

  function getInitial() {
    return visitorName ? visitorName.charAt(0).toUpperCase() : '?';
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
    const photoStatus = document.getElementById('tlPhotoStatus');
    const statusIndicator = document.getElementById('tlStatusIndicator');
    const statusText = document.getElementById('tlStatusText');
    const statusNotice = document.getElementById('tlStatusNotice');

    // Reset
    buttonStatus.classList.remove('tl-online', 'tl-available');
    photoStatus.classList.remove('tl-online', 'tl-available');
    statusIndicator.classList.remove('tl-online', 'tl-available');

    const clockIcon = '<svg viewBox="0 0 20 20" style="width:18px;height:18px;fill:#ca8a04;flex-shrink:0;"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg>';
    const checkIcon = '<svg viewBox="0 0 20 20" style="width:18px;height:18px;fill:#22c55e;flex-shrink:0;"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>';

    if (currentStatus === 'online') {
      buttonStatus.classList.add('tl-online');
      photoStatus.classList.add('tl-online');
      statusIndicator.classList.add('tl-online');
      statusText.textContent = 'Available now';
      statusNotice.style.display = 'none';
    } else if (currentStatus === 'available') {
      buttonStatus.classList.add('tl-available');
      photoStatus.classList.add('tl-available');
      statusIndicator.classList.add('tl-available');
      statusText.textContent = 'Responds quickly';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-available';
        statusNotice.innerHTML = checkIcon + '<span>I\'m around and will see your message shortly.</span>';
        statusNotice.style.display = 'flex';
      } else {
        statusNotice.style.display = 'none';
      }
    } else {
      statusText.textContent = 'Usually responds within hours';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-away';
        if (visitorEmail) {
          statusNotice.innerHTML = clockIcon + '<span>I\'m away but will see this. I\'ll follow up at <strong>' + visitorEmail + '</strong>.</span>';
        } else {
          statusNotice.innerHTML = clockIcon + '<span>I\'m away but check messages regularly. You can also <a href="#" onclick="Calendly.initPopupWidget({url: \'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting\'});return false;" style="color:#854d0e;text-decoration:underline;">schedule a call</a>.</span>';
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

    const topicPrompts = {
      demand: `Hi ${visitorName}! For your demand letter, please share: (1) What happened? (2) Who owes you / wronged you? (3) What amount or outcome are you seeking?`,
      contract: `Hi ${visitorName}! For your contract matter: (1) What type of contract? (2) Reviewing or drafting? (3) Any specific concerns?`,
      startup: `Hi ${visitorName}! For business formation: (1) What type of business? (2) How many founders? (3) Which state?`,
      ip: `Hi ${visitorName}! For your IP matter: (1) Trademark, copyright, or patent? (2) Protecting your IP or handling infringement? (3) Brief description?`,
      dispute: `Hi ${visitorName}! For your dispute: (1) Who's it with? (2) What's it about? (3) What outcome do you want?`,
      other: `Hi ${visitorName}! Tell me about your legal matter and I'll let you know how I can help.`
    };

    let welcomeMsg = topicPrompts[visitorTopic] || topicPrompts.other;

    if (currentStatus === 'available') {
      welcomeMsg = `Hi ${visitorName}! I'll see your message shortly. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2);
    } else if (currentStatus !== 'online') {
      welcomeMsg = `Hi ${visitorName}, I'm away but I check messages regularly. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2) + (visitorEmail ? " I'll follow up by email." : "");
    }

    addMessage(welcomeMsg, 'sergei');
    document.getElementById('tlChatInput').focus();
    updateStatusUI();
    startPolling();
  }

  function addMessage(text, from) {
    const container = document.getElementById('tlChatMessages');
    const msgDiv = document.createElement('div');

    if (from === 'system') {
      msgDiv.className = 'tl-message-system';
      msgDiv.textContent = text;
    } else {
      msgDiv.className = `tl-message tl-from-${from}`;
      const avatarDiv = document.createElement('div');
      avatarDiv.className = 'tl-message-avatar';
      if (from === 'visitor') {
        avatarDiv.textContent = getInitial();
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'tl-message-content';

      const nameDiv = document.createElement('div');
      nameDiv.className = 'tl-message-name';
      nameDiv.textContent = from === 'sergei' ? 'Sergei' : visitorName;

      const bubbleDiv = document.createElement('div');
      bubbleDiv.className = 'tl-message-bubble';
      bubbleDiv.textContent = text;

      contentDiv.appendChild(nameDiv);
      contentDiv.appendChild(bubbleDiv);
      msgDiv.appendChild(avatarDiv);
      msgDiv.appendChild(contentDiv);
    }

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
    if (from !== 'system') lastMessageTimestamp = Date.now();
  }

  async function sendMessage() {
    const input = document.getElementById('tlChatInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';
    addMessage(message, 'visitor');

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
      addMessage('Connection error. Please try again.', 'system');
    }
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
              addMessage(msg.text, 'sergei');
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
