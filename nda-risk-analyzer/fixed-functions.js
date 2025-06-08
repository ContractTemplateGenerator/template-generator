// Fixed functions for NDA analyzer

// Enhanced preview text generation with better debugging
const generatePreviewTextFixed = () => {
    let previewText = ndaText;
    const allSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral];
    
    console.log("=== PREVIEW TEXT GENERATION ===");
    console.log("Original text length:", ndaText.length);
    console.log("Total suggestions:", allSuggestions.length);
    console.log("Selected changes:", Object.keys(selectedChanges).filter(key => selectedChanges[key]));
    
    // Apply selected changes
    allSuggestions.forEach((suggestion, index) => {
        if (selectedChanges[suggestion.id] && suggestion.originalText && suggestion.improvedText) {
            const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
            const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
            
            console.log(`Change ${index + 1}:`, cleanOriginal, "->", cleanImproved);
            
            // Try exact match first
            if (previewText.includes(cleanOriginal)) {
                previewText = previewText.replace(cleanOriginal, cleanImproved);
                console.log("✓ Applied exact match");
            } else {
                // Try partial match
                const words = cleanOriginal.split(' ');
                if (words.length > 3) {
                    const partialMatch = words.slice(0, Math.min(5, words.length)).join(' ');
                    if (previewText.includes(partialMatch)) {
                        previewText = previewText.replace(partialMatch, cleanImproved);
                        console.log("✓ Applied partial match");
                    } else {
                        console.log("✗ No match found");
                    }
                } else {
                    console.log("✗ No match found for short text");
                }
            }
        }
    });
    
    console.log("Final preview text length:", previewText.length);
    return previewText;
};

// Fixed RTF download with proper redlining
const downloadAsWordFixed = () => {
    const selectedSuggestions = [...suggestions.quickFixes, ...suggestions.party1, ...suggestions.party2, ...suggestions.neutral]
        .filter(s => selectedChanges[s.id]);
    
    if (selectedSuggestions.length === 0) {
        alert('Please select at least one improvement to download.');
        return;
    }

    try {
        console.log("=== RTF GENERATION ===");
        console.log("Selected suggestions:", selectedSuggestions.length);
        
        // Create RTF content with visible redlines
        let rtfContent = `{\\rtf1\\ansi\\deff0 
{\\fonttbl {\\f0 Times New Roman;}}
{\\colortbl;\\red0\\green0\\blue0;\\red255\\green0\\blue0;\\red0\\green128\\blue0;\\red255\\green255\\blue0;}
\\f0\\fs24\\par
\\qc\\b\\ul CONFIDENTIALITY AGREEMENT (REDLINED VERSION)\\b0\\ul0\\par
\\pard\\par
`;

        // Split document into paragraphs and process each one
        const paragraphs = ndaText.split('\n').filter(p => p.trim().length > 0);
        
        paragraphs.forEach((paragraph, pIndex) => {
            let processedParagraph = paragraph.trim();
            
            // Skip title if it matches
            if (processedParagraph.match(/CONFIDENTIALITY AGREEMENT/i)) {
                return;
            }
            
            // Apply redlining to this paragraph
            selectedSuggestions.forEach((suggestion, sIndex) => {
                if (suggestion.originalText && suggestion.improvedText) {
                    const cleanOriginal = suggestion.originalText.replace(/['"]/g, '').trim();
                    const cleanImproved = suggestion.improvedText.replace(/['"]/g, '').trim();
                    
                    if (processedParagraph.includes(cleanOriginal)) {
                        // Create visible redlined text
                        const redlinedText = `{\\strike\\cf2 ${cleanOriginal}} {\\cf3\\chcbpat4 ${cleanImproved}}`;
                        processedParagraph = processedParagraph.replace(cleanOriginal, redlinedText);
                        console.log(`Applied redline ${sIndex + 1} to paragraph ${pIndex + 1}`);
                    }
                }
            });
            
            // Escape RTF special characters
            processedParagraph = processedParagraph
                .replace(/\\/g, '\\\\')
                .replace(/\{(?![\\\\])/g, '\\{')
                .replace(/\}(?![\\\\])/g, '\\}');
            
            // Add paragraph to RTF
            if (processedParagraph.match(/^\\d+\\)/)) {
                // Section header
                rtfContent += `\\b ${processedParagraph}\\b0\\par\\par\n`;
            } else if (processedParagraph.match(/^[a-z]\\)/)) {
                // Subsection
                rtfContent += `\\li360 ${processedParagraph}\\par\n`;
            } else {
                // Regular paragraph
                rtfContent += `${processedParagraph}\\par\\par\n`;
            }
        });
        
        // Add change summary
        rtfContent += `\\page\\par
\\qc\\b\\fs28 SUMMARY OF CHANGES\\b0\\fs24\\par\\par
\\pard\\b Total Changes:\\b0 ${selectedSuggestions.length}\\par
\\b Date:\\b0 ${new Date().toLocaleDateString()}\\par\\par
`;
        
        selectedSuggestions.forEach((suggestion, index) => {
            rtfContent += `\\b ${index + 1}. ${suggestion.title}\\b0\\par
Risk: ${suggestion.riskLevel} - ${suggestion.impact} impact\\par
Original: {\\strike\\cf2 ${suggestion.originalText}}\\par
Revised: {\\cf3\\chcbpat4 ${suggestion.improvedText}}\\par
Reason: ${suggestion.description}\\par\\par
`;
        });
        
        rtfContent += `}`;
        
        // Download the file
        const blob = new Blob([rtfContent], { type: 'application/rtf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `NDA_Redlined_${new Date().toISOString().split('T')[0]}.rtf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        console.log("✓ RTF document generated with visible redlines");
        
    } catch (error) {
        console.error("RTF generation error:", error);
        alert("Error generating redlined document. Please try again.");
    }
};

// Export for testing
if (typeof module !== 'undefined') {
    module.exports = { generatePreviewTextFixed, downloadAsWordFixed };
}