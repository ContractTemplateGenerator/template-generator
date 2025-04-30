import { useState } from 'react'

function App() {
  const [partyName, setPartyName] = useState('');
  const [output, setOutput] = useState('');

  function generateClause() {
    setOutput(\`The party, \${partyName}, agrees to maintain confidentiality of all proprietary information.\`);
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Confidentiality Clause Generator</h1>
      <input
        type="text"
        placeholder="Enter Party Name"
        value={partyName}
        onChange={(e) => setPartyName(e.target.value)}
        style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={generateClause} style={{ padding: '8px 16px' }}>Generate</button>
      {output && (
        <div style={{ marginTop: 20, background: '#f0f0f0', padding: 15, borderRadius: 5 }}>
          <strong>Clause Output:</strong>
          <p>{output}</p>
        </div>
      )}
    </div>
  );
}

export default App;
