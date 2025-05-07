// Function to generate MS Word document
function generateWordDoc(ndaText, formData) {
  try {
    // Access the docx library from the window object
    const docxModule = window.docx;
    
    // Create new document
    const doc = new docxModule.Document({
      sections: [{
        properties: {},
        children: []
      }]
    });
    
    // Split main agreement text and side letter
    let mainText = ndaText;
    let sideLetterText = '';
    
    if (formData.usePseudonyms) {
      const parts = ndaText.split(/\f/);
      mainText = parts[0];
      sideLetterText = parts.length > 1 ? parts[1] : '';
    }
    
    // Title
    const mainChildren = [
      new docxModule.Paragraph({
        text: "MUTUAL NON-DISCLOSURE AGREEMENT",
        heading: docxModule.HeadingLevel.HEADING_1,
        alignment: docxModule.AlignmentType.CENTER,
        spacing: {
          before: 200,
          after: 200
        }
      })
    ];
    
    // Add main agreement paragraphs
    mainText.split('\n\n').forEach(para => {
      if (para.trim()) {
        mainChildren.push(
          new docxModule.Paragraph({
            children: [new docxModule.TextRun(para)],
            spacing: { after: 300 }
          })
        );
      }
    });
    
    // Add main document section
    doc.addSection({
      properties: {},
      children: mainChildren
    });
    
    // If using pseudonyms, add side letter on a new page with page break
    if (formData.usePseudonyms && sideLetterText) {
      const sideLetterChildren = [
        new docxModule.Paragraph({
          children: [
            new docxModule.TextRun({
              text: "",
              break: 1
            })
          ]
        }),
        new docxModule.Paragraph({
          text: "EXHIBIT A - IDENTITY CONFIRMATION LETTER",
          heading: docxModule.HeadingLevel.HEADING_1,
          alignment: docxModule.AlignmentType.LEFT,
          spacing: {
            before: 200,
            after: 200
          }
        })
      ];
      
      // Add side letter paragraphs
      sideLetterText.split('\n\n').forEach(para => {
        if (para.trim() && para !== "EXHIBIT A - IDENTITY CONFIRMATION LETTER") {
          sideLetterChildren.push(
            new docxModule.Paragraph({
              children: [new docxModule.TextRun(para)],
              spacing: { after: 300 }
            })
          );
        }
      });
      
      // Add side letter to the same section but with a page break before it
      doc.addSection({
        properties: {},
        children: sideLetterChildren
      });
    }
    
    // Generate and save document using FileSaver.js
    docxModule.Packer.toBlob(doc).then(blob => {
      window.saveAs(blob, "NDA-Agreement.docx");
    }).catch(error => {
      console.error("Error saving document:", error);
      alert("Error generating Word document. Please try again or use the copy option.");
    });
  } catch (error) {
    console.error("Error in generateWordDoc:", error);
    alert("Error generating Word document. Please try again or use the copy option.");
  }
}

// Make the function available globally
window.generateWordDoc = generateWordDoc;
