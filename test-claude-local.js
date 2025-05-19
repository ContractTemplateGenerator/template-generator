// Local test for Claude API
// Run with: node test-claude-local.js

async function testClaudeAPI() {
    const apiKey = 'YOUR_NEW_API_KEY_HERE'; // Replace with new key
    
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 50,
                messages: [{ role: 'user', content: 'Say hello' }]
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ SUCCESS! Claude API working');
            console.log('Response:', data.content[0].text);
        } else {
            console.log('❌ ERROR:', data);
        }
    } catch (error) {
        console.log('❌ NETWORK ERROR:', error.message);
    }
}

testClaudeAPI();