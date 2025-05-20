// Simple test script to verify React is loading
const { useState, useEffect } = React;

const TestComponent = () => {
  const [message, setMessage] = useState('React is initializing...');
  
  useEffect(() => {
    // Change message after component mounts
    setMessage('React is working correctly!');
  }, []);
  
  return React.createElement('div', {
    style: {
      padding: '20px',
      background: '#f0f9ff',
      borderRadius: '8px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      marginTop: '20px'
    }
  }, [
    React.createElement('h2', null, message),
    React.createElement('p', null, 'If you see this message, React is working properly.'),
    React.createElement('button', {
      onClick: () => alert('Button clicked!'),
      style: {
        padding: '10px 20px',
        background: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }
    }, 'Click me to test')
  ]);
};

// Render the test component
ReactDOM.render(React.createElement(TestComponent), document.getElementById('root'));
