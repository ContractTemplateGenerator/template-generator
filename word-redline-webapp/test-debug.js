/**
 * Debug script to test Word document processing
 */

const fs = require('fs');
const path = require('path');
const { processWordDocument } = require('./wordProcessor');

async function debugTest() {
    try {
        console.log('Starting debug test...');
        
        // Create a simple test document path
        const testInstructions = 'Change "Company" to "Client"';
        const outputDir = path.join(__dirname, 'processed');
        
        // Make sure processed directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        console.log('Test instructions:', testInstructions);
        console.log('Output directory:', outputDir);
        
        // We'll need an actual Word document to test with
        console.log('Note: Need a real .docx file to test document processing');
        
    } catch (error) {
        console.error('Debug test error:', error);
        console.error('Stack:', error.stack);
    }
}

debugTest();