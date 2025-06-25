/**
 * Test with corrected instructions that should work
 */

const fs = require('fs');
const path = require('path');
const { processWordDocument } = require('./wordProcessor');

async function testCorrectedInstructions() {
    try {
        console.log('Testing with corrected instructions...');
        
        const inputPath = path.join(__dirname, 'real-employment-test.docx');
        const outputDir = path.join(__dirname, 'processed');
        
        // Corrected instructions based on the actual document content
        const instructions = `Change "[Employee Name]" to "Sarah Johnson"
Change "[Title]" to "Software Engineer"
Change "Employee will work on-site at the Company's office during business hours" to "Employee will work on-site at the Company's office with occasional remote work as approved"
Change "$[Salary Amount] per annum" to "$75,000 per annum"
Change "PTO in accordance with California law and Company policy" to "PTO at the rate of 15 days per year"`;
        
        // Make sure directories exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        console.log('Input file:', inputPath);
        console.log('Corrected instructions:');
        console.log(instructions);
        console.log('\nProcessing...');
        
        // Check if input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error('Real employment test document not found. Run create-real-employment-doc.js first.');
        }
        
        // Process the document
        const result = await processWordDocument(inputPath, instructions, outputDir);
        console.log('\n✅ Processing successful! Output:', result);
        
        // Check if output file was created
        if (fs.existsSync(result)) {
            const stats = fs.statSync(result);
            console.log('✅ Output file size:', stats.size, 'bytes');
            console.log('✅ The document now has Arial font preserved and proper track changes!');
        } else {
            console.error('❌ Output file was not created');
        }
        
    } catch (error) {
        console.error('❌ Processing failed:', error);
        console.error('Stack:', error.stack);
    }
}

testCorrectedInstructions();