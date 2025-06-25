/**
 * Create a Word document that matches the user's actual employment agreement content
 */

const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');

function createRealEmploymentDocument() {
    try {
        console.log('Creating realistic employment agreement document...');
        
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
        
        // Add word/document.xml with content that matches the user's actual agreement
        const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
    <w:body>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>EMPLOYMENT AGREEMENT</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>This Employment Agreement ("Agreement") is entered into as of [Date] (the "Effective Date") by and between [Employee Name] ("Employee") and EducationalCircuits LLC ("Company").</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>1. EMPLOYMENT DUTIES</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>a) Duties: Employee will serve in the position of [Title], reporting to Kevin Weekly, Owner. Employee will work on-site at the Company's office during business hours.</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>2. COMPENSATION. Employee's compensation will be $[Salary Amount] per annum, paid according to the Company's payroll schedule.</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>3. BENEFITS</w:t>
            </w:r>
        </w:p>
        <w:p>
            <w:r>
                <w:rPr>
                    <w:rFonts w:ascii="Arial" w:hAnsi="Arial"/>
                    <w:sz w:val="22"/>
                </w:rPr>
                <w:t>a) Vacation: Employee will accrue PTO in accordance with California law and Company policy.</w:t>
            </w:r>
        </w:p>
    </w:body>
</w:document>`;
        zip.file('word/document.xml', documentXml);
        
        // Generate the file
        const buffer = zip.generate({ type: 'nodebuffer' });
        const outputPath = path.join(__dirname, 'real-employment-test.docx');
        fs.writeFileSync(outputPath, buffer);
        
        console.log('Real employment agreement document created:', outputPath);
        return outputPath;
        
    } catch (error) {
        console.error('Error creating real employment document:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    createRealEmploymentDocument();
}

module.exports = { createRealEmploymentDocument };