/**
 * Terms.Law Live Chat Widget - Premium Attorney Edition
 * Streamlined, click-driven experience - minimal typing required
 * Supports English, Russian, and Spanish
 */

(function() {
  'use strict';

  const API_BASE = 'https://template-generator-aob3.vercel.app/api/telegram-chat';
  const PHOTO_URL = 'https://template.terms.law/chat-widget/sergei_small.jpg';

  let isOpen = false;
  let currentStatus = 'away';
  let chatStarted = false;
  let visitorId = localStorage.getItem('termslaw_chat_id') || generateId();
  let visitorName = '';
  let visitorEmail = '';
  let visitorTopic = '';
  let visitorSubtopic = '';
  let lastMessageTimestamp = 0;
  let pollInterval = null;
  let step = 0; // 0: topic, 1: subtopic, 2: chat
  let currentLang = localStorage.getItem('termslaw_lang') || 'en';

  localStorage.setItem('termslaw_chat_id', visitorId);

  // Language translations
  const translations = {
    en: {
      tipText: 'Chat with Sergei',
      statusOnline: 'Available now',
      statusAvailable: 'Quick response',
      statusAway: 'Usually replies in hours',
      licensed: 'Licensed',
      realPerson: 'Real Person',
      private: 'Private',
      helpQuestion: 'What can I help you with?',
      clickHint: 'Click to continue — no sign-up needed',
      back: 'Back',
      situationHint: 'What best describes your situation?',
      typeMessage: 'Type a message...',
      awayNotice: "I'm away but will see your message soon",
      availableNotice: "I'm around and will respond shortly",
      connectionError: 'Connection error. Please try again.',
      greeting: (topic, subtopic, isAway) =>
        `Hi! ${isAway ? "I'm not at my desk right now, but I'll see your message and get back to you soon. " : ''}I see you need help with: **${topic}** → "${subtopic}".\n\nTell me more about your situation and I'll let you know how I can help.`
    },
    ru: {
      tipText: 'Чат с Сергеем',
      statusOnline: 'Онлайн',
      statusAvailable: 'Скоро отвечу',
      statusAway: 'Обычно отвечаю в течение часов',
      licensed: 'Лицензия',
      realPerson: 'Живой человек',
      private: 'Конфиденциально',
      helpQuestion: 'Чем могу помочь?',
      clickHint: 'Нажмите чтобы продолжить — регистрация не нужна',
      back: 'Назад',
      situationHint: 'Что лучше описывает вашу ситуацию?',
      typeMessage: 'Введите сообщение...',
      awayNotice: 'Я сейчас отошёл, но скоро увижу ваше сообщение',
      availableNotice: 'Я рядом и скоро отвечу',
      connectionError: 'Ошибка соединения. Попробуйте ещё раз.',
      greeting: (topic, subtopic, isAway) =>
        `Привет! ${isAway ? 'Я сейчас не у компьютера, но скоро увижу ваше сообщение. ' : ''}Вижу, вам нужна помощь с: **${topic}** → "${subtopic}".\n\nРасскажите подробнее о вашей ситуации.`
    },
    es: {
      tipText: 'Chatea con Sergei',
      statusOnline: 'Disponible ahora',
      statusAvailable: 'Respuesta rápida',
      statusAway: 'Suele responder en horas',
      licensed: 'Licenciado',
      realPerson: 'Persona real',
      private: 'Privado',
      helpQuestion: '¿En qué puedo ayudarte?',
      clickHint: 'Haz clic para continuar — sin registro',
      back: 'Atrás',
      situationHint: '¿Qué describe mejor tu situación?',
      typeMessage: 'Escribe un mensaje...',
      awayNotice: 'No estoy ahora, pero veré tu mensaje pronto',
      availableNotice: 'Estoy cerca y responderé pronto',
      connectionError: 'Error de conexión. Inténtalo de nuevo.',
      greeting: (topic, subtopic, isAway) =>
        `¡Hola! ${isAway ? 'No estoy en mi escritorio ahora, pero veré tu mensaje pronto. ' : ''}Veo que necesitas ayuda con: **${topic}** → "${subtopic}".\n\nCuéntame más sobre tu situación.`
    }
  };

  // Get current translation
  const t = () => translations[currentLang];

  // Streamlined practice areas with click-through subtopics (multilingual)
  const topicsData = {
    en: {
      demand: {
        icon: '📝',
        label: 'Demand Letter',
        desc: 'Collect money owed',
        subtopics: ['Unpaid invoice', 'Contractor issue', 'Security deposit', 'Refund needed', 'Other debt']
      },
      contract: {
        icon: '📄',
        label: 'Contract',
        desc: 'Review or draft',
        subtopics: ['Review before signing', 'Draft new contract', 'Exit/terminate contract', 'Negotiate terms', 'NDA needed']
      },
      startup: {
        icon: '🚀',
        label: 'Business Formation',
        desc: 'LLC, Corp, Partnership',
        subtopics: ['Form an LLC', 'Form a Corporation', 'Partnership agreement', 'Operating agreement', 'Equity/ownership split']
      },
      ip: {
        icon: '💡',
        label: 'IP & Trademark',
        desc: 'Protect your brand',
        subtopics: ['Register trademark', 'Copyright issue', 'Someone copied me', 'Received C&D letter', 'License my IP']
      },
      dispute: {
        icon: '⚖️',
        label: 'Business Dispute',
        desc: 'Resolve conflicts',
        subtopics: ['Partner/co-founder issue', 'Customer dispute', 'Vendor problem', 'Employment matter', 'Lawsuit threat']
      },
      other: {
        icon: '💬',
        label: 'Something Else',
        desc: 'Other legal help',
        subtopics: ['General question', 'Not sure what I need', 'Need a referral', 'Quick consultation']
      }
    },
    ru: {
      demand: {
        icon: '📝',
        label: 'Претензионное письмо',
        desc: 'Взыскание долга',
        subtopics: ['Неоплаченный счёт', 'Проблема с подрядчиком', 'Залоговый депозит', 'Нужен возврат', 'Другой долг']
      },
      contract: {
        icon: '📄',
        label: 'Договор',
        desc: 'Проверка или составление',
        subtopics: ['Проверить перед подписанием', 'Составить новый договор', 'Расторгнуть договор', 'Согласовать условия', 'Нужен NDA']
      },
      startup: {
        icon: '🚀',
        label: 'Регистрация бизнеса',
        desc: 'LLC, Корпорация, Партнёрство',
        subtopics: ['Создать LLC', 'Создать корпорацию', 'Партнёрское соглашение', 'Операционное соглашение', 'Распределение долей']
      },
      ip: {
        icon: '💡',
        label: 'Интеллектуальная собственность',
        desc: 'Защита бренда',
        subtopics: ['Регистрация товарного знака', 'Вопрос авторских прав', 'Кто-то скопировал меня', 'Получил C&D письмо', 'Лицензирование']
      },
      dispute: {
        icon: '⚖️',
        label: 'Бизнес-спор',
        desc: 'Разрешение конфликтов',
        subtopics: ['Проблема с партнёром', 'Спор с клиентом', 'Проблема с поставщиком', 'Трудовой вопрос', 'Угроза иска']
      },
      other: {
        icon: '💬',
        label: 'Другое',
        desc: 'Другая юридическая помощь',
        subtopics: ['Общий вопрос', 'Не уверен что нужно', 'Нужна рекомендация', 'Быстрая консультация']
      }
    },
    es: {
      demand: {
        icon: '📝',
        label: 'Carta de demanda',
        desc: 'Cobrar deuda',
        subtopics: ['Factura impaga', 'Problema con contratista', 'Depósito de seguridad', 'Necesito reembolso', 'Otra deuda']
      },
      contract: {
        icon: '📄',
        label: 'Contrato',
        desc: 'Revisar o redactar',
        subtopics: ['Revisar antes de firmar', 'Redactar nuevo contrato', 'Terminar contrato', 'Negociar términos', 'Necesito NDA']
      },
      startup: {
        icon: '🚀',
        label: 'Formación de empresa',
        desc: 'LLC, Corp, Sociedad',
        subtopics: ['Formar una LLC', 'Formar una corporación', 'Acuerdo de socios', 'Acuerdo operativo', 'División de acciones']
      },
      ip: {
        icon: '💡',
        label: 'Propiedad intelectual',
        desc: 'Protege tu marca',
        subtopics: ['Registrar marca', 'Tema de derechos de autor', 'Alguien me copió', 'Recibí carta de cese', 'Licenciar mi PI']
      },
      dispute: {
        icon: '⚖️',
        label: 'Disputa comercial',
        desc: 'Resolver conflictos',
        subtopics: ['Problema con socio', 'Disputa con cliente', 'Problema con proveedor', 'Asunto laboral', 'Amenaza de demanda']
      },
      other: {
        icon: '💬',
        label: 'Otro tema',
        desc: 'Otra ayuda legal',
        subtopics: ['Pregunta general', 'No sé qué necesito', 'Necesito referencia', 'Consulta rápida']
      }
    }
  };

  // Get topics for current language
  const topics = () => topicsData[currentLang];

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    .tl * { box-sizing: border-box; margin: 0; padding: 0; }

    .tl-fab {
      position: fixed; bottom: 24px; right: 24px;
      width: 70px; height: 70px; border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 4px solid white;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(0,0,0,0.25);
      transition: all 0.3s ease;
      z-index: 999999;
    }
    .tl-fab:hover { transform: scale(1.08); }
    .tl-fab.open { transform: scale(0.9); opacity: 0.5; }

    .tl-fab-status {
      position: absolute; bottom: 2px; right: 2px;
      width: 20px; height: 20px; border-radius: 50%;
      background: #6b7280; border: 3px solid white;
    }
    .tl-fab-status.online { background: #22c55e; animation: pulse 2s infinite; }
    .tl-fab-status.available { background: #eab308; }
    @keyframes pulse { 50% { transform: scale(1.2); } }

    .tl-tip {
      position: absolute; right: 82px; top: 50%; transform: translateY(-50%);
      background: #1a1a2e; color: white;
      padding: 10px 16px; border-radius: 10px;
      font: 500 14px Inter, sans-serif;
      white-space: nowrap; opacity: 0; visibility: hidden;
      transition: all 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .tl-tip::after {
      content: ''; position: absolute; right: -8px; top: 50%;
      transform: translateY(-50%);
      border: 8px solid transparent; border-left-color: #1a1a2e;
    }
    .tl-fab:hover .tl-tip { opacity: 1; visibility: visible; }
    .tl-fab.open .tl-tip { display: none; }

    .tl-win {
      position: fixed; bottom: 110px; right: 24px;
      width: 380px; max-width: calc(100vw - 48px);
      background: white; border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      overflow: hidden; z-index: 999998;
      opacity: 0; visibility: hidden;
      transform: translateY(16px) scale(0.96);
      transition: all 0.3s ease;
      font-family: Inter, -apple-system, sans-serif;
    }
    .tl-win.open { opacity: 1; visibility: visible; transform: none; }

    .tl-head {
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      color: white; padding: 16px 20px;
      display: flex; align-items: center; gap: 14px;
    }
    .tl-head-photo {
      width: 52px; height: 52px; border-radius: 50%;
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid rgba(255,255,255,0.2);
      position: relative; flex-shrink: 0;
    }
    .tl-head-dot {
      position: absolute; bottom: 0; right: 0;
      width: 14px; height: 14px; border-radius: 50%;
      background: #6b7280; border: 2px solid #1a1a2e;
    }
    .tl-head-dot.online { background: #22c55e; }
    .tl-head-dot.available { background: #eab308; }
    .tl-head-info { flex: 1; }
    .tl-head-name { font-size: 17px; font-weight: 600; }
    .tl-head-sub { font-size: 12px; opacity: 0.7; margin-top: 2px; }
    .tl-head-sub a { color: inherit; text-decoration: none; }
    .tl-head-sub a:hover { text-decoration: underline; }
    .tl-head-status { font-size: 12px; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
    .tl-head-status-dot { width: 8px; height: 8px; border-radius: 50%; background: #6b7280; }
    .tl-head-status-dot.online { background: #4ade80; }
    .tl-head-status-dot.available { background: #fbbf24; }
    .tl-close {
      width: 28px; height: 28px; border-radius: 50%;
      background: rgba(255,255,255,0.1); border: none;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
    }
    .tl-close:hover { background: rgba(255,255,255,0.2); }
    .tl-close svg { width: 14px; height: 14px; fill: white; }

    .tl-body { background: #f8fafc; max-height: 450px; overflow-y: auto; }

    /* Trust strip */
    .tl-trust {
      display: flex; justify-content: center; gap: 16px;
      padding: 10px; background: white;
      border-bottom: 1px solid #eee;
      font-size: 11px; color: #666;
    }
    .tl-trust span { display: flex; align-items: center; gap: 4px; }
    .tl-trust svg { width: 12px; height: 12px; }
    .tl-trust .g svg { fill: #22c55e; }
    .tl-trust .b svg { fill: #3b82f6; }
    .tl-trust .p svg { fill: #8b5cf6; }

    /* Step content */
    .tl-step { padding: 20px; animation: fadeUp 0.3s ease; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } }

    .tl-q {
      text-align: center; margin-bottom: 16px;
      font-size: 15px; color: #333; font-weight: 500;
    }
    .tl-hint {
      text-align: center; font-size: 12px; color: #888;
      margin-bottom: 16px;
    }

    /* Topic grid */
    .tl-topics {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;
    }
    .tl-topic {
      background: white; border: 2px solid #e5e7eb;
      border-radius: 12px; padding: 14px 10px;
      cursor: pointer; text-align: center;
      transition: all 0.2s ease;
    }
    .tl-topic:hover {
      border-color: #1a1a2e; transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }
    .tl-topic-icon { font-size: 24px; margin-bottom: 6px; }
    .tl-topic-label { font-size: 13px; font-weight: 600; color: #1a1a2e; }
    .tl-topic-desc { font-size: 11px; color: #888; margin-top: 2px; }

    /* Subtopic list */
    .tl-subs { display: flex; flex-direction: column; gap: 8px; }
    .tl-sub {
      background: white; border: 2px solid #e5e7eb;
      border-radius: 10px; padding: 14px 16px;
      cursor: pointer; font-size: 14px; color: #333;
      transition: all 0.2s ease; text-align: left;
      display: flex; align-items: center; gap: 10px;
    }
    .tl-sub:hover { border-color: #1a1a2e; background: #f8fafc; }
    .tl-sub::before {
      content: '→'; color: #1a1a2e; font-weight: bold;
    }

    .tl-back {
      display: flex; align-items: center; gap: 6px;
      font-size: 12px; color: #666; cursor: pointer;
      margin-bottom: 16px; padding: 6px 0;
    }
    .tl-back:hover { color: #1a1a2e; }
    .tl-back svg { width: 14px; height: 14px; fill: currentColor; }

    /* Chat view */
    .tl-chat { display: flex; flex-direction: column; height: 420px; }
    .tl-msgs {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      background: linear-gradient(#f8fafc, white);
    }
    .tl-msg { display: flex; gap: 10px; animation: fadeUp 0.3s ease; }
    .tl-msg.v { flex-direction: row-reverse; }
    .tl-msg-ava {
      width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    }
    .tl-msg.s .tl-msg-ava {
      background: url('${PHOTO_URL}') center/cover;
      border: 2px solid #e5e7eb;
    }
    .tl-msg.v .tl-msg-ava {
      background: linear-gradient(135deg, #667eea, #764ba2);
      display: flex; align-items: center; justify-content: center;
      color: white; font-weight: 600; font-size: 12px;
    }
    .tl-msg-bub {
      max-width: 75%; padding: 10px 14px;
      border-radius: 16px; font-size: 14px; line-height: 1.5;
    }
    .tl-msg.s .tl-msg-bub {
      background: white; border: 1px solid #e5e7eb;
      border-bottom-left-radius: 4px;
    }
    .tl-msg.v .tl-msg-bub {
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      color: white; border-bottom-right-radius: 4px;
    }
    .tl-msg-sys { text-align: center; font-size: 12px; color: #999; }

    .tl-notice {
      padding: 10px 16px; font-size: 12px;
      display: flex; align-items: center; gap: 8px;
    }
    .tl-notice svg { width: 14px; height: 14px; flex-shrink: 0; }
    .tl-notice.away { background: #fef9c3; color: #92400e; }
    .tl-notice.away svg { fill: #ca8a04; }
    .tl-notice.available { background: #f0fdf4; color: #166534; }
    .tl-notice.available svg { fill: #22c55e; }

    .tl-input-bar {
      padding: 12px 16px; background: white;
      border-top: 1px solid #eee;
      display: flex; gap: 10px;
    }
    .tl-chat-in {
      flex: 1; padding: 12px 16px;
      border: 2px solid #e5e7eb; border-radius: 24px;
      font: 14px Inter; outline: none;
    }
    .tl-chat-in:focus { border-color: #1a1a2e; }
    .tl-send {
      width: 44px; height: 44px; border-radius: 50%;
      background: linear-gradient(135deg, #1a1a2e, #2d3a5a);
      border: none; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }
    .tl-send:hover { transform: scale(1.05); }
    .tl-send svg { width: 18px; height: 18px; fill: white; margin-left: 2px; }

    .tl-foot {
      padding: 8px; text-align: center;
      font-size: 10px; color: #aaa; background: #fafafa;
    }
    .tl-foot a { color: #888; text-decoration: none; }

    /* Language toggle */
    .tl-lang {
      display: flex; justify-content: center; gap: 8px;
      padding: 8px; background: #f8fafc;
      border-bottom: 1px solid #eee;
    }
    .tl-lang-btn {
      width: 32px; height: 22px; border-radius: 4px;
      border: 2px solid transparent; cursor: pointer;
      background-size: cover; background-position: center;
      opacity: 0.6; transition: all 0.2s ease;
    }
    .tl-lang-btn:hover { opacity: 0.9; transform: scale(1.1); }
    .tl-lang-btn.active { opacity: 1; border-color: #1a1a2e; transform: scale(1.1); }
    .tl-lang-btn.en {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30"><rect fill="%23002868" width="60" height="30"/><g fill="%23fff"><rect width="60" height="3.5" y="3.5"/><rect width="60" height="3.5" y="10.5"/><rect width="60" height="3.5" y="17.5"/><rect width="60" height="3.5" y="24.5"/></g><rect fill="%23bf0a30" width="60" height="3.5" y="7"/><rect fill="%23bf0a30" width="60" height="3.5" y="14"/><rect fill="%23bf0a30" width="60" height="3.5" y="21"/><rect fill="%23002868" width="24" height="16"/></svg>');
    }
    .tl-lang-btn.ru {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6"><rect fill="%23fff" width="9" height="3"/><rect fill="%230039a6" y="2" width="9" height="2"/><rect fill="%23d52b1e" y="4" width="9" height="2"/></svg>');
    }
    .tl-lang-btn.es {
      background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect fill="%23006847" width="1" height="2"/><rect fill="%23fff" x="1" width="1" height="2"/><rect fill="%23ce1126" x="2" width="1" height="2"/></svg>');
    }

    @media (max-width: 480px) {
      .tl-win { bottom: 0; right: 0; left: 0; width: 100%; max-width: 100%; border-radius: 20px 20px 0 0; }
      .tl-fab { bottom: 16px; right: 16px; width: 60px; height: 60px; }
      .tl-tip { display: none; }
      .tl-chat { height: calc(100vh - 200px); }
    }
  `;

  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  // Calendly
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

  const widget = document.createElement('div');
  widget.className = 'tl';
  widget.id = 'tlChat';
  document.body.appendChild(widget);

  let messages = [];

  function render() {
    const tr = t();
    const statusText = currentStatus === 'online' ? tr.statusOnline :
                       currentStatus === 'available' ? tr.statusAvailable : tr.statusAway;

    widget.innerHTML = `
      <button class="tl-fab ${isOpen ? 'open' : ''}" id="fab">
        <span class="tl-fab-status ${currentStatus}"></span>
        <span class="tl-tip">${tr.tipText}</span>
      </button>
      <div class="tl-win ${isOpen ? 'open' : ''}">
        <div class="tl-head">
          <div class="tl-head-photo"><span class="tl-head-dot ${currentStatus}"></span></div>
          <div class="tl-head-info">
            <div class="tl-head-name">Sergei Tokmakov</div>
            <div class="tl-head-sub">Business Attorney · <a href="https://apps.calbar.ca.gov/attorney/Licensee/Detail/279869" target="_blank">CA Bar #279869</a></div>
            <div class="tl-head-status">
              <span class="tl-head-status-dot ${currentStatus}"></span>
              ${statusText}
            </div>
          </div>
          <button class="tl-close" id="close">
            <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="tl-body">
          ${!chatStarted ? renderSteps() : renderChat()}
        </div>
        <div class="tl-foot">Direct chat by <a href="https://terms.law" target="_blank">Terms.Law</a></div>
      </div>
    `;
    attachEvents();
  }

  function renderSteps() {
    if (step === 0) return renderTopics();
    if (step === 1) return renderSubtopics();
    return '';
  }

  function renderTopics() {
    const tr = t();
    const topicsList = topics();
    return `
      <div class="tl-lang">
        <button class="tl-lang-btn en ${currentLang === 'en' ? 'active' : ''}" data-lang="en" title="English"></button>
        <button class="tl-lang-btn ru ${currentLang === 'ru' ? 'active' : ''}" data-lang="ru" title="Русский"></button>
        <button class="tl-lang-btn es ${currentLang === 'es' ? 'active' : ''}" data-lang="es" title="Español"></button>
      </div>
      <div class="tl-trust">
        <span class="g"><svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> ${tr.licensed}</span>
        <span class="b"><svg viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/></svg> ${tr.realPerson}</span>
        <span class="p"><svg viewBox="0 0 20 20"><path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/></svg> ${tr.private}</span>
      </div>
      <div class="tl-step">
        <div class="tl-q">${tr.helpQuestion}</div>
        <div class="tl-hint">${tr.clickHint}</div>
        <div class="tl-topics">
          ${Object.entries(topicsList).map(([k, tp]) => `
            <div class="tl-topic" data-topic="${k}">
              <div class="tl-topic-icon">${tp.icon}</div>
              <div class="tl-topic-label">${tp.label}</div>
              <div class="tl-topic-desc">${tp.desc}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderSubtopics() {
    const tr = t();
    const topicData = topics()[visitorTopic];
    return `
      <div class="tl-step">
        <div class="tl-back" id="back">
          <svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
          ${tr.back}
        </div>
        <div class="tl-q">${topicData.icon} ${topicData.label}</div>
        <div class="tl-hint">${tr.situationHint}</div>
        <div class="tl-subs">
          ${topicData.subtopics.map(s => `<div class="tl-sub" data-sub="${s}">${s}</div>`).join('')}
        </div>
      </div>
    `;
  }

  function renderChat() {
    const tr = t();
    let notice = '';
    if (currentStatus === 'away') {
      notice = `<div class="tl-notice away">
        <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.5 2.5a1 1 0 101.414-1.414L11 9.586V6z"/></svg>
        ${tr.awayNotice}${visitorEmail ? '. ' + visitorEmail : ''}
      </div>`;
    } else if (currentStatus === 'available') {
      notice = `<div class="tl-notice available">
        <svg viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>
        ${tr.availableNotice}
      </div>`;
    }

    return `
      <div class="tl-chat">
        ${notice}
        <div class="tl-msgs" id="msgs"></div>
        <div class="tl-input-bar">
          <input class="tl-chat-in" id="chatIn" placeholder="${tr.typeMessage}">
          <button class="tl-send" id="sendBtn">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    `;
  }

  function attachEvents() {
    const fab = document.getElementById('fab');
    const close = document.getElementById('close');
    if (fab) fab.onclick = () => { isOpen = !isOpen; render(); };
    if (close) close.onclick = () => { isOpen = false; render(); };

    // Language toggle
    document.querySelectorAll('.tl-lang-btn').forEach(el => {
      el.onclick = () => {
        currentLang = el.dataset.lang;
        localStorage.setItem('termslaw_lang', currentLang);
        render();
      };
    });

    // Topic cards
    document.querySelectorAll('.tl-topic').forEach(el => {
      el.onclick = () => {
        visitorTopic = el.dataset.topic;
        step = 1;
        render();
      };
    });

    // Back button
    const back = document.getElementById('back');
    if (back) back.onclick = () => { step = 0; render(); };

    // Subtopic selection - starts chat immediately
    document.querySelectorAll('.tl-sub').forEach(el => {
      el.onclick = () => {
        visitorSubtopic = el.dataset.sub;
        startChat();
      };
    });

    // Chat
    const chatIn = document.getElementById('chatIn');
    const sendBtn = document.getElementById('sendBtn');
    if (chatIn) {
      chatIn.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };
      setTimeout(() => chatIn.focus(), 100);
    }
    if (sendBtn) sendBtn.onclick = sendMessage;

    // Render messages
    if (chatStarted) {
      const msgs = document.getElementById('msgs');
      if (msgs) messages.forEach(m => appendMsg(m.text, m.from));
    }
  }

  function startChat() {
    chatStarted = true;
    step = 2;
    render();

    const tr = t();
    const topicData = topics()[visitorTopic];
    const isAway = currentStatus !== 'online';
    const greeting = tr.greeting(topicData.label, visitorSubtopic, isAway);

    setTimeout(() => addMessage(greeting, 's'), 400);
    startPolling();
  }

  function addMessage(text, from) {
    messages.push({ text, from, ts: Date.now() });
    appendMsg(text, from);
    if (from !== 'sys') lastMessageTimestamp = Date.now();
  }

  function appendMsg(text, from) {
    const msgs = document.getElementById('msgs');
    if (!msgs) return;

    const div = document.createElement('div');
    if (from === 'sys') {
      div.className = 'tl-msg-sys';
      div.textContent = text;
    } else {
      div.className = `tl-msg ${from}`;
      div.innerHTML = `
        <div class="tl-msg-ava">${from === 'v' ? '?' : ''}</div>
        <div class="tl-msg-bub">${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
      `;
    }
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  async function sendMessage() {
    const chatIn = document.getElementById('chatIn');
    if (!chatIn) return;
    const text = chatIn.value.trim();
    if (!text) return;

    chatIn.value = '';
    addMessage(text, 'v');

    try {
      await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send', visitorId, visitorName, visitorEmail, visitorTopic,
          message: `[${visitorSubtopic}] ${text}`,
          page: window.location.href
        })
      });
    } catch (e) {
      addMessage(t().connectionError, 'sys');
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
            if (msg.from === 'sergei') addMessage(msg.text, 's');
            if (msg.timestamp > lastMessageTimestamp) lastMessageTimestamp = msg.timestamp;
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
    } catch (e) { currentStatus = 'away'; }
  }

  function generateId() {
    return 'v_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  checkStatus();
  setInterval(checkStatus, 30000);
  render();

})();
