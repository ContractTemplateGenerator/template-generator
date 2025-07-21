// Word document generation function
const generateWordDocument = async (documentText, formData) => {
    try {
        // Check if docx is available
        if (!window.docx) {
            throw new Error('DOCX library not loaded');
        }

        console.log('Generating Word document...');
        
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });

        // Create document sections
        const children = [];

        // Title
        children.push(
            new docx.Paragraph({
                children: [
                    new docx.TextRun({
                        text: "MARKETPLACE SELLER AGREEMENT",
                        bold: true,
                        size: 28,
                        font: "Calibri"
                    })
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: { before: 0, after: 400 }
            })
        );

        // Date
        children.push(
            new docx.Paragraph({
                children: [
                    new docx.TextRun({
                        text: `Date: ${currentDate}`,
                        size: 22,
                        font: "Calibri"
                    })
                ],
                alignment: docx.AlignmentType.CENTER,
                spacing: { after: 600 }
            })
        );

        // Split document text into sections by double newlines
        const sections = documentText.split('\n\n');
        
        sections.forEach(section => {
            section = section.trim();
            if (!section) return;
            
            // Check if this is a heading (starts with number or all caps)
            const isHeading = /^(\d+\.|\d+\.\d+\.|\b[A-Z\s]{3,}\b)/.test(section);
            
            if (isHeading) {
                children.push(
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: section,
                                bold: true,
                                size: 24,
                                font: "Calibri"
                            })
                        ],
                        spacing: { before: 300, after: 200 }
                    })
                );
            } else {
                children.push(
                    new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: section,
                                size: 22,
                                font: "Calibri"
                            })
                        ],
                        spacing: { after: 200 }
                    })
                );
            }
        });

        // Create the document
        const doc = new docx.Document({
            styles: {
                default: {
                    document: {
                        run: {
                            font: "Calibri",
                            size: 22
                        },
                        paragraph: {
                            spacing: { line: 360, before: 0, after: 0 }
                        }
                    }
                }
            },
            sections: [{
                properties: {
                    page: {
                        margin: {
                            top: 1440,    // 1 inch
                            right: 1440,  // 1 inch  
                            bottom: 1440, // 1 inch
                            left: 1440    // 1 inch
                        }
                    }
                },
                children: children
            }]
        });

        // Generate the document buffer
        console.log('Creating document buffer...');
        const buffer = await docx.Packer.toBuffer(doc);
        
        // Create blob and download
        const blob = new Blob([buffer], { 
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
        });
        
        // Generate filename
        const marketplaceName = (formData.marketplaceName || 'Marketplace').replace(/[^a-zA-Z0-9]/g, '_');
        const dateString = new Date().toISOString().split('T')[0];
        const filename = `${marketplaceName}_Seller_Agreement_${dateString}.docx`;
        
        // Download using FileSaver.js if available, otherwise use fallback
        if (typeof saveAs === 'function') {
            saveAs(blob, filename);
            console.log('Document downloaded successfully via FileSaver');
        } else {
            // Fallback download method
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            console.log('Document downloaded successfully via fallback method');
        }
        
        // Show success message
        alert('Word document generated and downloaded successfully!');
        
    } catch (error) {
        console.error('Error generating Word document:', error);
        
        // Show helpful error message
        let errorMessage = 'Error generating Word document. ';
        
        if (error.message.includes('DOCX library not loaded')) {
            errorMessage += 'Document library failed to load. Please refresh the page and try again.';
        } else if (error.name === 'SecurityError') {
            errorMessage += 'Browser security restrictions. Please use the Copy button instead.';
        } else {
            errorMessage += 'Please try again or use the Copy button to get the text.';
        }
        
        alert(errorMessage);
    }
};

// Make function available globally
window.generateWordDocument = generateWordDocument;