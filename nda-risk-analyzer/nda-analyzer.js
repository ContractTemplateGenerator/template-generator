const { useState, useRef } = React;

const NDAAnalyzer = () => {
    const [ndaText, setNdaText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [industry, setIndustry] = useState('auto-detect');
    const [ndaUrl, setNdaUrl] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [expandedClauses, setExpandedClauses] = useState(new Set());
    const fileInputRef = useRef(null);

    // Enhanced fallback responses
    const fallbackResponses = {
        "default": `<strong>RECOMMENDATION:</strong> SIGN WITH CAUTION<br><br>

<strong>WHY:</strong> Unable to complete full AI analysis, but most NDAs require careful review before signing.<br><br>

<strong>DOCUMENT SUMMARY:</strong> Standard non-disclosure agreement requiring manual review for risk assessment.<br><br>

<strong>CLAUSE-BY-CLAUSE ANALYSIS:</strong><br>
<div class="clause-analysis-item">
<strong>CLAUSE:</strong> Confidentiality Definition<br>
<strong>RISK LEVEL:</strong> <span class="risk-yellow">YELLOW</span><br>
<strong>ISSUE:</strong> Unable to analyze specific language - manual review needed<br>
<strong>SUGGESTED REDRAFT:</strong> Have attorney review for overly broad definitions<br><br>
</div>

<strong>MANUAL REVIEW CHECKLIST:</strong><br>
• Check if obligations are mutual (both parties have same restrictions)<br>
• Look for overly broad definition of "confidential information"<br>
• Verify reasonable time limits (2-3 years is typical)<br>
• Ensure standard exceptions are included (publicly known info, etc.)<br>
• Review termination and return of information clauses<br><br>

<strong>BOTTOM LINE:</strong> Schedule professional review for comprehensive analysis with specific redraft suggestions.`
    };

    // Handle enhanced file upload with PDF/DOC support
    const handleFileUpload = async (file) => {
        if (!file) return;

        setUploadProgress(10);
        
        try {
            if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
                // Handle text files
                const text = await file.text();
                setNdaText(text);
                setUploadProgress(100);
            } else if (file.type === 'application/pdf') {
                // Handle PDF files using PDF.js (loaded from CDN)
                setUploadProgress(30);
                const text = await extractTextFromPDF(file);
                setNdaText(text);
                setUploadProgress(100);
            } else if (file.type.includes('document') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
                // Handle Word documents using mammoth.js (loaded from CDN)
                setUploadProgress(30);
                const text = await extractTextFromWord(file);
                setNdaText(text);
                setUploadProgress(100);
            } else {
                alert('Please upload a PDF, Word document (.doc/.docx), or text file (.txt).');
            }
        } catch (error) {
            console.error('File upload error:', error);
            alert('Error processing file. Please try copying and pasting the text directly, or contact support if the issue persists.');
        } finally {
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    // Extract text from PDF using PDF.js
    const extractTextFromPDF = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    // Use PDF.js if available, otherwise fallback
                    if (window.pdfjsLib) {
                        const pdf = await window.pdfjsLib.getDocument(e.target.result).promise;
                        let text = '';
                        
                        for (let i = 1; i <= pdf.numPages; i++) {
                            const page = await pdf.getPage(i);
                            const content = await page.getTextContent();
                            const pageText = content.items.map(item => item.str).join(' ');
                            text += pageText + '\\n';
                        }
                        
                        resolve(text);
                    } else {
                        // Fallback: Ask user to copy/paste
                        reject(new Error('PDF processing not available. Please copy and paste the text directly.'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    // Extract text from Word documents using mammoth.js
    const extractTextFromWord = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    if (window.mammoth) {
                        const result = await window.mammoth.extractRawText({arrayBuffer: e.target.result});
                        resolve(result.value);
                    } else {
                        reject(new Error('Word document processing not available. Please copy and paste the text directly.'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    // Handle URL input with better error handling
    const handleUrlSubmit = async () => {
        if (!ndaUrl.trim()) return;
        
        try {
            setIsAnalyzing(true);
            setUploadProgress(20);
            
            // Try direct fetch first
            try {
                const response = await fetch(ndaUrl);
                if (response.ok) {
                    const text = await response.text();
                    const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();
                    setNdaText(cleanText);
                    setUploadProgress(100);
                    return;
                }
            } catch (corsError) {
                // If direct fetch fails due to CORS, try proxy
                console.log('Direct fetch failed, trying proxy...');
            }
            
            setUploadProgress(50);
            // Fallback to CORS proxy
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(ndaUrl)}`);
            const data = await response.json();
            
            if (data.contents) {
                const cleanText = data.contents.replace(/<[^>]*>/g, ' ').replace(/\\s+/g, ' ').trim();
                setNdaText(cleanText);
                setUploadProgress(100);
            } else {
                throw new Error('Could not fetch content from URL');
            }
        } catch (error) {
            alert('Could not fetch content from URL. Please copy and paste your NDA text directly or upload a file.');
        } finally {
            setIsAnalyzing(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };
    // Enhanced NDA analysis with clause-by-clause breakdown
    const analyzeNDA = async () => {
        if (!ndaText.trim()) {
            alert('Please enter your NDA text to analyze.');
            return;
        }

        setIsAnalyzing(true);
        
        // Create enhanced analysis message
        const analysisMessage = `Please analyze this NDA with detailed clause-by-clause risk assessment. Provide specific redraft suggestions using actual party names and terms from the NDA. Industry context: ${industry}.\n\nNDA TEXT:\n${ndaText}`;
        const userMessage = { role: 'user', content: analysisMessage };
        
        try {
            console.log('=== ENHANCED NDA ANALYSIS ===');
            
            // Use the enhanced API endpoint
            const response = await fetch('https://template-generator-aob3.vercel.app/api/nda-risk-chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [userMessage]
                }),
            });

            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const errorData = await response.json();
                console.log('Error response:', errorData);
                throw new Error(`Analysis failed: ${errorData.error}`);
            }

            const data = await response.json();
            console.log('Enhanced analysis response received');
            
            // Process the enhanced response
            const processedResult = processEnhancedAnalysis(data.response);
            
            setAnalysisResult({
                ...processedResult,
                model: data.model,
                rawResponse: data.response
            });
        } catch (error) {
            console.error('Analysis error:', error);
            // Use enhanced fallback response
            setAnalysisResult({
                htmlContent: fallbackResponses.default,
                recommendation: 'SIGN WITH CAUTION',
                model: 'fallback',
                clauses: [],
                riskSummary: { red: 0, yellow: 1, green: 0 }
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Process enhanced analysis response with clause extraction
    const processEnhancedAnalysis = (htmlResponse) => {
        const recommendation = extractRecommendation(htmlResponse);
        const clauses = extractClauseAnalysis(htmlResponse);
        const riskSummary = calculateRiskSummary(clauses);
        
        return {
            htmlContent: htmlResponse,
            recommendation: recommendation,
            clauses: clauses,
            riskSummary: riskSummary
        };
    };

    // Extract clause analysis from response
    const extractClauseAnalysis = (htmlResponse) => {
        const clauses = [];
        const clauseRegex = /<div class="clause-analysis-item">(.*?)<\/div>/gs;
        let match;
        
        while ((match = clauseRegex.exec(htmlResponse)) !== null) {
            const clauseContent = match[1];
            
            // Extract clause details
            const titleMatch = clauseContent.match(/<strong>CLAUSE:<\/strong>\s*([^<]+)/);
            const riskMatch = clauseContent.match(/<span class="risk-([^"]+)"[^>]*>([^<]+)<\/span>/);
            const issueMatch = clauseContent.match(/<strong>ISSUE:<\/strong>\s*([^<]+)/);
            const originalMatch = clauseContent.match(/<strong>ORIGINAL TEXT:<\/strong>\s*"([^"]+)"/);
            const redraftMatch = clauseContent.match(/<strong>SUGGESTED REDRAFT:<\/strong>\s*"([^"]+)"/);
            
            if (titleMatch && riskMatch) {
                clauses.push({
                    title: titleMatch[1].trim(),
                    riskLevel: riskMatch[1].toLowerCase(), // red, yellow, green
                    riskText: riskMatch[2].trim(),
                    issue: issueMatch ? issueMatch[1].trim() : '',
                    originalText: originalMatch ? originalMatch[1].trim() : '',
                    suggestedRedraft: redraftMatch ? redraftMatch[1].trim() : '',
                    fullContent: clauseContent
                });
            }
        }
        
        return clauses;
    };

    // Calculate risk summary statistics
    const calculateRiskSummary = (clauses) => {
        const summary = { red: 0, yellow: 0, green: 0 };
        clauses.forEach(clause => {
            if (clause.riskLevel === 'red') summary.red++;
            else if (clause.riskLevel === 'yellow') summary.yellow++;
            else if (clause.riskLevel === 'green') summary.green++;
        });
        return summary;
    };

    // Extract recommendation from response
    const extractRecommendation = (htmlResponse) => {
        const match = htmlResponse.match(/<strong>RECOMMENDATION:<\/strong>\\s*([^<]+)/);
        return match ? match[1].trim() : 'REVIEW NEEDED';
    };

    // Toggle clause expansion
    const toggleClause = (index) => {
        const newExpanded = new Set(expandedClauses);
        if (newExpanded.has(index)) {
            newExpanded.delete(index);
        } else {
            newExpanded.add(index);
        }
        setExpandedClauses(newExpanded);
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

    // Get risk level color
    const getRiskColor = (level) => {
        switch (level) {
            case 'red': return '#dc2626';
            case 'yellow': return '#d97706';
            case 'green': return '#059669';
            default: return '#64748b';
        }
    };