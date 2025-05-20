// Simple test to ensure React is working
const { useState, useEffect } = React;

const TestComponent = () => {
  const [message, setMessage] = useState('React is loading...');
  
  useEffect(() => {
    setTimeout(() => {
      setMessage('React is working! Loading full generator...');
    }, 1000);
  }, []);
  
  return React.createElement('div', {
    style: { padding: '20px', fontSize: '18px', textAlign: 'center' }
  }, message);
};

// Test render
ReactDOM.render(React.createElement(TestComponent), document.getElementById('root'));