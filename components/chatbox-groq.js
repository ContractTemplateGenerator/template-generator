// Enhanced Legal Assistant Chatbox Component - Groq Version
window.LegalChatboxGroq = function(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  
  // Configuration from props or global config
  const config = props || window.chatboxConfig || {};
  const contractType = config.contractType || 'Strategic NDA';
  const formData = config.formData || {};
  const documentText = config.documentText || '';
  const apiUrl = config.apiUrl || window.location.origin + '/api/groq-chat';

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
      console.log('Sending message to Groq:', apiUrl);
      
      // Get the most current form data and document text from the window
      const currentFormData = window.chatboxConfig ? window.chatboxConfig.formData : formData;
      const currentDocumentText = window.chatboxConfig ? window.chatboxConfig.documentText : documentText;
      
      console.log('Current form data being sent:', currentFormData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          contractType: contractType,
          formData: currentFormData,
          documentText: currentDocumentText
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
        content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
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

  // Strategic NDA specific quick actions
  const quickActions = [
    "What is the purpose of this NDA?",
    "How long does this NDA last?",
    "What happens if someone breaches this?",
    "Can I modify this template?",
    "What are my disclosure obligations?"
  ];

  const sendQuickAction = (action) => {
    setInputValue(action);
    setTimeout(() => sendMessage(), 100);
  };

  const TypingIndicator = () => (
    React.createElement('div', { className: 'message typing' },
      React.createElement('span', {}, 'Legal Assistant is analyzing...'),
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
      title: 'Chat with NDA Legal Assistant'
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
          `NDA Legal Assistant - ${contractType}`
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
            `Hello! I'm your Strategic NDA legal assistant. I can help explain clauses, suggest improvements, and answer questions about non-disclosure agreements. Ask me anything about your ${contractType}!`
          ),
          React.createElement('div', { className: 'quick-actions' },
            React.createElement('p', { style: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' } }, 
              'Common NDA questions:'
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