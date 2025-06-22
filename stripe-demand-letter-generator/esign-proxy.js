// Node.js proxy server for eSignatures.com API
const http = require('http');
const https = require('https');
const url = require('url');
const PDFDocument = require('pdfkit');
const fs = require('fs');

// DocuSeal API configuration (free, open source, supports direct document upload)
const DOCUSEAL_API_TOKEN = 'UH3xz4ng4L63JjTpqdLrR5aQ6PSbbUPFj5mGBbL12dU'; // Real DocuSeal API token
const DOCUSEAL_API_URL = 'https://api.docuseal.com';

const server = http.createServer((req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Content-Type', 'application/json');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Only handle POST requests to /esign-proxy
    if (req.method !== 'POST' || req.url !== '/esign-proxy') {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            console.log('Raw request body:', body);
            const data = JSON.parse(body);
            console.log('Parsed request data:', data);

            // Create real eSignature request using DocuSeal API
            console.log('Creating real eSignature document with DocuSeal');
            
            const documentContent = data.template?.content || '';
            const documentTitle = data.template?.title || 'Document';
            const signerInfo = (data.signers && data.signers[0]) || { 
                email: 'sergei.tokmakov@gmail.com', 
                name: 'Sergei Tokmakov' 
            };
            
            // Create HTML document with embedded signature fields for DocuSeal
            const htmlWithSignatureFields = `
<div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
        <h1>${documentTitle}</h1>
        <p>Electronic Signature Document</p>
    </div>
    
    <div style="white-space: pre-wrap; margin-bottom: 40px;">
${documentContent}
    </div>
    
    <div style="border: 2px solid #007cba; padding: 20px; margin: 30px 0; background: #f8f9ff;">
        <h3>Signature Section</h3>
        <p><strong>Signer:</strong> ${signerInfo.name || '[SIGNER_NAME]'}</p>
        <p><strong>Email:</strong> ${signerInfo.email || '[SIGNER_EMAIL]'}</p>
        
        <div style="margin: 20px 0;">
            <label>Signature:</label><br>
            <div data-field="signature" data-type="signature" style="border: 2px dashed #ccc; padding: 20px; margin: 10px 0; min-height: 60px; background: white;">
                [SIGNATURE_FIELD]
            </div>
        </div>
        
        <div style="margin: 20px 0;">
            <label>Date:</label><br>
            <div data-field="date" data-type="date" style="border: 1px solid #ccc; padding: 10px; margin: 10px 0; background: white;">
                [DATE_FIELD]
            </div>
        </div>
        
        <div style="color: #666; font-size: 14px; margin-top: 20px;">
            <p>By signing this document, you agree to its terms and conditions.</p>
            <p>This electronic signature is legally binding.</p>
        </div>
    </div>
</div>`;

            // Generate PDF from demand letter content
            generatePDFFromDemandLetter(documentTitle, documentContent, signerInfo, (pdfBase64) => {
                if (pdfBase64) {
                    // Send generated PDF to DocuSeal
                    makeDocuSealAPICall('/submissions/pdf', {
                        documents: [{
                            name: documentTitle + '.pdf',
                            file: pdfBase64
                        }],
                        submitters: [{
                            email: signerInfo.email || 'sergei.tokmakov@gmail.com',
                            name: signerInfo.name || 'Sergei Tokmakov'
                        }],
                        send_email: true,
                        completed_redirect_url: 'https://template.terms.law'
                    }, (success, result) => {
                        if (success && result.data) {
                            console.log('DocuSeal API success:', result);
                            const response = {
                                status: "success",
                                data: {
                                    contract_id: result.data.id || 'docuseal-' + Date.now(),
                                    contract_url: result.data.audit_log_url || result.data.url || `https://app.docuseal.com/submissions/${result.data.id}`,
                                    signing_url: result.data.submitters?.[0]?.url || result.data.url || `https://app.docuseal.com/s/${result.data.id}`,
                                    title: documentTitle,
                                    signers: data.signers || [],
                                    message: "Real eSignature document created"
                                }
                            };
                            console.log('Sending response:', response);
                            res.writeHead(200);
                            res.end(JSON.stringify(response));
                        } else {
                            console.error('DocuSeal API failed with details:', result);
                            // Return the actual error instead of demo mode
                            res.writeHead(400);
                            res.end(JSON.stringify({ 
                                status: "error", 
                                error: result.error || 'DocuSeal API failed',
                                details: result
                            }));
                        }
                    });
                } else {
                    // PDF generation failed
                    console.error('PDF generation failed');
                    res.writeHead(400);
                    res.end(JSON.stringify({ 
                        status: "error", 
                        error: 'PDF generation failed',
                        details: 'generatePDFFromDemandLetter returned null'
                    }));
                }
            });

        } catch (error) {
            console.error('JSON parse error:', error);
            console.error('Received body:', body);
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message, body: body }));
        }
    });
});

function makeDocuSealAPICall(endpoint, data, callback) {
    const postData = JSON.stringify(data);
    
    const options = {
        hostname: 'api.docuseal.com',
        port: 443,
        path: endpoint,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': DOCUSEAL_API_TOKEN,
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    console.log(`Making DocuSeal API call to ${endpoint}:`, options);

    const req = https.request(options, (res) => {
        let responseBody = '';
        
        res.on('data', (chunk) => {
            responseBody += chunk;
        });
        
        res.on('end', () => {
            console.log(`DocuSeal API raw response (${res.statusCode}):`, responseBody);
            try {
                const result = JSON.parse(responseBody);
                console.log(`DocuSeal API parsed response:`, result);
                callback(res.statusCode >= 200 && res.statusCode < 300, { data: result });
            } catch (error) {
                console.error('DocuSeal API JSON parse error:', error);
                console.error('Raw response body:', responseBody);
                callback(false, { error: 'Invalid JSON response', raw: responseBody });
            }
        });
    });

    req.on('error', (error) => {
        console.error('DocuSeal API request error:', error);
        callback(false, { error: error.message });
    });

    req.write(postData);
    req.end();
}

function generatePDFFromDemandLetter(title, content, signerInfo, callback) {
    try {
        console.log('Generating PDF from demand letter content...');
        
        // Create a new PDF document
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        
        // Collect PDF data into buffers
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            // Combine buffers and convert to base64
            const pdfBuffer = Buffer.concat(buffers);
            const pdfBase64 = pdfBuffer.toString('base64');
            console.log('PDF generated successfully, size:', pdfBuffer.length, 'bytes');
            callback(pdfBase64);
        });
        
        // Add title
        doc.fontSize(16).font('Helvetica-Bold');
        doc.text(title, { align: 'center' });
        doc.moveDown(2);
        
        // Add document content
        doc.fontSize(12).font('Helvetica');
        doc.text(content, { align: 'left', lineGap: 5 });
        doc.moveDown(3);
        
        // Add signature section
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('Electronic Signature Required', { align: 'center' });
        doc.moveDown(1);
        
        doc.fontSize(11).font('Helvetica');
        doc.text(`Signer: ${signerInfo.name || 'N/A'}`, { align: 'left' });
        doc.text(`Email: ${signerInfo.email || 'N/A'}`, { align: 'left' });
        doc.moveDown(1);
        
        // Signature line
        doc.text('Signature: ________________________________', { align: 'left' });
        doc.moveDown(0.5);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
        doc.moveDown(1);
        
        // Legal notice
        doc.fontSize(10).font('Helvetica');
        doc.text('By signing this document, you agree to its terms and conditions.', { align: 'left' });
        doc.text('This electronic signature is legally binding.', { align: 'left' });
        
        // Finalize the PDF
        doc.end();
        
    } catch (error) {
        console.error('PDF generation error:', error);
        callback(null);
    }
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`eSignature proxy server running on http://localhost:${PORT}`);
    console.log('Use /esign-proxy endpoint for API calls');
});