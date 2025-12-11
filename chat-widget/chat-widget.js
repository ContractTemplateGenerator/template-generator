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

  // Inject styles
  const styles = `
    .tl-chat-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e3a5f, #2d5a87);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(30, 58, 95, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      z-index: 999999;
      font-family: 'Georgia', 'Times New Roman', serif;
    }
    .tl-chat-button:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(30, 58, 95, 0.5); }
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
    .tl-chat-status.tl-online { background: #10b981; animation: tl-pulse-green 2s infinite; }
    .tl-chat-status.tl-available { background: #f59e0b; animation: tl-pulse-amber 2s infinite; }
    @keyframes tl-pulse-green {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
    }
    @keyframes tl-pulse-amber {
      0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.4); }
      50% { box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
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
      background: linear-gradient(135deg, #1e3a5f, #2d5a87);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tl-chat-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23f8fafc"/><circle cx="50" cy="38" r="18" fill="%231e3a5f"/><ellipse cx="50" cy="75" rx="28" ry="20" fill="%231e3a5f"/></svg>') center/cover;
      border: 2px solid rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      font-weight: 700;
      overflow: hidden;
    }
    .tl-chat-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .tl-chat-header-info { flex: 1; }
    .tl-chat-header-name { font-size: 1rem; font-weight: 700; font-family: 'Georgia', serif; }
    .tl-chat-header-tagline { font-size: 0.75rem; opacity: 0.85; margin-top: 2px; }
    .tl-chat-header-status { font-size: 0.8rem; opacity: 0.9; display: flex; align-items: center; gap: 6px; margin-top: 4px; }
    .tl-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #6b7280; }
    .tl-status-dot.tl-online { background: #4ade80; }
    .tl-status-dot.tl-available { background: #fbbf24; }
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
      background: #1e3a5f;
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
      text-align: center;
    }
    .tl-chat-intro {
      padding: 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
      overflow-y: auto;
    }
    .tl-intro-header {
      text-align: center;
      padding-bottom: 16px;
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 16px;
    }
    .tl-intro-photo {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin: 0 auto 12px;
      background: linear-gradient(135deg, #1e3a5f, #2d5a87);
      overflow: hidden;
    }
    .tl-intro-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .tl-intro-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      font-family: 'Georgia', serif;
    }
    .tl-intro-credentials {
      font-size: 0.8rem;
      color: #64748b;
      margin-top: 4px;
    }
    .tl-chat-intro h4 { font-size: 1rem; color: #0f172a; margin-bottom: 8px; }
    .tl-chat-intro p { font-size: 0.85rem; color: #64748b; margin-bottom: 16px; line-height: 1.5; }
    .tl-intro-tagline { text-align: center; font-size: 0.85rem; color: #64748b; margin-bottom: 16px; }
    .tl-chat-intro-form { display: flex; flex-direction: column; gap: 12px; }
    .tl-chat-intro-input {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
    }
    .tl-chat-intro-input:focus { border-color: #1e3a5f; }
    .tl-chat-intro-select {
      padding: 12px 16px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      background: white;
      cursor: pointer;
      appearance: none;
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"><path fill="%2364748b" d="M6 8L1 3h10z"/></svg>');
      background-repeat: no-repeat;
      background-position: right 16px center;
    }
    .tl-chat-intro-select:focus { border-color: #1e3a5f; }
    .tl-chat-intro-select:invalid { color: #94a3b8; }
    .tl-email-hint {
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: -8px;
    }
    .tl-chat-intro-btn {
      padding: 12px 20px;
      background: #1e3a5f;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease;
    }
    .tl-chat-intro-btn:hover { background: #2d5a87; }
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
    .tl-chat-input:focus { border-color: #1e3a5f; }
    .tl-chat-send-btn {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: #1e3a5f;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .tl-chat-send-btn:hover { background: #2d5a87; transform: scale(1.05); }
    .tl-chat-send-btn svg { width: 20px; height: 20px; fill: white; }
    .tl-status-notice {
      padding: 12px 16px;
      font-size: 0.8rem;
      line-height: 1.4;
      border-bottom: 1px solid;
    }
    .tl-status-notice.tl-away {
      background: #fef9e7;
      color: #7c6a2f;
      border-color: #f5e6a3;
    }
    .tl-status-notice.tl-available {
      background: #fffbeb;
      color: #92400e;
      border-color: #fde68a;
    }
    .tl-status-notice.tl-late {
      background: #f0f9ff;
      color: #1e5a8a;
      border-color: #bae0fd;
    }
    .tl-human-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: #ecfdf5;
      color: #047857;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      margin-left: 8px;
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
        <div class="tl-chat-avatar"><img src="https://template.terms.law/chat-widget/sergei_small.jpg" alt="Sergei Tokmakov"></div>
        <div class="tl-chat-header-info">
          <div class="tl-chat-header-name">Sergei Tokmakov, Esq.<span class="tl-human-badge">Real Person</span></div>
          <div class="tl-chat-header-tagline">California Business Attorney</div>
          <div class="tl-chat-header-status">
            <span class="tl-status-dot" id="tlHeaderStatus"></span>
            <span id="tlStatusText">Checking...</span>
          </div>
        </div>
      </div>
      <div class="tl-status-notice" id="tlStatusNotice" style="display: none;"></div>
      <div class="tl-chat-intro" id="tlChatIntro">
        <div class="tl-intro-header">
          <div class="tl-intro-photo"><img src="https://template.terms.law/chat-widget/sergei_small.jpg" alt="Sergei Tokmakov"></div>
          <div class="tl-intro-name">Sergei Tokmakov, Esq.</div>
          <div class="tl-intro-credentials">California State Bar #342637</div>
        </div>
        <p class="tl-intro-tagline">Direct line to a California business attorney — not a chatbot.</p>
        <form class="tl-chat-intro-form" id="tlIntroForm">
          <input type="text" class="tl-chat-intro-input" id="tlVisitorName" placeholder="Your first name" required>
          <select class="tl-chat-intro-select" id="tlVisitorTopic" required>
            <option value="" disabled selected>What do you need help with?</option>
            <option value="demand">Demand Letter</option>
            <option value="contract">Contract Review or Drafting</option>
            <option value="startup">Startup / Business Formation</option>
            <option value="ip">IP / Trademark / Copyright</option>
            <option value="dispute">Business Dispute</option>
            <option value="other">Other Legal Matter</option>
          </select>
          <input type="email" class="tl-chat-intro-input" id="tlVisitorEmail" placeholder="Email (optional, for follow-up)">
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
    const statusText = document.getElementById('tlStatusText');
    const statusNotice = document.getElementById('tlStatusNotice');
    const lateHours = isLateHoursPT();

    // Reset classes
    buttonStatus.classList.remove('tl-online', 'tl-available');
    headerStatus.classList.remove('tl-online', 'tl-available');
    statusNotice.classList.remove('tl-away', 'tl-available', 'tl-late');

    if (currentStatus === 'online') {
      buttonStatus.classList.add('tl-online');
      headerStatus.classList.add('tl-online');
      statusText.textContent = 'Available now';

      // Late hours notice for online status
      if (lateHours && chatStarted) {
        statusNotice.className = 'tl-status-notice tl-late';
        statusNotice.textContent = 'I work with international clients, so my hours are flexible.';
        statusNotice.style.display = 'block';
      } else {
        statusNotice.style.display = 'none';
      }
    } else if (currentStatus === 'available') {
      buttonStatus.classList.add('tl-available');
      headerStatus.classList.add('tl-available');
      statusText.textContent = 'I respond quickly';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-available';
        if (lateHours) {
          statusNotice.textContent = 'I work with international clients and check messages regularly. Demand letters, contracts, startups, IP — tell me what you need.';
        } else {
          statusNotice.textContent = 'I\'m around but may not respond instantly. Demand letters, contracts, startups, IP — tell me what you need.';
        }
        statusNotice.style.display = 'block';
      } else {
        statusNotice.style.display = 'none';
      }
    } else {
      // away
      statusText.textContent = 'Checking messages periodically';

      if (chatStarted) {
        statusNotice.className = 'tl-status-notice tl-away';
        if (visitorEmail) {
          statusNotice.innerHTML = "I'm not at my desk but check messages periodically. Demand letters, contracts, startups, IP — tell me what you need. I'll email you at <strong>" + visitorEmail + "</strong>.";
        } else {
          statusNotice.innerHTML = "I'm not at my desk but check messages periodically. Demand letters, contracts, startups, IP — tell me what you need, or <a href='#' onclick=\"Calendly.initPopupWidget({url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;\" style='color: #7c6a2f; text-decoration: underline;'>schedule a call</a>.";
        }
        statusNotice.style.display = 'block';
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
      contract: `Hi ${visitorName}! For your contract matter, please tell me: (1) What type of contract? (2) Reviewing existing or drafting new? (3) Any specific concerns or clauses?`,
      startup: `Hi ${visitorName}! For your startup/business formation: (1) What type of business? (2) How many founders/owners? (3) Which state are you forming in?`,
      ip: `Hi ${visitorName}! For your IP matter, please tell me: (1) Trademark, copyright, or patent issue? (2) Are you protecting your own IP or dealing with infringement? (3) Brief description of the IP involved.`,
      dispute: `Hi ${visitorName}! For your business dispute: (1) Who is the dispute with? (2) What is it about? (3) What outcome are you hoping for?`,
      other: `Hi ${visitorName}! Please describe your legal matter and I'll let you know how I can help.`
    };

    let welcomeMsg = topicPrompts[visitorTopic] || topicPrompts.other;

    // Add status context if not online
    if (currentStatus === 'available') {
      welcomeMsg = `Hi ${visitorName}! I'll see your message shortly. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2);
    } else if (currentStatus !== 'online') {
      welcomeMsg = `Hi ${visitorName}, I'm not at my desk but I check messages periodically. ` + welcomeMsg.substring(welcomeMsg.indexOf('!') + 2) + (visitorEmail ? " I'll follow up by email." : "");
    }

    addMessageToUI(welcomeMsg, 'tl-sergei');

    document.getElementById('tlChatInput').focus();
    updateStatusUI(); // Update to show appropriate notices
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
