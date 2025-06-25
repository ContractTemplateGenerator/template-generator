/**
 * Test the document processing functionality
 */

const fs = require('fs');
const path = require('path');
const { processWordDocument } = require('./wordProcessor');

async function testProcessing() {
    try {
        console.log('Testing document processing...');
        
        const inputPath = path.join(__dirname, 'test-document.docx');
        const outputDir = path.join(__dirname, 'processed');
        const instructions = 'Change "Company" to "Client"';
        
        // Make sure directories exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        console.log('Input file:', inputPath);
        console.log('Instructions:', instructions);
        console.log('Output dir:', outputDir);
        
        // Check if input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error('Test document not found. Run create-test-doc.js first.');
        }
        
        // Process the document
        const result = await processWordDocument(inputPath, instructions, outputDir);
        console.log('Processing successful! Output:', result);
        
        // Check if output file was created
        if (fs.existsSync(result)) {
            const stats = fs.statSync(result);
            console.log('Output file size:', stats.size, 'bytes');
        } else {
            console.error('Output file was not created');
        }
        
    } catch (error) {
        console.error('Processing failed:', error);
        console.error('Stack:', error.stack);
    }
}

testProcessing();