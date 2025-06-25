/**
 * Create a simple Word document for testing
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function createTestDocument() {
    try {
        console.log('Creating test Word document...');
        
        // Create a new zip archive
        const zip = new PizZip();
        
        // Add [Content_Types].xml
        const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;
        zip.file('[Content_Types].xml', contentTypes);
        
        // Add _rels/.rels
        const mainRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;
        zip.file('_rels/.rels', mainRels);
        
        // Add word/document.xml with employment agreement content
        const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p>
            <w:r>
                <w:t>EMPLOYMENT AGREEMENT</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t>This agreement is between the Company and [Employee Name] for the position of [Title].</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t>Section 1: Employee will work on-site at the Company's office during business hours.</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t>Section 2: Compensation will be $40.00 per hour paid bi-weekly.</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:t>Section 3: Employee will receive PTO in accordance with California law and Company policy.</w:t>
            </w:r>
        </w:p>
    </w:body>
</w:document>`;
        zip.file('word/document.xml', documentXml);
        
        // Generate the file
        const buffer = zip.generate({ type: 'nodebuffer' });
        const outputPath = path.join(__dirname, 'test-document.docx');
        fs.writeFileSync(outputPath, buffer);
        
        console.log('Test document created:', outputPath);
        return outputPath;
        
    } catch (error) {
        console.error('Error creating test document:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    createTestDocument();
}

module.exports = { createTestDocument };