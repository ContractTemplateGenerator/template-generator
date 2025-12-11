// Telegram Live Chat API for Terms.Law
// Handles bidirectional chat between website visitors and Telegram

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8285588033:AAHKIu3VhviuRe9aUAnDP8DrcY997lXFG9I';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '7636883052';
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// In-memory store for active conversations (resets on cold start)
// For production, use Vercel KV or similar
const conversations = new Map();

// Status: 'online' | 'available' | 'away'
// online = actively at desk (green)
// available = around but not actively watching (amber) - good for late hours
// away = offline (gray)
let status = 'away';
let lastActivity = Date.now();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action || req.body?.action;

  try {
    switch (action) {
      case 'status':
        return handleStatus(req, res);

      case 'setOnline':
        return handleSetOnline(req, res);

      case 'setStatus':
        return handleSetStatus(req, res);

      case 'send':
        return handleSendMessage(req, res);

      case 'getMessages':
        return handleGetMessages(req, res);

      case 'webhook':
        return handleTelegramWebhook(req, res);

      case 'setupWebhook':
        return handleSetupWebhook(req, res);

      default:
        return res.status(400).json({ error: 'Unknown action', validActions: ['status', 'setOnline', 'setStatus', 'send', 'getMessages', 'webhook', 'setupWebhook'] });
    }
  } catch (error) {
    console.error('Telegram chat error:', error);
    return res.status(500).json({ error: error.message });
  }
}

// Get status
function handleStatus(req, res) {
  // Auto-away after 3 hours of no activity
  const threeHours = 3 * 60 * 60 * 1000;
  if (Date.now() - lastActivity > threeHours) {
    status = 'away';
  }

  return res.status(200).json({
    status: status,
    online: status !== 'away', // backwards compatibility
    lastActivity: lastActivity
  });
}

// Legacy setOnline handler (backwards compatible)
function handleSetOnline(req, res) {
  const { online, secret } = { ...req.query, ...req.body };

  const expectedSecret = process.env.CHAT_ADMIN_SECRET || 'sergei2024';
  if (secret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const isOnline = online === 'true' || online === true;
  status = isOnline ? 'online' : 'away';
  lastActivity = Date.now();

  return res.status(200).json({
    status: status,
    online: status !== 'away',
    message: isOnline ? 'You are now online' : 'You are now offline'
  });
}

// New setStatus handler with three states
function handleSetStatus(req, res) {
  const { newStatus, secret } = { ...req.query, ...req.body };

  const expectedSecret = process.env.CHAT_ADMIN_SECRET || 'sergei2024';
  if (secret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const validStatuses = ['online', 'available', 'away'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: 'Invalid status', validStatuses });
  }

  status = newStatus;
  lastActivity = Date.now();

  const messages = {
    online: 'You are now online (green)',
    available: 'You are now available (amber)',
    away: 'You are now away (gray)'
  };

  return res.status(200).json({
    status: status,
    online: status !== 'away',
    message: messages[status]
  });
}

// Visitor sends message to Sergei
async function handleSendMessage(req, res) {
  const { visitorId, message, visitorName, visitorEmail, visitorTopic, page } = req.body;

  if (!visitorId || !message) {
    return res.status(400).json({ error: 'visitorId and message required' });
  }

  // Store conversation
  if (!conversations.has(visitorId)) {
    conversations.set(visitorId, {
      messages: [],
      visitorName: visitorName || 'Anonymous',
      visitorEmail: visitorEmail || null,
      visitorTopic: visitorTopic || null,
      page: page || 'Unknown page',
      startedAt: Date.now()
    });
  }

  const conv = conversations.get(visitorId);
  conv.messages.push({
    from: 'visitor',
    text: message,
    timestamp: Date.now()
  });

  // Format message for Telegram
  const isNewConversation = conv.messages.length === 1;
  let telegramMessage;

  const topicLabels = {
    demand: '📝 Demand Letter',
    contract: '📄 Contract',
    startup: '🚀 Startup/Formation',
    ip: '💡 IP/Trademark',
    dispute: '⚖️ Business Dispute',
    other: '❓ Other'
  };

  if (isNewConversation) {
    telegramMessage = `🆕 *New Chat*\n\n` +
      `👤 *Visitor:* ${conv.visitorName}\n` +
      (conv.visitorTopic ? `📋 *Topic:* ${topicLabels[conv.visitorTopic] || conv.visitorTopic}\n` : '') +
      (conv.visitorEmail ? `📧 *Email:* ${conv.visitorEmail}\n` : '') +
      `📄 *Page:* ${conv.page}\n` +
      `🆔 *ID:* \`${visitorId}\`\n\n` +
      `💬 *Message:*\n${message}`;
  } else {
    telegramMessage = `💬 *${conv.visitorName}* (${visitorId.slice(0, 8)}):\n\n${message}`;
  }

  // Send to Telegram
  const telegramResponse = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: telegramMessage,
      parse_mode: 'Markdown'
    })
  });

  const telegramResult = await telegramResponse.json();

  if (!telegramResult.ok) {
    console.error('Telegram send error:', telegramResult);
    return res.status(500).json({ error: 'Failed to send to Telegram', details: telegramResult });
  }

  return res.status(200).json({
    success: true,
    messageId: telegramResult.result.message_id,
    status: status,
    online: status !== 'away'
  });
}

// Visitor polls for new messages
function handleGetMessages(req, res) {
  const { visitorId, since } = { ...req.query, ...req.body };

  if (!visitorId) {
    return res.status(400).json({ error: 'visitorId required' });
  }

  const conv = conversations.get(visitorId);
  if (!conv) {
    return res.status(200).json({ messages: [], status: status, online: status !== 'away' });
  }

  const sinceTimestamp = parseInt(since) || 0;
  const newMessages = conv.messages.filter(m => m.timestamp > sinceTimestamp);

  return res.status(200).json({
    messages: newMessages,
    status: status,
    online: status !== 'away'
  });
}

// Telegram webhook - receives Sergei's replies
async function handleTelegramWebhook(req, res) {
  const update = req.body;

  // Handle message from Sergei
  if (update.message && update.message.chat.id.toString() === TELEGRAM_CHAT_ID) {
    const text = update.message.text;
    const replyTo = update.message.reply_to_message;

    // If replying to a message, extract visitor ID
    if (replyTo && replyTo.text) {
      const idMatch = replyTo.text.match(/🆔 \*ID:\* `([^`]+)`/) ||
                      replyTo.text.match(/\(([a-f0-9_-]+)\)/i);

      if (idMatch) {
        const visitorId = idMatch[1];
        const conv = conversations.get(visitorId);

        if (conv) {
          conv.messages.push({
            from: 'sergei',
            text: text,
            timestamp: Date.now()
          });

          lastActivity = Date.now();

          // Confirm receipt
          await fetch(`${TELEGRAM_API}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: `✅ Reply sent to ${conv.visitorName}`,
              reply_to_message_id: update.message.message_id
            })
          });
        }
      }
    }

    // Handle commands
    if (text === '/online') {
      status = 'online';
      lastActivity = Date.now();
      await sendTelegramMessage('🟢 You are now *online*. Green status - visitors see you\'re at your desk.');
    } else if (text === '/available') {
      status = 'available';
      lastActivity = Date.now();
      await sendTelegramMessage('🟡 You are now *available*. Amber status - visitors know you\'ll respond soon.');
    } else if (text === '/away' || text === '/offline') {
      status = 'away';
      await sendTelegramMessage('⚫ You are now *away*. Gray status - visitors see you\'re offline.');
    } else if (text === '/status') {
      const activeChats = conversations.size;
      const statusEmoji = { online: '🟢', available: '🟡', away: '⚫' };
      await sendTelegramMessage(
        `📊 *Status*\n\n` +
        `Status: ${statusEmoji[status]} ${status}\n` +
        `Active chats: ${activeChats}\n` +
        `Last activity: ${new Date(lastActivity).toLocaleString()}\n\n` +
        `Commands:\n` +
        `/online - Green (at desk)\n` +
        `/available - Amber (around)\n` +
        `/away - Gray (offline)`
      );
    }
  }

  return res.status(200).json({ ok: true });
}

// Setup webhook (call once)
async function handleSetupWebhook(req, res) {
  const { secret } = { ...req.query, ...req.body };

  const expectedSecret = process.env.CHAT_ADMIN_SECRET || 'sergei2024';
  if (secret !== expectedSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Determine webhook URL from request
  const host = req.headers.host || 'template-generator-aob3.vercel.app';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const webhookUrl = `${protocol}://${host}/api/telegram-chat?action=webhook`;

  const response = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message']
    })
  });

  const result = await response.json();

  return res.status(200).json({
    success: result.ok,
    webhookUrl,
    telegramResponse: result
  });
}

// Helper to send message to Telegram
async function sendTelegramMessage(text) {
  return fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    })
  });
}
