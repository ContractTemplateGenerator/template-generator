// Simple test component to verify React rendering
const TestComponent = () => {
  return React.createElement('div', { 
    style: { 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginTop: '50px'
    } 
  }, [
    React.createElement('h1', { 
      style: { color: '#3b82f6', marginBottom: '20px' } 
    }, 'California Employment Agreement Generator'),
    React.createElement('p', null, 'This is a test component to verify React is working correctly.'),
    React.createElement('button', { 
      style: {
        backgroundColor: '#3b82f6',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px'
      },
      onClick: () => alert('React is working!')
    }, 'Click me to test React')
  ]);
};

// Render the test component
document.addEventListener('DOMContentLoaded', function() {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      ReactDOM.render(
        React.createElement(TestComponent),
        rootElement
      );
      console.log("Test component rendered successfully");
    } catch (error) {
      console.error("Error rendering test component:", error);
      rootElement.innerHTML = `
        <div style="color: red; padding: 20px;">
          <h2>React Error</h2>
          <p>${error.message}</p>
        </div>
      `;
    }
  } else {
    console.error("Root element not found");
  }
});