// Legal Assistant Chatbox Component
// To use this component in your generators, include this script and the CSS file

window.LegalChatbox = function() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  
  // Props that can be passed from parent component
  const contractType = window.chatboxConfig?.contractType || 'Legal Document';
  const formData = window.chatboxConfig?.formData || {};
  const documentText = window.chatboxConfig?.documentText || '';
  const apiUrl = window.chatboxConfig?.apiUrl || '/api/chat';

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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        content: 'Sorry, I encountered an error. Please try again or contact support if the problem persists.',
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

  const TypingIndicator = () => (
    <div className="message typing">
      <span>Legal Assistant is typing</span>
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
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
        React.createElement('div', { className: 'chatbox-title' }, 'Legal Assistant'),
        React.createElement('button', {
          className: 'chatbox-close',
          onClick: () => setIsOpen(false)
        }, '×')
      ),

      // Messages
      React.createElement('div', { className: 'chatbox-messages' },
        messages.length === 0 && React.createElement('div', { className: 'chatbox-welcome' },
          `Hello! I'm here to help answer questions about your ${contractType}. Feel free to ask about any clauses, legal terms, or suggestions for improvements.`
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
          placeholder: 'Ask about this contract...',
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