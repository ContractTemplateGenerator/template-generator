// Enhanced Legal Assistant Chatbox Component
window.LegalChatbox = function(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  
  // Configuration from props or global config
  const config = props || window.chatboxConfig || {};
  const contractType = config.contractType || 'Legal Document';
  const formData = config.formData || {};
  const documentText = config.documentText || '';
  const apiUrl = config.apiUrl || window.location.origin + '/api/chat';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      console.log('Sending message to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          contractType: contractType,
          formData: formData,
          documentText: documentText
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: data.response,
        timestamp: data.timestamp 
      }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: `Sorry, I encountered an error: ${error.message}. Please try again or check if the API is working properly.`,
        error: true 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    "What does this clause mean?",
    "How can I make this more protective?",
    "What are the risks here?",
    "Is this legally enforceable?"
  ];

  const sendQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => sendMessage(), 100);
  };

  const TypingIndicator = () => (
    React.createElement('div', { className: 'message typing' },
      React.createElement('span', {}, 'Legal Assistant is typing'),
      React.createElement('div', { className: 'typing-indicator' },
        React.createElement('div', { className: 'typing-dot' }),
        React.createElement('div', { className: 'typing-dot' }),
        React.createElement('div', { className: 'typing-dot' })
      )
    )
  );

  return React.createElement('div', { className: 'chatbox-container' },
    // Toggle Button
    React.createElement('button', {
      className: 'chatbox-toggle',
      onClick: () => setIsOpen(!isOpen),
      title: 'Chat with Legal Assistant'
    }, 
      React.createElement('svg', {
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round'
      },
        React.createElement('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
      )
    ),

    // Chat Window
    isOpen && React.createElement('div', { className: 'chatbox-window' },
      // Header
      React.createElement('div', { className: 'chatbox-header' },
        React.createElement('div', { className: 'chatbox-title' }, 
          `Legal Assistant - ${contractType}`
        ),
        React.createElement('button', {
          className: 'chatbox-close',
          onClick: () => setIsOpen(false)
        }, '×')
      ),

      // Messages
      React.createElement('div', { className: 'chatbox-messages' },
        messages.length === 0 && React.createElement('div', { className: 'chatbox-welcome' },
          React.createElement('div', { style: { marginBottom: '15px' } },
            `Hello! I'm here to help answer questions about your ${contractType}. Feel free to ask about any clauses, legal terms, or suggestions for improvements.`
          ),
          React.createElement('div', { className: 'quick-actions' },
            React.createElement('p', { style: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' } }, 
              'Quick questions:'
            ),
            ...quickActions.map((action, index) =>
              React.createElement('button', {
                key: index,
                className: 'quick-action-btn',
                onClick: () => sendQuickAction(action)
              }, action)
            )
          )
        ),
        ...messages.map((message, index) =>
          React.createElement('div', {
            key: index,
            className: `message ${message.type}`,
            style: message.error ? { borderLeft: '3px solid #ef4444' } : {}
          }, message.content)
        ),
        isLoading && React.createElement(TypingIndicator),
        React.createElement('div', { ref: messagesEndRef })
      ),

      // Input
      React.createElement('div', { className: 'chatbox-input-container' },
        React.createElement('textarea', {
          className: 'chatbox-input',
          value: inputValue,
          onChange: (e) => setInputValue(e.target.value),
          onKeyPress: handleKeyPress,
          placeholder: `Ask about your ${contractType}...`,
          disabled: isLoading,
          rows: 1
        }),
        React.createElement('button', {
          className: 'chatbox-send',
          onClick: sendMessage,
          disabled: isLoading || !inputValue.trim()
        }, 
          React.createElement('svg', {
            width: '16',
            height: '16',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            strokeWidth: '2',
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          },
            React.createElement('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
            React.createElement('polygon', { points: '22,2 15,22 11,13 2,9' })
          )
        )
      )
    )
  );
};