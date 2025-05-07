// Function to generate MS Word document
function generateWordDoc(ndaText, formData) {
  const { Document, Paragraph, TextRun, PageBreak, HeadingLevel } = docx;
  
  // Create new document
  const doc = new Document({
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
    new Paragraph({
      text: "MUTUAL NON-DISCLOSURE AGREEMENT",
      heading: HeadingLevel.HEADING_1,
      alignment: "center",
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
        new Paragraph({
          children: [new TextRun(para)],
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
      // Add a page break before the side letter
      new Paragraph({
        children: [
          new TextRun({
            text: "",
            break: 1
          })
        ]
      }),
      new Paragraph({
        text: "EXHIBIT A - IDENTITY CONFIRMATION LETTER",
        heading: HeadingLevel.HEADING_1,
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
          new Paragraph({
            children: [new TextRun(para)],
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
  
  // Generate and save document
  docx.Packer.toBlob(doc).then(blob => {
    saveAs(blob, "NDA-Agreement.docx");
  });
}
