/**
 * Test with the actual employment agreement content from the user
 */

const fs = require('fs');
const path = require('path');
const { processWordDocument } = require('./wordProcessor');

async function testRealEmployment() {
    try {
        console.log('Testing with real employment agreement content...');
        
        // Create a realistic employment agreement test document
        const inputPath = path.join(__dirname, 'real-employment-test.docx');
        const outputDir = path.join(__dirname, 'processed');
        
        // Instructions exactly as the user provided them
        const instructions = `Change "[Employee Name]" to "Sarah Johnson"
Change "[Title]" to "Software Engineer"
Section 1 change - "Employee will work on-site at the Company's office" to "Employee will work on-site at the Company's office with occasional remote work as approved"
Section 2  "$40.00 per hour"
Section 3 change - Increase PTO:
Change "PTO in accordance with California law and Company policy" to "PTO at the rate of 15 days per year"`;

        console.log('Instructions to process:');
        console.log(instructions);
        console.log('\n=== Analysis ===');
        
        // Parse each instruction to see what we get
        const lines = instructions.split('\n').filter(line => line.trim());
        for (const line of lines) {
            console.log(`Line: "${line.trim()}"`);
            // Use same parsing logic as in wordProcessor
            if (line.trim().toLowerCase().includes('section') && !line.trim().toLowerCase().includes('change') && !line.trim().toLowerCase().includes('to')) {
                console.log(`  → ⚠️  INCOMPLETE: This instruction is missing the replacement text`);
            } else if (line.trim().toLowerCase().startsWith('change') && line.trim().includes(' to ')) {
                console.log(`  → ✅ VALID: This is a proper change instruction`);
            } else {
                console.log(`  → ❓ UNCLEAR: May need different formatting`);
            }
        }
        
        console.log('\n=== Suggested corrections ===');
        console.log('For incomplete instructions, try these formats:');
        console.log('• Change "$40.00 per hour" to "$50.00 per hour"');
        console.log('• Change "PTO in accordance with California law and Company policy" to "PTO at the rate of 15 days per year"');
        
    } catch (error) {
        console.error('Analysis failed:', error);
    }
}

testRealEmployment();