// Enhanced Legal Assistant Chatbox Component - Groq Version
window.LegalChatboxGroq = function(props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState([]);
  const [inputValue, setInputValue] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);
  
  // Simple markdown parser for message formatting
  const parseMarkdown = (text) => {
    if (!text) return '';
    
    // Parse paragraphs - this is critical for readability
    text = text.replace(/\n\n/g, '</p><p>');
    
    // Parse headers
    text = text.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Parse bold and italic text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Parse bullet lists
    text = text.replace(/^\- (.*?)$/gm, '<li>$1</li>');
    text = text.replace(/<li>(.*?)<\/li>\n<li>/g, '<li>$1</li><li>');
    text = text.replace(/<li>(.*?)<\/li>(?!\n<li>)/g, '<ul><li>$1</li></ul>');
    text = text.replace(/<\/ul>\n<ul>/g, '');
    
    // Wrap in paragraph tags if not already wrapped
    if (!text.startsWith('<')) {
      text = `<p>${text}</p>`;
    }
    
    return text;
  };
  
  // Configuration from props or global config
  const config = props || window.chatboxConfig || {};
  const contractType = config.contractType || 'Strategic NDA';
  const formData = config.formData || {};
  const documentText = config.documentText || '';
  const apiUrl = config.apiUrl || window.location.origin + '/api/nda-groq-chat';

  // Track previous form data to calculate deltas for token optimization
  const [prevFormData, setPrevFormData] = React.useState({});
  const [conversationStarted, setConversationStarted] = React.useState(false);
  
  // Track conversation history
  const [conversationHistory, setConversationHistory] = React.useState([]);
  
  // Side letter tracked separately for important context
  const [sideLetterContext, setSideLetterContext] = React.useState({
    enabled: false,
    disclosingParty: '',
    receivingParty: '',
    disclosingPartyPseudonym: '',
    receivingPartyPseudonym: ''
  });

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
      const currentFormData = window.chatboxConfig && window.chatboxConfig.formData ? window.chatboxConfig.formData : formData;
      const currentDocumentText = window.chatboxConfig && window.chatboxConfig.documentText ? window.chatboxConfig.documentText : documentText;
      
      // Validate essential fields are present
      if (!currentFormData.term && userMessage.toLowerCase().includes('term') || userMessage.toLowerCase().includes('duration') || userMessage.toLowerCase().includes('long')) {
        console.warn('User asking about term but term not specified in form data');
      }
      
      // Calculate form data changes (delta) if not first message
      let formDataToSend = {};
      let documentTextToSend = '';
      let sideLetterInfo = {}; // Special handling for side letter text
      
      if (!conversationStarted) {
        // First message - send full context but only essential fields
        formDataToSend = {
          // Core agreement details
          term: currentFormData.term,
          termUnit: currentFormData.termUnit,
          state: currentFormData.state,
          purpose: currentFormData.purpose,
          
          // Party information
          disclosingPartyType: currentFormData.disclosingPartyType,
          disclosingPartyName: currentFormData.disclosingPartyName,
          receivingPartyType: currentFormData.receivingPartyType,
          receivingPartyName: currentFormData.receivingPartyName,
          
          // Critical flags
          usePseudonyms: currentFormData.usePseudonyms,
          
          // If pseudonyms are used, include pseudonym data
          ...(currentFormData.usePseudonyms ? {
            disclosingPartyPseudonym: currentFormData.disclosingPartyPseudonym,
            receivingPartyPseudonym: currentFormData.receivingPartyPseudonym
          } : {}),
          
          // Section-specific configurations for context
          confidentialInfoType: currentFormData.confidentialInfoType, // Section 1/2
          exclusions: {
            publicDomain: currentFormData.publicDomainExclusion,
            independentDevelopment: currentFormData.independentDevelopmentExclusion,
            rightfulPossession: currentFormData.rightfulPossessionExclusion
          }, // Section 2/3
          obligations: {
            nonDisclosure: currentFormData.nonDisclosure,
            nonUse: currentFormData.nonUse,
            returnDocuments: currentFormData.returnDocuments
          }, // Section 3/4
          remedies: {
            injunctiveRelief: currentFormData.injunctiveRelief,
            monetaryDamages: currentFormData.monetaryDamages,
            liquidatedDamages: currentFormData.liquidatedDamages,
            liquidatedDamagesAmount: currentFormData.liquidatedDamagesAmount
          }, // Section 6/7
          disputeResolution: currentFormData.disputeResolution, // Section 7/8
          arbitrationProvider: currentFormData.arbitrationProvider,
          monetaryConsideration: currentFormData.monetaryConsideration,
          considerationAmount: currentFormData.considerationAmount
        };
        
        // Send full document text only for the first message
        documentTextToSend = currentDocumentText;
        
        // Track side letter context
        if (currentFormData.usePseudonyms) {
          setSideLetterContext({
            enabled: true,
            disclosingParty: currentFormData.disclosingPartyName,
            receivingParty: currentFormData.receivingPartyName,
            disclosingPartyPseudonym: currentFormData.disclosingPartyPseudonym,
            receivingPartyPseudonym: currentFormData.receivingPartyPseudonym
          });
        }
        
        setConversationStarted(true);
        console.log('First message, sending full document and optimized context');
      } else {
        // Follow-up message - only send changes, NO document text
        const changedFields = {};
        const affectedSections = new Set();
        
        // Determine which fields have changed and which sections are affected
        Object.keys(currentFormData).forEach(key => {
          // Check if field has changed from previous version
          if (JSON.stringify(currentFormData[key]) !== JSON.stringify(prevFormData[key])) {
            changedFields[key] = currentFormData[key];
            
            // Map field changes to affected sections
            const sectionOffset = currentFormData.usePseudonyms ? 1 : 0;
            
            if (['disclosingPartyName', 'receivingPartyName', 'disclosingPartyPseudonym', 'receivingPartyPseudonym', 'usePseudonyms'].includes(key)) {
              if (currentFormData.usePseudonyms) {
                affectedSections.add('Section 1 (Identity of Parties)');
                affectedSections.add('Exhibit A (Side Letter)');
              }
            }
            
            if (key.includes('confidentialInfo') || key.includes('Info')) {
              affectedSections.add(`Section ${1 + sectionOffset} (Definition of Confidential Information)`);
            }
            
            if (key.includes('Exclusion')) {
              affectedSections.add(`Section ${2 + sectionOffset} (Exclusions)`);
            }
            
            if (['nonDisclosure', 'nonUse', 'returnDocuments'].includes(key)) {
              affectedSections.add(`Section ${3 + sectionOffset} (Obligations)`);
            }
            
            if (key.includes('Carveout')) {
              affectedSections.add(`Section ${4 + sectionOffset} (Permitted Disclosures)`);
            }
            
            if (['term', 'termUnit'].includes(key)) {
              affectedSections.add(`Section ${5 + sectionOffset} (Term)`);
            }
            
            if (key.includes('Relief') || key.includes('Damages')) {
              affectedSections.add(`Section ${6 + sectionOffset} (Remedies)`);
            }
            
            if (key.includes('dispute') || key.includes('arbitration')) {
              affectedSections.add(`Section ${7 + sectionOffset} (Dispute Resolution)`);
            }
            
            if (['state', 'attorneyFees', 'severability', 'entireAgreement'].includes(key)) {
              affectedSections.add(`Section ${8 + sectionOffset} (Miscellaneous)`);
            }
            
            // Special case for pseudonyms
            if (key === 'usePseudonyms') {
              if (currentFormData[key]) {
                setSideLetterContext({
                  enabled: true,
                  disclosingParty: currentFormData.disclosingPartyName,
                  receivingParty: currentFormData.receivingPartyName,
                  disclosingPartyPseudonym: currentFormData.disclosingPartyPseudonym || '',
                  receivingPartyPseudonym: currentFormData.receivingPartyPseudonym || ''
                });
              } else {
                setSideLetterContext({
                  enabled: false,
                  disclosingParty: '',
                  receivingParty: '',
                  disclosingPartyPseudonym: '',
                  receivingPartyPseudonym: ''
                });
              }
            }
            
            // If pseudonym fields change, update side letter context
            if (key === 'disclosingPartyPseudonym' || key === 'receivingPartyPseudonym' || 
                key === 'disclosingPartyName' || key === 'receivingPartyName') {
              if (currentFormData.usePseudonyms) {
                setSideLetterContext(prev => ({
                  ...prev,
                  [key]: currentFormData[key]
                }));
              }
            }
          }
        });
        
        // For follow-up messages, always include essential fields plus changes
        formDataToSend = {
          // Always include essential context fields
          term: currentFormData.term,
          termUnit: currentFormData.termUnit,
          state: currentFormData.state,
          purpose: currentFormData.purpose,
          usePseudonyms: currentFormData.usePseudonyms,
          disclosingPartyName: currentFormData.disclosingPartyName,
          receivingPartyName: currentFormData.receivingPartyName,
          monetaryConsideration: currentFormData.monetaryConsideration,
          considerationAmount: currentFormData.considerationAmount,
          disputeResolution: currentFormData.disputeResolution,
          
          // Include changed fields
          ...changedFields,
          
          // Include which sections were affected by the changes
          affectedSections: Array.from(affectedSections).join(', ')
        };
        
        // No document text for follow-up messages
        documentTextToSend = '';
        
        console.log('Follow-up message, sending essential context plus changes');
        console.log('Current term value:', currentFormData.term, currentFormData.termUnit);
        console.log('Changed fields:', Object.keys(changedFields));
        console.log('Affected sections:', Array.from(affectedSections));
      }
      
      // Update previous form data for next comparison
      setPrevFormData(currentFormData);
      
      // Add current exchange to conversation history
      const newHistoryItem = { role: "user", content: userMessage };
      const updatedHistory = [...conversationHistory, newHistoryItem];
      setConversationHistory(updatedHistory);
      
      // Create special field for side letter content if pseudonyms are enabled
      if (sideLetterContext.enabled) {
        sideLetterInfo = { 
          sideLetterEnabled: true,
          sideLetterParties: {
            disclosingParty: sideLetterContext.disclosingParty,
            receivingParty: sideLetterContext.receivingParty,
            disclosingPartyPseudonym: sideLetterContext.disclosingPartyPseudonym,
            receivingPartyPseudonym: sideLetterContext.receivingPartyPseudonym
          }
        };
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          contractType: contractType,
          formData: formDataToSend,
          // Only send document text for the first message
          documentText: documentTextToSend,
          sideLetterInfo: sideLetterInfo,
          conversationHistory: updatedHistory.slice(-4), // Send last 4 exchanges only
          isFollowUpQuestion: conversationStarted
        }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Add response to conversation history
      setConversationHistory([...updatedHistory, { role: "assistant", content: data.response }]);
      
      // Add to messages for display
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
    "What does Section 2 cover? (Confidential Information)",
    "How long does Section 6 make this last? (Term)",
    "What are my Section 4 obligations? (Receiving Party)",
    "When does Section 5 allow disclosure? (Legal Carveouts)",
    "What remedies are in Section 7? (Breach remedies)"
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
            `Hello! I'm your Strategic NDA legal assistant. I can help explain specific sections, clauses, and provisions of your ${contractType}. Each section has been carefully crafted based on legal best practices and lessons from cases like the Stormy Daniels NDA. Ask me anything about your agreement!`
          ),
          React.createElement('div', { className: 'quick-actions' },
            React.createElement('p', { style: { fontSize: '12px', color: '#6b7280', marginBottom: '8px' } }, 
              'Quick section questions:'
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
            style: message.error ? { borderLeft: '3px solid #ef4444' } : {},
            dangerouslySetInnerHTML: { 
              __html: message.type === 'assistant' ? parseMarkdown(message.content) : message.content 
            }
          })
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