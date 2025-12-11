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
  let isOnline = false;
  let chatStarted = false;
  let visitorId = localStorage.getItem('termslaw_chat_id') || generateId();
  let visitorName = '';
  let visitorEmail = '';
  let lastMessageTimestamp = 0;
  let pollInterval = null;

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Inject styles
  const styles = `
    .tl-chat-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .tl-chat-button:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(37, 99, 235, 0.5); }
    .tl-chat-button svg { width: 28px; height: 28px; fill: white; }
    .tl-chat-button .tl-close-icon { display: none; }
    .tl-chat-button.tl-open .tl-chat-icon { display: none; }
    .tl-chat-button.tl-open .tl-close-icon { display: block; }
    .tl-chat-status {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #6b7280;
      border: 2px solid white;
      transition: background 0.3s ease;
    }
    .tl-chat-status.tl-online { background: #10b981; animation: tl-pulse 2s infinite; }
    @keyframes tl-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    }
    .tl-chat-window {
      position: fixed;
      bottom: 100px;
      right: 24px;
      width: 380px;
      max-width: calc(100vw - 48px);
      height: 520px;
      max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(20px) scale(0.95);
      transition: all 0.3s ease;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .tl-chat-window.tl-open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }
    .tl-chat-header {
      background: linear-gradient(135deg, #2563eb, #7c3aed);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tl-chat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
    }
    .tl-chat-header-info { flex: 1; }
    .tl-chat-header-name { font-size: 1rem; font-weight: 700; }
    .tl-chat-header-status { font-size: 0.8rem; opacity: 0.9; display: flex; align-items: center; gap: 6px; }
    .tl-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #6b7280; }
    .tl-status-dot.tl-online { background: #4ade80; }
    .tl-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #f8fafc;
    }
    .tl-chat-message {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 16px;
      font-size: 0.9rem;
      line-height: 1.5;
      animation: tl-msgIn 0.3s ease;
    }
    @keyframes tl-msgIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .tl-chat-message.tl-visitor {
      align-self: flex-end;
      background: #2563eb;
      color: white;
      border-bottom-right-radius: 4px;
    }
    .tl-chat-message.tl-sergei {
      align-self: flex-start;
      background: white;
      color: #0f172a;
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 4px;
    }
    .tl-chat-message.tl-system {
      align-self: center;
      background: transparent;
      color: #64748b;
      font-size: 0.8rem;
      padding: 8px;
    }
    .tl-chat-intro {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .tl-chat-intro h4 { font-size: 1.1rem; color: #0f172a; margin-bottom: 4px; }
    .tl-chat-intro p { font-size: 0.85rem; color: #64748b; margin-bottom: 16px; }
    .tl-chat-intro-form { display: flex; flex-direction: column; gap: 12px; }
    .tl-chat-intro-input {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
    }
    .tl-chat-intro-input:focus { border-color: #2563eb; }
    .tl-chat-intro-btn {
      padding: 12px 20px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .tl-chat-intro-btn:hover { background: #1d4ed8; }
    .tl-chat-input-area {
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #e2e8f0;
    }
    .tl-chat-input-wrapper { display: flex; gap: 8px; }
    .tl-chat-input {
      flex: 1;
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
    }
    .tl-chat-input:focus { border-color: #2563eb; }
    .tl-chat-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #2563eb;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .tl-chat-send-btn:hover { background: #1d4ed8; transform: scale(1.05); }
    .tl-chat-send-btn svg { width: 20px; height: 20px; fill: white; }
    .tl-offline-notice {
      background: #fef3c7;
      color: #92400e;
      padding: 10px 16px;
      font-size: 0.8rem;
      text-align: center;
    }
    @media (max-width: 480px) {
      .tl-chat-window { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; height: 100%; max-height: 100%; border-radius: 0; }
      .tl-chat-button { bottom: 16px; right: 16px; }
    }
  `;

  // Inject CSS
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Create HTML
  const html = `
    <button class="tl-chat-button" id="tlChatButton">
      <span class="tl-chat-status" id="tlButtonStatus"></span>
      <svg class="tl-chat-icon" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      <svg class="tl-close-icon" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
    </button>
    <div class="tl-chat-window" id="tlChatWindow">
      <div class="tl-chat-header">
        <div class="tl-chat-avatar">ST</div>
        <div class="tl-chat-header-info">
          <div class="tl-chat-header-name">Sergei Tokmakov, Esq.</div>
          <div class="tl-chat-header-status">
            <span class="tl-status-dot" id="tlHeaderStatus"></span>
            <span id="tlStatusText">Checking...</span>
          </div>
        </div>
      </div>
      <div class="tl-offline-notice" id="tlOfflineNotice" style="display: none;">
        Sergei is currently offline. Leave a message and he'll respond via email.
      </div>
      <div class="tl-chat-intro" id="tlChatIntro">
        <h4>Have a quick question?</h4>
        <p>I'm a California attorney. Ask me about contracts, demand letters, business formation, or IP issues.</p>
        <form class="tl-chat-intro-form" id="tlIntroForm">
          <input type="text" class="tl-chat-intro-input" id="tlVisitorName" placeholder="Your name" required>
          <input type="email" class="tl-chat-intro-input" id="tlVisitorEmail" placeholder="Your email (optional)">
          <button type="submit" class="tl-chat-intro-btn">Start Chat</button>
        </form>
      </div>
      <div class="tl-chat-messages" id="tlChatMessages" style="display: none;">
        <div class="tl-chat-message tl-system">Chat started. Sergei will respond shortly.</div>
      </div>
      <div class="tl-chat-input-area" id="tlChatInputArea" style="display: none;">
        <div class="tl-chat-input-wrapper">
          <input type="text" class="tl-chat-input" id="tlChatInput" placeholder="Type a message...">
          <button class="tl-chat-send-btn" id="tlSendBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
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
      isOnline = data.online;
      updateStatusUI();
    } catch (error) {
      isOnline = false;
      updateStatusUI();
    }
  }

  function updateStatusUI() {
    const buttonStatus = document.getElementById('tlButtonStatus');
    const headerStatus = document.getElementById('tlHeaderStatus');
    const statusText = document.getElementById('tlStatusText');
    const offlineNotice = document.getElementById('tlOfflineNotice');

    if (isOnline) {
      buttonStatus.classList.add('tl-online');
      headerStatus.classList.add('tl-online');
      statusText.textContent = 'Online now';
      offlineNotice.style.display = 'none';
    } else {
      buttonStatus.classList.remove('tl-online');
      headerStatus.classList.remove('tl-online');
      statusText.textContent = 'Away';
      if (chatStarted) offlineNotice.style.display = 'block';
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
    if (!visitorName) return;

    chatStarted = true;
    document.getElementById('tlChatIntro').style.display = 'none';
    document.getElementById('tlChatMessages').style.display = 'flex';
    document.getElementById('tlChatInputArea').style.display = 'block';
    document.getElementById('tlChatInput').focus();
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
        isOnline = data.online;
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
