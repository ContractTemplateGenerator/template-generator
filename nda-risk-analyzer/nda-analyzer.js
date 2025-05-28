const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [ndaUrl, setNdaUrl] = useState('');
    const [isProcessingFile, setIsProcessingFile] = useState(false);
    const fileInputRef = useRef(null);

    // Fallback responses for when API fails
    const fallbackResponses = {
        "default": `<strong>RECOMMENDATION:</strong> SIGN WITH CAUTION<br><br>

<strong>WHY:</strong> Unable to complete full AI analysis, but most NDAs require careful review before signing.<br><br>

<strong>MANUAL REVIEW CHECKLIST:</strong><br>
<div style="margin: 15px 0; padding: 15px; border-left: 4px solid #d97706; background: #fffbeb;">
<strong>Key Areas to Review</strong> - <span style="color: #d97706; font-weight: bold;">YELLOW</span><br>
• Check if obligations are mutual (both parties have same restrictions)<br>
• Look for overly broad definition of "confidential information"<br>
• Verify reasonable time limits (2-3 years is typical)<br>
• Ensure standard exceptions are included (publicly known info, etc.)<br>
• Review termination and return of information clauses<br>
</div><br>

<strong>RED FLAGS TO WATCH FOR:</strong><br>
<div style="margin: 15px 0; padding: 15px; border-left: 4px solid #dc2626; background: #fef2f2;">
<strong>High Risk Issues</strong> - <span style="color: #dc2626; font-weight: bold;">RED</span><br>
• One-sided obligations (only you have restrictions)<br>
• "Perpetual" or indefinite duration<br>
• Vague or overly broad confidentiality definitions<br>
• Missing standard legal exceptions<br>
• Excessive penalties or injunctive relief clauses<br>
</div><br>

<strong>BOTTOM LINE:</strong> Most business NDAs are acceptable with minor modifications. Have an attorney review if you see multiple red flags or if significant business opportunities depend on this agreement.`
    };

    // Enhanced file upload with support for multiple formats
    const handleFileUpload = async (file) => {
        if (!file) return;

        setIsProcessingFile(true);
        
        try {
            let extractedText = '';
            
            if (file.type === 'application/pdf') {
                // Handle PDF files
                extractedText = await extractPDFText(file);
            } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
                       file.type === 'application/msword') {
                // Handle DOC/DOCX files
                extractedText = await extractWordText(file);
            } else if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                // Handle text files
                extractedText = await file.text();
            } else {
                throw new Error('Unsupported file format. Please use PDF, DOC, DOCX, or TXT files.');
            }

            if (extractedText && extractedText.trim()) {
                setNdaText(extractedText);
            } else {
                throw new Error('No text could be extracted from the file.');
            }
        } catch (error) {
            console.error('File processing error:', error);
            alert(`Error processing file: ${error.message}\n\nPlease try:\n1. Converting to PDF format\n2. Copy and paste the text directly`);
        } finally {
            setIsProcessingFile(false);
        }
    };

    // Extract text from PDF files
    const extractPDFText = async (file) => {
        try {
            // Use PDF.js library for text extraction
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            let fullText = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            return fullText;
        } catch (error) {
            throw new Error('Could not extract text from PDF. Please try converting to text format or copy/paste the content.');
        }
    };

    // Extract text from Word documents
    const extractWordText = async (file) => {
        try {
            const arrayBuffer = await file.arrayBuffer();
            
            if (file.name.endsWith('.docx')) {
                // Use JSZip and XML parsing for DOCX
                const zip = new JSZip();
                const zipFile = await zip.loadAsync(arrayBuffer);
                const documentXML = await zipFile.file('word/document.xml').async('string');
                
                // Simple XML text extraction (removes tags)
                const textContent = documentXML
                    .replace(/<[^>]*>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
                    
                return textContent;
            } else {
                // For older DOC files, suggest conversion
                throw new Error('Legacy DOC files require conversion. Please save as DOCX or PDF, or copy/paste the text.');
            }
        } catch (error) {
            throw new Error('Could not extract text from Word document. Please save as PDF or copy/paste the content.');
        }
    };

    // Handle URL input
    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        
        try {
            setIsProcessingFile(true);
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`);
            const data = await response.json();
            
            if (data.contents) {
                const cleanText = data.contents.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                setNdaText(cleanText);
            } else {
                throw new Error('Could not fetch content');
            }
        } catch (error) {
            alert('Could not fetch content from URL. Please copy and paste your NDA text directly.');
        } finally {
            setIsProcessingFile(false);
        }
    };
    // Enhanced NDA analysis with detailed clause breakdown
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        // Create detailed analysis message
        const analysisMessage = `Please perform a comprehensive clause-by-clause analysis of this NDA. Focus on Red/Yellow/Green risk assessment for each clause, and provide specific redraft suggestions using the exact party names and defined terms from the original document.

Industry context: ${industry}

NDA TEXT:
${ndaText}`;
        
        const userMessage = { role: 'user', content: analysisMessage };
        
        try {
            console.log('Calling enhanced NDA analysis API...');
            
            // Use the main API endpoint (not debug) for production analysis
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [userMessage]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Enhanced analysis received:', data.model);
            
            setAnalysisResult({
                htmlContent: data.response,
                recommendation: extractRecommendation(data.response),
                model: data.model,
                clauseCount: countClauses(data.response)
            });
        } catch (error) {
            console.error('Analysis error:', error);
            // Use enhanced fallback response
            setAnalysisResult({
                htmlContent: fallbackResponses.default,
                recommendation: 'SIGN WITH CAUTION',
                model: 'fallback-enhanced',
                clauseCount: 0
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Extract recommendation from response
    const extractRecommendation = (htmlResponse) => {
        const match = htmlResponse.match(/<strong>RECOMMENDATION:<\/strong>\s*([^<]+)/);
        return match ? match[1].trim() : 'REVIEW NEEDED';
    };

    // Count analyzed clauses for user feedback
    const countClauses = (htmlResponse) => {
        const matches = htmlResponse.match(/border-left:\s*4px\s*solid/g);
        return matches ? matches.length : 0;
    };

    // Handle drag and drop
    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('drag-over');
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    };

    // Schedule consultation
    const scheduleConsultation = () => {
        if (window.Calendly) {
            window.Calendly.initPopupWidget({
                url: 'https://calendly.com/sergei-tokmakov/30-minute-zoom-meeting?hide_gdpr_banner=1'
            });
        } else {
            window.open('https://terms.law/call/', '_blank');
        }
    };

    // Get recommendation styling class
    const getRecommendationClass = (recommendation) => {
        if (!recommendation) return 'caution';
        if (recommendation.includes('DO NOT SIGN')) return 'do-not-sign';
        if (recommendation.includes('ACCEPTABLE')) return 'acceptable';
        return 'caution';
    };