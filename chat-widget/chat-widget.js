/**
 * Terms.Law Live Chat Widget - Premium Attorney Edition
 * A sophisticated, personalized chat experience built by Sergei Tokmakov, Esq.
 */

(function() {
  'use strict';

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
  let currentStep = 'welcome'; // welcome, topic, details, chat

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Practice area data with rich guidance
  const practiceAreas = {
    demand: {
      icon: '📝',
      title: 'Demand Letter',
      subtitle: 'Collect money or resolve disputes',
      description: 'A formal letter demanding payment or action before taking legal steps.',
      idealFor: ['Unpaid invoices', 'Contract breaches', 'Security deposits', 'Refund disputes'],
      typicalRange: '$500 - $2,500',
      turnaround: '24-72 hours',
      questions: [
        { id: 'situation', label: 'What happened?', placeholder: 'Briefly describe the situation...', type: 'textarea' },
        { id: 'party', label: 'Who owes you / wronged you?', placeholder: 'Person or company name', type: 'input' },
        { id: 'amount', label: 'Amount or action you\'re seeking', placeholder: 'e.g., $5,000 refund', type: 'input' }
      ],
      quickPrompts: ['Unpaid invoice', 'Contractor didn\'t finish work', 'Security deposit not returned', 'Defective product/service']
    },
    contract: {
      icon: '📄',
      title: 'Contract',
      subtitle: 'Review, draft, or negotiate',
      description: 'Get contracts reviewed before signing or drafted to protect your interests.',
      idealFor: ['Business agreements', 'Employment contracts', 'NDAs', 'Partnership agreements'],
      typicalRange: '$300 - $3,000+',
      turnaround: '1-5 business days',
      questions: [
        { id: 'contractType', label: 'What type of contract?', placeholder: 'e.g., Service agreement, NDA, lease...', type: 'input' },
        { id: 'reviewOrDraft', label: 'Review existing or draft new?', placeholder: '', type: 'choice', options: ['Review existing contract', 'Draft new contract', 'Modify/negotiate terms'] },
        { id: 'concerns', label: 'Specific concerns or goals?', placeholder: 'What matters most to you...', type: 'textarea' }
      ],
      quickPrompts: ['Review before signing', 'Draft new agreement', 'Exit a contract', 'Add/remove clauses']
    },
    startup: {
      icon: '🚀',
      title: 'Startup / Formation',
      subtitle: 'Launch your business right',
      description: 'Form your LLC, corporation, or partnership with proper legal structure.',
      idealFor: ['New businesses', 'Co-founder agreements', 'Equity splits', 'Operating agreements'],
      typicalRange: '$500 - $2,500',
      turnaround: '3-7 business days',
      questions: [
        { id: 'businessType', label: 'What type of business?', placeholder: 'e.g., Tech startup, consulting, retail...', type: 'input' },
        { id: 'founders', label: 'How many founders/owners?', placeholder: '', type: 'choice', options: ['Just me (solo)', '2 partners', '3+ partners', 'Not sure yet'] },
        { id: 'state', label: 'Which state are you forming in?', placeholder: 'e.g., California, Delaware...', type: 'input' }
      ],
      quickPrompts: ['Form an LLC', 'Form a corporation', 'Co-founder agreement', 'Operating agreement']
    },
    ip: {
      icon: '💡',
      title: 'IP / Trademark',
      subtitle: 'Protect your creations',
      description: 'Trademark your brand, protect copyrights, or handle IP disputes.',
      idealFor: ['Brand names & logos', 'Copyright registration', 'IP infringement', 'Licensing'],
      typicalRange: '$500 - $2,000+',
      turnaround: 'Varies by filing',
      questions: [
        { id: 'ipType', label: 'What type of IP matter?', placeholder: '', type: 'choice', options: ['Trademark (brand/logo)', 'Copyright', 'Patent question', 'IP infringement'] },
        { id: 'protectOrDefend', label: 'Protecting your IP or responding to a claim?', placeholder: '', type: 'choice', options: ['Protect my own IP', 'Someone is infringing my IP', 'I received a cease & desist', 'Licensing question'] },
        { id: 'description', label: 'Brief description', placeholder: 'Tell me about the IP involved...', type: 'textarea' }
      ],
      quickPrompts: ['Register a trademark', 'Someone copied my work', 'Cease & desist letter', 'License my IP']
    },
    dispute: {
      icon: '⚖️',
      title: 'Business Dispute',
      subtitle: 'Resolve conflicts strategically',
      description: 'Navigate business conflicts, partnership disputes, or threatened litigation.',
      idealFor: ['Partner disputes', 'Customer conflicts', 'Vendor issues', 'Employment matters'],
      typicalRange: 'Varies by complexity',
      turnaround: 'Consultation first',
      questions: [
        { id: 'disputeWith', label: 'Who is the dispute with?', placeholder: 'e.g., Business partner, vendor, customer...', type: 'input' },
        { id: 'about', label: 'What\'s it about?', placeholder: 'Briefly describe the conflict...', type: 'textarea' },
        { id: 'outcome', label: 'What outcome do you want?', placeholder: 'e.g., End partnership, get paid, settle...', type: 'input' }
      ],
      quickPrompts: ['Partnership gone bad', 'Customer threatening lawsuit', 'Vendor breach', 'Employee issue']
    },
    other: {
      icon: '💼',
      title: 'Other Matter',
      subtitle: 'Something else',
      description: 'Have a different legal question? Tell me about it.',
      idealFor: ['General legal questions', 'Referrals needed', 'Unique situations'],
      typicalRange: 'Depends on matter',
      turnaround: 'Let\'s discuss',
      questions: [
        { id: 'description', label: 'Describe your legal matter', placeholder: 'What do you need help with?', type: 'textarea' }
      ],
      quickPrompts: ['General legal question', 'Need a referral', 'Not sure what I need']
    }
  };

  // Styles
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Inter:wght@400;500;600&display=swap');

    .tl-widget * { box-sizing: border-box; margin: 0; padding: 0; }

    /* Floating Photo Button */
    .tl-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 4px solid white;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 999999;
    }
    .tl-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 12px 40px rgba(0,0,0,0.3);
    }
    .tl-fab.open { transform: scale(0.85); opacity: 0.6; }

    /* Status Badge */
    .tl-fab-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #6b7280;
      border: 4px solid white;
      transition: all 0.3s;
    }
    .tl-fab-status.online { background: #22c55e; box-shadow: 0 0 12px rgba(34,197,94,0.6); animation: pulse 2s infinite; }
    .tl-fab-status.available { background: #eab308; box-shadow: 0 0 12px rgba(234,179,8,0.5); }
    @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }

    /* Tooltip */
    .tl-fab-tooltip {
      position: absolute;
      right: 88px;
      top: 50%;
      transform: translateY(-50%);
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      color: white;
      padding: 12px 18px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    }
    .tl-fab-tooltip::after {
      content: '';
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent;
      border-left-color: #1a1a2e;
    }
    .tl-fab:hover .tl-fab-tooltip { opacity: 1; visibility: visible; }
    .tl-fab.open .tl-fab-tooltip { display: none; }

    /* Main Window */
    .tl-window {
      position: fixed;
      bottom: 116px;
      right: 28px;
      width: 420px;
      max-width: calc(100vw - 56px);
      height: 620px;
      max-height: calc(100vh - 140px);
      background: #fff;
      border-radius: 24px;
      box-shadow: 0 25px 80px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.05);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999998;
      opacity: 0;
      visibility: hidden;
      transform: translateY(24px) scale(0.94);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Inter', -apple-system, sans-serif;
    }
    .tl-window.open { opacity: 1; visibility: visible; transform: translateY(0) scale(1); }

    /* Header */
    .tl-header {
      background: linear-gradient(160deg, #1a1a2e 0%, #0f172a 100%);
      color: white;
      padding: 20px 24px;
      position: relative;
    }
    .tl-header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .tl-header-badge {
      background: rgba(255,255,255,0.1);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.65rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .tl-header-close {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: rgba(255,255,255,0.1);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .tl-header-close:hover { background: rgba(255,255,255,0.2); }
    .tl-header-close svg { width: 14px; height: 14px; fill: white; }

    .tl-header-profile {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .tl-header-photo {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 3px solid rgba(255,255,255,0.2);
      position: relative;
      flex-shrink: 0;
    }
    .tl-header-photo-status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #6b7280;
      border: 3px solid #1a1a2e;
    }
    .tl-header-photo-status.online { background: #22c55e; }
    .tl-header-photo-status.available { background: #eab308; }

    .tl-header-info h2 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .tl-header-info p {
      font-size: 0.8rem;
      opacity: 0.7;
      margin-bottom: 2px;
    }
    .tl-header-info a {
      color: inherit;
      text-decoration: none;
      opacity: 0.6;
      font-size: 0.75rem;
    }
    .tl-header-info a:hover { text-decoration: underline; }

    .tl-header-status {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 0.8rem;
    }
    .tl-header-status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #6b7280;
    }
    .tl-header-status-dot.online { background: #4ade80; box-shadow: 0 0 8px #4ade80; }
    .tl-header-status-dot.available { background: #fbbf24; box-shadow: 0 0 8px #fbbf24; }

    /* Content Area */
    .tl-content {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      background: #f8fafc;
    }

    /* Welcome Screen */
    .tl-welcome {
      padding: 24px;
      animation: fadeIn 0.4s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

    .tl-welcome-intro {
      text-align: center;
      padding: 20px;
      background: white;
      border-radius: 16px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .tl-welcome-intro h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.4rem;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .tl-welcome-intro p {
      font-size: 0.9rem;
      color: #64748b;
      line-height: 1.5;
    }

    .tl-name-input-group {
      margin-bottom: 24px;
    }
    .tl-name-input-group label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .tl-name-input {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      font-size: 1.1rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    .tl-name-input:focus {
      border-color: #1a1a2e;
      box-shadow: 0 0 0 4px rgba(26,26,46,0.08);
    }

    .tl-section-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }

    /* Practice Area Cards */
    .tl-practice-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .tl-practice-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      text-align: center;
    }
    .tl-practice-card:hover {
      border-color: #1a1a2e;
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .tl-practice-card.selected {
      border-color: #1a1a2e;
      background: #1a1a2e;
      color: white;
    }
    .tl-practice-card-icon {
      font-size: 1.8rem;
      margin-bottom: 8px;
    }
    .tl-practice-card-title {
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 2px;
    }
    .tl-practice-card-sub {
      font-size: 0.7rem;
      opacity: 0.6;
    }

    /* Topic Detail Screen */
    .tl-topic-detail {
      padding: 0;
      animation: slideIn 0.4s ease;
    }
    @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }

    .tl-topic-header {
      background: white;
      padding: 20px 24px;
      border-bottom: 1px solid #e2e8f0;
    }
    .tl-topic-header-top {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .tl-back-btn {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 2px solid #e2e8f0;
      background: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .tl-back-btn:hover { border-color: #1a1a2e; }
    .tl-back-btn svg { width: 16px; height: 16px; fill: #64748b; }

    .tl-topic-title-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .tl-topic-icon { font-size: 2rem; }
    .tl-topic-title h3 {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 1.3rem;
      color: #1a1a2e;
    }
    .tl-topic-title p {
      font-size: 0.8rem;
      color: #64748b;
    }

    .tl-topic-meta {
      display: flex;
      gap: 16px;
      margin-top: 16px;
      flex-wrap: wrap;
    }
    .tl-meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.75rem;
      color: #64748b;
    }
    .tl-meta-item svg { width: 14px; height: 14px; fill: #94a3b8; }
    .tl-meta-item strong { color: #1a1a2e; }

    /* Ideal For Section */
    .tl-ideal-for {
      padding: 16px 24px;
      background: #f0fdf4;
      border-bottom: 1px solid #bbf7d0;
    }
    .tl-ideal-for-title {
      font-size: 0.7rem;
      font-weight: 600;
      color: #166534;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }
    .tl-ideal-for-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tl-tag {
      background: white;
      border: 1px solid #bbf7d0;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      color: #166534;
    }

    /* Quick Prompts */
    .tl-quick-prompts {
      padding: 16px 24px;
      background: #fffbeb;
      border-bottom: 1px solid #fde68a;
    }
    .tl-quick-prompts-title {
      font-size: 0.7rem;
      font-weight: 600;
      color: #92400e;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .tl-quick-prompts-title svg { width: 14px; height: 14px; fill: #f59e0b; }
    .tl-quick-btns {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .tl-quick-btn {
      background: white;
      border: 1px solid #fde68a;
      padding: 8px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      color: #92400e;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
    }
    .tl-quick-btn:hover {
      background: #fef3c7;
      border-color: #f59e0b;
    }

    /* Form Fields */
    .tl-form-section {
      padding: 24px;
    }
    .tl-form-group {
      margin-bottom: 20px;
    }
    .tl-form-label {
      display: block;
      font-size: 0.75rem;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
    }
    .tl-form-input {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    .tl-form-input:focus {
      border-color: #1a1a2e;
      box-shadow: 0 0 0 4px rgba(26,26,46,0.08);
    }
    .tl-form-textarea {
      min-height: 100px;
      resize: vertical;
    }

    /* Choice Buttons */
    .tl-choice-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .tl-choice-btn {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      text-align: left;
      font-size: 0.9rem;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tl-choice-btn:hover {
      border-color: #1a1a2e;
      background: #f8fafc;
    }
    .tl-choice-btn.selected {
      border-color: #1a1a2e;
      background: #1a1a2e;
      color: white;
    }

    /* Start Button */
    .tl-start-btn {
      width: 100%;
      padding: 18px 24px;
      background: linear-gradient(145deg, #1a1a2e, #2d3a5a);
      color: white;
      border: none;
      border-radius: 14px;
      font-size: 1rem;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
    }
    .tl-start-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(26,26,46,0.35);
    }
    .tl-start-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Chat View */
    .tl-chat { display: flex; flex-direction: column; height: 100%; }
    .tl-messages {
      flex: 1;
      overflow-y: auto;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
    }

    .tl-msg {
      display: flex;
      gap: 12px;
      animation: msgIn 0.35s ease;
    }
    @keyframes msgIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    .tl-msg.visitor { flex-direction: row-reverse; }

    .tl-msg-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .tl-msg.sergei .tl-msg-avatar {
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid #e5e7eb;
    }
    .tl-msg.visitor .tl-msg-avatar {
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.85rem;
    }

    .tl-msg-content { max-width: 75%; }
    .tl-msg-name {
      font-size: 0.7rem;
      font-weight: 600;
      color: #9ca3af;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .tl-msg.visitor .tl-msg-name { text-align: right; }

    .tl-msg-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 0.9rem;
      line-height: 1.55;
    }
    .tl-msg.sergei .tl-msg-bubble {
      background: white;
      color: #1e293b;
      border: 1px solid #e5e7eb;
      border-bottom-left-radius: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.04);
    }
    .tl-msg.visitor .tl-msg-bubble {
      background: linear-gradient(145deg, #1a1a2e, #2d3a5a);
      color: white;
      border-bottom-right-radius: 6px;
    }

    .tl-msg-system {
      text-align: center;
      font-size: 0.8rem;
      color: #9ca3af;
      padding: 8px;
    }

    /* Status Notice */
    .tl-notice {
      padding: 12px 20px;
      font-size: 0.82rem;
      display: flex;
      align-items: center;
      gap: 10px;
      line-height: 1.4;
    }
    .tl-notice svg { width: 18px; height: 18px; flex-shrink: 0; }
    .tl-notice.away {
      background: #fef9c3;
      color: #854d0e;
      border-bottom: 1px solid #fde047;
    }
    .tl-notice.away svg { fill: #ca8a04; }
    .tl-notice.available {
      background: #f0fdf4;
      color: #166534;
      border-bottom: 1px solid #bbf7d0;
    }
    .tl-notice.available svg { fill: #22c55e; }

    /* Input Area */
    .tl-input-area {
      padding: 16px 20px;
      background: white;
      border-top: 1px solid #f0f0f0;
    }
    .tl-input-row {
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .tl-chat-input {
      flex: 1;
      padding: 14px 18px;
      border: 2px solid #e5e7eb;
      border-radius: 24px;
      font-size: 0.95rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s;
    }
    .tl-chat-input:focus {
      border-color: #1a1a2e;
      box-shadow: 0 0 0 3px rgba(26,26,46,0.08);
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
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .tl-send-btn:hover {
      transform: scale(1.08);
      box-shadow: 0 4px 16px rgba(26,26,46,0.3);
    }
    .tl-send-btn svg { width: 20px; height: 20px; fill: white; margin-left: 2px; }

    /* Footer */
    .tl-footer {
      padding: 10px;
      text-align: center;
      font-size: 0.65rem;
      color: #9ca3af;
      background: #fafafa;
      border-top: 1px solid #f0f0f0;
    }
    .tl-footer a { color: #6b7280; text-decoration: none; }
    .tl-footer a:hover { text-decoration: underline; }

    /* Trust Bar */
    .tl-trust {
      display: flex;
      justify-content: center;
      gap: 20px;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #f0f0f0;
    }
    .tl-trust-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.7rem;
      color: #6b7280;
      font-weight: 500;
    }
    .tl-trust-item svg { width: 13px; height: 13px; }
    .tl-trust-item.green svg { fill: #22c55e; }
    .tl-trust-item.blue svg { fill: #3b82f6; }
    .tl-trust-item.purple svg { fill: #8b5cf6; }

    /* Mobile */
    @media (max-width: 480px) {
      .tl-window {
        bottom: 0; right: 0; left: 0;
        width: 100%; max-width: 100%;
        height: 100%; max-height: 100%;
        border-radius: 0;
      }
      .tl-fab { bottom: 20px; right: 20px; width: 64px; height: 64px; }
      .tl-fab-tooltip { display: none; }
      .tl-practice-grid { grid-template-columns: 1fr; }
    }
  `;

  // Inject styles
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Inject Calendly
  if (!window.Calendly) {
    const link = document.createElement('link');
    link.href = 'https://assets.calendly.com/assets/external/widget.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);
  }

  // Create widget
  const widget = document.createElement('div');
  widget.className = 'tl-widget';
  widget.id = 'tlWidget';
  document.body.appendChild(widget);

  function render() {
    widget.innerHTML = `
      <button class="tl-fab ${isOpen ? 'open' : ''}" id="tlFab">
        <span class="tl-fab-status ${currentStatus}" id="tlFabStatus"></span>
        <span class="tl-fab-tooltip">Chat with Sergei</span>
      </button>
      <div class="tl-window ${isOpen ? 'open' : ''}" id="tlWindow">
        <div class="tl-header">
          <div class="tl-header-top">
            <span class="tl-header-badge">Direct Line</span>
            <button class="tl-header-close" id="tlClose">
              <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </button>
          </div>
          <div class="tl-header-profile">
            <div class="tl-header-photo">
              <span class="tl-header-photo-status ${currentStatus}" id="tlPhotoStatus"></span>
            </div>
            <div class="tl-header-info">
              <h2>Sergei Tokmakov</h2>
              <p>Business Attorney</p>
              <a href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/279869" target="_blank">CA Bar #279869</a>
              <div class="tl-header-status">
                <span class="tl-header-status-dot ${currentStatus}"></span>
                <span id="tlStatusText">${getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>
        ${renderContent()}
        <div class="tl-footer">Direct chat by <a href="https://terms.law" target="_blank">Terms.Law</a></div>
      </div>
    `;
    attachEvents();
  }

  function getStatusText() {
    if (currentStatus === 'online') return 'Available now';
    if (currentStatus === 'available') return 'Responds quickly';
    return 'Usually responds in a few hours';
  }

  function renderContent() {
    if (chatStarted) return renderChat();
    if (currentStep === 'details') return renderDetails();
    return renderWelcome();
  }

  function renderWelcome() {
    return `
      <div class="tl-content">
        <div class="tl-trust">
          <div class="tl-trust-item green">
            <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
            Licensed
          </div>
          <div class="tl-trust-item blue">
            <svg viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg>
            Real Person
          </div>
          <div class="tl-trust-item purple">
            <svg viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg>
            Private
          </div>
        </div>
        <div class="tl-welcome">
          <div class="tl-welcome-intro">
            <h3>How can I help you today?</h3>
            <p>Messages go directly to my phone — no bots, no assistants, just me.</p>
          </div>
          <div class="tl-name-input-group">
            <label>Your First Name</label>
            <input type="text" class="tl-name-input" id="tlName" placeholder="Enter your name..." value="${visitorName}">
          </div>
          <div class="tl-section-title">Select Your Legal Matter</div>
          <div class="tl-practice-grid">
            ${Object.entries(practiceAreas).map(([key, area]) => `
              <div class="tl-practice-card ${visitorTopic === key ? 'selected' : ''}" data-topic="${key}">
                <div class="tl-practice-card-icon">${area.icon}</div>
                <div class="tl-practice-card-title">${area.title}</div>
                <div class="tl-practice-card-sub">${area.subtitle}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderDetails() {
    const area = practiceAreas[visitorTopic];
    return `
      <div class="tl-content">
        <div class="tl-topic-detail">
          <div class="tl-topic-header">
            <div class="tl-topic-header-top">
              <button class="tl-back-btn" id="tlBack">
                <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              </button>
              <div class="tl-topic-title-row">
                <span class="tl-topic-icon">${area.icon}</span>
                <div class="tl-topic-title">
                  <h3>${area.title}</h3>
                  <p>${area.description}</p>
                </div>
              </div>
            </div>
            <div class="tl-topic-meta">
              <div class="tl-meta-item">
                <svg viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"/></svg>
                <span>Typical: <strong>${area.typicalRange}</strong></span>
              </div>
              <div class="tl-meta-item">
                <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 001.414-1.414L11 9.586V6z"/></svg>
                <span>Turnaround: <strong>${area.turnaround}</strong></span>
              </div>
            </div>
          </div>
          <div class="tl-ideal-for">
            <div class="tl-ideal-for-title">✓ Ideal For</div>
            <div class="tl-ideal-for-tags">
              ${area.idealFor.map(item => `<span class="tl-tag">${item}</span>`).join('')}
            </div>
          </div>
          <div class="tl-quick-prompts">
            <div class="tl-quick-prompts-title">
              <svg viewBox="0 0 20 20"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1z"/><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"/></svg>
              Quick Start — Click to use
            </div>
            <div class="tl-quick-btns">
              ${area.quickPrompts.map(prompt => `<button class="tl-quick-btn" data-prompt="${prompt}">${prompt}</button>`).join('')}
            </div>
          </div>
          <div class="tl-form-section">
            ${area.questions.map(q => renderFormField(q)).join('')}
            <div class="tl-form-group">
              <label class="tl-form-label">Email <span style="opacity:0.5;font-weight:400">(optional, for follow-up)</span></label>
              <input type="email" class="tl-form-input" id="tlEmail" placeholder="your@email.com" value="${visitorEmail}">
            </div>
            <button class="tl-start-btn" id="tlStartChat">
              Start Conversation with Sergei
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderFormField(field) {
    if (field.type === 'choice') {
      return `
        <div class="tl-form-group">
          <label class="tl-form-label">${field.label}</label>
          <div class="tl-choice-group">
            ${field.options.map(opt => `
              <button class="tl-choice-btn" data-field="${field.id}" data-value="${opt}">${opt}</button>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (field.type === 'textarea') {
      return `
        <div class="tl-form-group">
          <label class="tl-form-label">${field.label}</label>
          <textarea class="tl-form-input tl-form-textarea" id="tl_${field.id}" placeholder="${field.placeholder}"></textarea>
        </div>
      `;
    }
    return `
      <div class="tl-form-group">
        <label class="tl-form-label">${field.label}</label>
        <input type="text" class="tl-form-input" id="tl_${field.id}" placeholder="${field.placeholder}">
      </div>
    `;
  }

  function renderChat() {
    const notice = getStatusNotice();
    return `
      <div class="tl-chat">
        ${notice ? `<div class="tl-notice ${currentStatus}">${notice}</div>` : ''}
        <div class="tl-messages" id="tlMessages"></div>
        <div class="tl-input-area">
          <div class="tl-input-row">
            <input type="text" class="tl-chat-input" id="tlChatInput" placeholder="Type a message...">
            <button class="tl-send-btn" id="tlSend">
              <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function getStatusNotice() {
    if (currentStatus === 'online') return '';
    if (currentStatus === 'available') {
      return `<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg><span>I'm around and will see your message shortly.</span>`;
    }
    if (visitorEmail) {
      return `<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg><span>I'm away but will see this. I'll follow up at <strong>${visitorEmail}</strong>.</span>`;
    }
    return `<svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg><span>I'm away but check regularly. You can also <a href="#" onclick="Calendly.initPopupWidget({url:'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting'});return false;" style="color:inherit;text-decoration:underline;">schedule a call</a>.</span>`;
  }

  let messages = [];
  let formData = {};

  function attachEvents() {
    const fab = document.getElementById('tlFab');
    const close = document.getElementById('tlClose');
    if (fab) fab.onclick = toggleOpen;
    if (close) close.onclick = toggleOpen;

    // Practice cards
    document.querySelectorAll('.tl-practice-card').forEach(card => {
      card.onclick = () => {
        const name = document.getElementById('tlName');
        if (name) visitorName = name.value.trim();
        if (!visitorName) {
          name.focus();
          name.style.borderColor = '#ef4444';
          setTimeout(() => name.style.borderColor = '', 1500);
          return;
        }
        visitorTopic = card.dataset.topic;
        currentStep = 'details';
        render();
      };
    });

    // Back button
    const back = document.getElementById('tlBack');
    if (back) back.onclick = () => { currentStep = 'welcome'; render(); };

    // Choice buttons
    document.querySelectorAll('.tl-choice-btn').forEach(btn => {
      btn.onclick = () => {
        const field = btn.dataset.field;
        const value = btn.dataset.value;
        formData[field] = value;
        btn.parentElement.querySelectorAll('.tl-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      };
    });

    // Quick prompts
    document.querySelectorAll('.tl-quick-btn').forEach(btn => {
      btn.onclick = () => {
        const area = practiceAreas[visitorTopic];
        const firstTextarea = document.querySelector('.tl-form-textarea');
        if (firstTextarea) {
          firstTextarea.value = btn.dataset.prompt;
          firstTextarea.focus();
        }
      };
    });

    // Start chat
    const startBtn = document.getElementById('tlStartChat');
    if (startBtn) startBtn.onclick = startChat;

    // Chat input
    const chatInput = document.getElementById('tlChatInput');
    const sendBtn = document.getElementById('tlSend');
    if (chatInput) {
      chatInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
      chatInput.focus();
    }
    if (sendBtn) sendBtn.onclick = sendMessage;

    // Render existing messages
    if (chatStarted && messages.length) {
      const container = document.getElementById('tlMessages');
      if (container) {
        messages.forEach(m => appendMessageToDOM(m.text, m.from));
      }
    }
  }

  function toggleOpen() {
    isOpen = !isOpen;
    render();
    if (isOpen && chatStarted) {
      setTimeout(() => {
        const input = document.getElementById('tlChatInput');
        if (input) input.focus();
      }, 100);
    }
  }

  function startChat() {
    const emailEl = document.getElementById('tlEmail');
    if (emailEl) visitorEmail = emailEl.value.trim();

    // Collect form data
    const area = practiceAreas[visitorTopic];
    area.questions.forEach(q => {
      const el = document.getElementById(`tl_${q.id}`);
      if (el) formData[q.id] = el.value.trim();
    });

    chatStarted = true;
    currentStep = 'chat';
    render();

    // Build welcome message
    let welcomeMsg = `Hi ${visitorName}! `;
    if (currentStatus !== 'online') {
      welcomeMsg += `I'm not at my desk right now, but I'll see your message and respond as soon as I can. `;
    }
    welcomeMsg += `Thanks for reaching out about your ${area.title.toLowerCase()}. `;

    // Add collected info
    const details = Object.entries(formData).filter(([k, v]) => v).map(([k, v]) => v).join(' | ');
    if (details) {
      welcomeMsg += `\n\nI see: "${details}"\n\n`;
    }
    welcomeMsg += `Is there anything else you'd like to add, or any questions before we proceed?`;

    setTimeout(() => addMessage(welcomeMsg, 'sergei'), 500);
    startPolling();
  }

  function addMessage(text, from) {
    messages.push({ text, from, timestamp: Date.now() });
    appendMessageToDOM(text, from);
    if (from !== 'system') lastMessageTimestamp = Date.now();
  }

  function appendMessageToDOM(text, from) {
    const container = document.getElementById('tlMessages');
    if (!container) return;

    const div = document.createElement('div');
    if (from === 'system') {
      div.className = 'tl-msg-system';
      div.textContent = text;
    } else {
      div.className = `tl-msg ${from}`;
      div.innerHTML = `
        <div class="tl-msg-avatar">${from === 'visitor' ? getInitial() : ''}</div>
        <div class="tl-msg-content">
          <div class="tl-msg-name">${from === 'sergei' ? 'Sergei' : visitorName}</div>
          <div class="tl-msg-bubble">${text}</div>
        </div>
      `;
    }
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  async function sendMessage() {
    const input = document.getElementById('tlChatInput');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addMessage(text, 'visitor');

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
          message: text,
          page: window.location.href
        })
      });
    } catch (e) {
      addMessage('Connection error. Please try again.', 'system');
    }
  }

  function startPolling() {
    if (pollInterval) return;
    pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}?action=getMessages&visitorId=${visitorId}&since=${lastMessageTimestamp}`);
        const data = await res.json();
        currentStatus = data.status || (data.online ? 'online' : 'away');
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
      } catch (e) {}
    }, 3000);
  }

  async function checkStatus() {
    try {
      const res = await fetch(`${API_BASE}?action=status`);
      const data = await res.json();
      currentStatus = data.status || (data.online ? 'online' : 'away');
      render();
    } catch (e) {
      currentStatus = 'away';
    }
  }

  function generateId() {
    return 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  function getInitial() {
    return visitorName ? visitorName.charAt(0).toUpperCase() : '?';
  }

  // Initialize
  checkStatus();
  setInterval(checkStatus, 30000);
  render();

})();
