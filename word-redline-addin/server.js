/**
 * Simple Express server for development
 * Serves the Word add-in files with HTTPS support
 */

const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Set proper MIME types
app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    } else if (req.url.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    } else if (req.url.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
    } else if (req.url.endsWith('.xml')) {
        res.setHeader('Content-Type', 'application/xml');
    }
    next();
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'taskpane.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Word Redline Processor Add-in Server',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Word Redline Processor Add-in Server running on port ${PORT}`);
    console.log(`📝 Manifest URL: http://localhost:${PORT}/manifest.xml`);
    console.log(`🌐 Task Pane URL: http://localhost:${PORT}/taskpane.html`);
    console.log('');
    console.log('📋 To install this add-in in Word:');
    console.log('1. Open Word');
    console.log('2. Go to Insert > My Add-ins > Shared Folder');
    console.log(`3. Browse to this folder and select manifest.xml`);
    console.log('');
    console.log('💡 For development, you can also use:');
    console.log('   Insert > My Add-ins > Upload My Add-in > Browse to manifest.xml');
});