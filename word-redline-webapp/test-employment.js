/**
 * Test the improved document processing with employment agreement-style instructions
 */

const fs = require('fs');
const path = require('path');
const { processWordDocument } = require('./wordProcessor');

async function testEmploymentProcessing() {
    try {
        console.log('Testing employment agreement processing...');
        
        const inputPath = path.join(__dirname, 'test-document.docx');
        const outputDir = path.join(__dirname, 'processed');
        
        // Employment agreement style instructions that match the test document
        const instructions = `Change "[Employee Name]" to "Sarah Johnson"
Change "[Title]" to "Software Engineer"
Change "Employee will work on-site at the Company's office during business hours" to "Employee will work on-site at the Company's office with occasional remote work as approved"
Change "$40.00 per hour" to "$50.00 per hour"
Change "PTO in accordance with California law and Company policy" to "PTO at the rate of 15 days per year"`;
        
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

testEmploymentProcessing();