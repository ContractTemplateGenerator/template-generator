// Node.js proxy server for eSignatures.com API with Google Drive integration and email
const http = require('http');
const https = require('https');
const url = require('url');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const nodemailer = require('nodemailer');

// Google Drive API configuration
const GOOGLE_DRIVE_API_KEY = process.env.GOOGLE_DRIVE_API_KEY || 'YOUR_GOOGLE_DRIVE_API_KEY';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'YOUR_GOOGLE_CLIENT_SECRET';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN || 'YOUR_GOOGLE_REFRESH_TOKEN';

// Email configuration
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER || 'your_email@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'your_app_password';

// Create email transporter
const mailTransporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

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

    // Handle both POST requests to /esign-proxy and GET requests to check contract status
    if (req.method === 'POST' && req.url === '/esign-proxy') {
        // Handle eSignature creation
    } else if (req.method === 'GET' && req.url.startsWith('/contract-status/')) {
        // Handle contract status checking
        const contractId = req.url.split('/contract-status/')[1];
        checkContractStatus(contractId, (statusResult) => {
            res.writeHead(200);
            res.end(JSON.stringify(statusResult));
        });
        return;
    } else if (req.method === 'POST' && req.url === '/send-to-stripe') {
        // Handle email sending to Stripe
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                sendSignedDocumentToStripe(data, (emailResult) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(emailResult));
                });
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
        return;
    } else if (req.method === 'POST' && req.url === '/upload-to-drive') {
        // Handle manual Google Drive upload
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const { contractId, pdfUrl, fileName } = JSON.parse(body);
                
                if (!pdfUrl) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'PDF URL is required' }));
                    return;
                }
                
                const driveResult = await downloadSignedPDFAndUploadToDrive(
                    pdfUrl, 
                    fileName || `Signed_Demand_Letter_${contractId}_${new Date().toISOString().split('T')[0]}.pdf`
                );
                
                if (driveResult) {
                    res.writeHead(200);
                    res.end(JSON.stringify({ success: true, drive_data: driveResult }));
                } else {
                    res.writeHead(500);
                    res.end(JSON.stringify({ success: false, error: 'Google Drive upload failed' }));
                }
                
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
        return;
    } else if (req.method === 'POST' && req.url === '/send-email-with-pdf') {
        // Handle automatic email sending with PDF attachment
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                sendEmailWithPDFAttachment(data, (emailResult) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(emailResult));
                });
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
        return;
    } else if (req.method === 'POST' && req.url === '/send-custom-email') {
        // Handle custom email preview interface
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                sendCustomEmailWithPDF(data, (emailResult) => {
                    res.writeHead(200);
                    res.end(JSON.stringify(emailResult));
                });
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON', details: error.message }));
            }
        });
        return;
    } else {
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

            let documentContent = data.template?.content || '';
            
            // Remove [CONTACT NAME] and [CONTACT_NAME] placeholders from eSignature templates
            // since the actual signer name will be in the signature field
            documentContent = documentContent.replace(/\[CONTACT_NAME\]/g, '')
                                           .replace(/\[CONTACT NAME\]/g, '');
            const documentTitle = data.template?.title || 'Document';
            const signerInfo = (data.signers && data.signers[0]) || { 
                email: 'sergei.tokmakov@gmail.com', 
                name: 'Sergei Tokmakov' 
            };
            
            // Try eSignatures.com first, fallback to DocuSeal
            console.log('Attempting eSignatures.com API with template creation...');
            
            // First try to create a template with eSignatures.com
            createESignaturesTemplate(documentTitle, documentContent, signerInfo, (templateId) => {
                if (templateId) {
                    console.log('Template created successfully:', templateId);
                    // Use the template to create a contract
                    createESignaturesContract(templateId, signerInfo, (contractResult) => {
                        console.log('*** CONTRACT CALLBACK EXECUTING ***');
                        console.log('Contract callback received:', JSON.stringify(contractResult, null, 2));
                        if (contractResult.success) {
                            console.log('*** CONTRACT SUCCESS - BUILDING RESPONSE ***');
                            // Debug: log the exact contractResult structure
                            console.log('Contract result data structure:', JSON.stringify(contractResult.data, null, 2));
                            
                            const response = {
                                status: "success",
                                data: {
                                    contract_id: contractResult.data.contract_id,
                                    contract_url: contractResult.data.contract_url, 
                                    signing_url: contractResult.data.signing_url,
                                    title: documentTitle,
                                    signers: data.signers || [],
                                    message: "Real eSignature document created"
                                }
                            };
                            console.log('SUCCESS: Sending eSignatures.com response:', JSON.stringify(response, null, 2));
                            res.writeHead(200);
                            res.end(JSON.stringify(response));
                        } else {
                            console.error('eSignatures.com contract creation failed:', contractResult);
                            res.writeHead(400);
                            res.end(JSON.stringify({ 
                                status: "error", 
                                error: 'eSignatures.com contract creation failed',
                                details: contractResult
                            }));
                        }
                    });
                } else {
                    console.error('eSignatures.com template creation failed');
                    res.writeHead(400);
                    res.end(JSON.stringify({ 
                        status: "error", 
                        error: 'eSignatures.com template creation failed',
                        details: 'Template creation returned null'
                    }));
                }
            });
            
            function fallbackToDocuSeal() {
                console.log('Creating real eSignature document with DocuSeal');
            
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
                    // Send generated PDF to DocuSeal with explicit email settings
                    makeDocuSealAPICall('/submissions/pdf', {
                        documents: [{
                            name: documentTitle + '.pdf',
                            file: pdfBase64
                        }],
                        submitters: [{
                            email: signerInfo.email || 'sergei.tokmakov@gmail.com',
                            name: signerInfo.name || 'Sergei Tokmakov',
                            role: 'First Party'
                        }],
                        send_email: true,
                        send_sms: false,
                        completed_redirect_url: 'https://example.com',
                        submitters_order: 'preserved',
                        message: {
                            subject: 'Please sign this demand letter document',
                            body: 'Please sign this demand letter document electronically.'
                        }
                    }, (success, result) => {
                if (success && result.data) {
                    console.log('DocuSeal API complete response:', JSON.stringify(result.data, null, 2));
                    
                    // Extract the correct signing URL from submitters (DocuSeal uses embed_src field)
                    const signingUrl = result.data.submitters?.[0]?.embed_src || 
                                      result.data.submitters?.[0]?.url || 
                                      `https://docuseal.com/s/${result.data.submitters?.[0]?.slug}`;
                    console.log('Extracted signing URL:', signingUrl);
                    
                    const response = {
                        status: "success",
                        data: {
                            contract_id: result.data.id || 'docuseal-' + Date.now(),
                            contract_url: result.data.audit_log_url || result.data.url,
                            signing_url: signingUrl,
                            title: documentTitle,
                            signers: data.signers || [],
                            message: "Real eSignature document created"
                        }
                    };
                    console.log('Sending response with correct URL:', response);
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
                    console.error('PDF generation failed');
                    res.writeHead(500);
                    res.end(JSON.stringify({ 
                        status: "error", 
                        error: 'PDF generation failed'
                    }));
                }
            });
            } // End fallbackToDocuSeal function

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
                callback(res.statusCode >= 200 && res.statusCode < 300, result);
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
            console.log('PDF base64 length:', pdfBase64.length);
            console.log('PDF starts with:', pdfBase64.substring(0, 50));
            callback(pdfBase64);
        });
        
        doc.on('error', (error) => {
            console.error('PDF generation error:', error);
            callback(null);
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

// eSignatures.com API functions
const ESIGNATURES_API_TOKEN = '1807161e-d29d-4ace-9b87-864e25c70b05';
const ESIGNATURES_API_URL = 'https://esignatures.com/api';

function createESignaturesTemplate(title, content, signerInfo, callback) {
    console.log('Creating eSignatures.com template...');
    
    // Convert content to document elements with signature between demand letter and arbitration demand
    // Look for the arbitration section separator
    const arbitrationSeparator = '='.repeat(80) + '\nARBITRATION DEMAND (ATTACHMENT)\n' + '='.repeat(80);
    const arbitrationIndex = content.indexOf(arbitrationSeparator);
    let documentElements = [];
    
    if (arbitrationIndex !== -1) {
        // Split into demand letter part and arbitration part
        const demandLetterPart = content.substring(0, arbitrationIndex);
        const arbitrationPart = content.substring(arbitrationIndex);
        
        // Add demand letter (which ends with "Sincerely,")
        documentElements.push({
            "type": "text_normal",
            "text": demandLetterPart
        });
        
        // eSignatures.com will automatically place signature fields after "Sincerely,"
        
        // Add arbitration demand as unsigned attachment  
        documentElements.push({
            "type": "text_normal",
            "text": arbitrationPart
        });
    } else {
        // No arbitration demand - just the demand letter with signature at "Sincerely,"
        const sincerelyIndex = content.indexOf("Sincerely,");
        if (sincerelyIndex !== -1) {
            const beforeSincerely = content.substring(0, sincerelyIndex + "Sincerely,".length);
            documentElements.push({
                "type": "text_normal",
                "text": beforeSincerely
            });
            
            const afterSincerely = content.substring(sincerelyIndex + "Sincerely,".length);
            const cleanedAfter = afterSincerely.replace(/\n\n[^\n]*\n[^\n]*$/, '');
            if (cleanedAfter.trim()) {
                documentElements.push({
                    "type": "text_normal", 
                    "text": cleanedAfter
                });
            }
        } else {
            // Fallback - just add content as is
            documentElements.push({
                "type": "text_normal",
                "text": content
            });
        }
    }
    
    const templateData = {
        title: "Demand Letter",
        document_elements: documentElements,
        labels: ["first_signer"]
    };
    
    console.log('Template data being sent:', JSON.stringify(templateData, null, 2));
    
    makeESignaturesAPICall('/templates', templateData, (success, result) => {
        console.log('Template creation response - success:', success, 'result:', JSON.stringify(result, null, 2));
        if (success && result.data) {
            const templateId = result.data.template_id;
            if (templateId) {
                console.log('Template created:', templateId);
                callback(templateId);
            } else {
                console.error('No template_id found in response:', result.data);
                callback(null);
            }
        } else {
            console.error('Template creation failed:', result);
            callback(null);
        }
    });
}

function createESignaturesContract(templateId, signerInfo, callback) {
    console.log('Creating eSignatures.com contract with template:', templateId);
    
    const contractData = {
        template_id: templateId,
        test: "yes", // Use test mode for the paid account
        signers: [{
            name: (signerInfo.name && signerInfo.name.trim()) || "Sergei Tokmakov",
            email: signerInfo.email || "sergei.tokmakov@gmail.com"
        }],
        // Customize signature appearance  
        signature_request_subject: "Demand Letter Signature Request",
        signature_request_message: "Please review and sign this demand letter.",
        use_text_tags: false,
        hide_text_tags: true,
        // Try supported branding options
        custom_branding: {
            company_name: "",
            company_logo: "",
            primary_color: "#ffffff"
        },
        // Override success page to redirect back to terms.law
        redirect_url: "http://localhost:8000/signing-complete.html",
        declined_redirect_url: "http://localhost:8000/signing-declined.html",
        // Enable Google Drive integration if available in eSignatures.com
        integrations: {
            google_drive: {
                enabled: true,
                auto_save: true,
                folder_name: "Signed_Demand_Letters"
            }
        },
        // Enable automatic cloud storage
        cloud_storage: {
            google_drive: true,
            auto_upload: true
        }
    };
    
    console.log('Contract data being sent:', JSON.stringify(contractData, null, 2));
    
    makeESignaturesAPICall('/contracts', contractData, (success, result) => {
        console.log('Contract creation response - success:', success, 'result:', JSON.stringify(result, null, 2));
        if (success && result.data) {
            // Extract contract info from the response
            const contract = result.data.contract;
            const signingUrl = contract.signers?.[0]?.sign_page_url;
            
            console.log('Contract created successfully:', contract.id, 'signing URL:', signingUrl);
            console.log('Full contract object:', JSON.stringify(contract, null, 2));
            
            callback({
                success: true,
                data: {
                    contract_id: contract.id,
                    contract_url: `https://esignatures.com/contracts/${contract.id}`,
                    signing_url: signingUrl
                }
            });
        } else {
            console.error('Contract creation failed:', result);
            callback({ success: false, error: result });
        }
    });
}

function makeESignaturesAPICall(endpoint, data, callback, method = 'POST') {
    const postData = method === 'POST' ? JSON.stringify(data) : '';
    const url = `${ESIGNATURES_API_URL}${endpoint}?token=${ESIGNATURES_API_TOKEN}`;
    
    const options = {
        hostname: 'esignatures.com',
        port: 443,
        path: `/api${endpoint}?token=${ESIGNATURES_API_TOKEN}`,
        method: method,
        headers: method === 'POST' ? {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        } : {}
    };

    console.log(`Making eSignatures.com API call to ${endpoint}:`, options.path);

    const req = https.request(options, (res) => {
        let responseBody = '';
        
        res.on('data', (chunk) => {
            responseBody += chunk;
        });
        
        res.on('end', () => {
            console.log(`eSignatures.com API raw response (${res.statusCode}):`, responseBody);
            try {
                const result = JSON.parse(responseBody);
                console.log(`eSignatures.com API parsed response:`, result);
                callback(res.statusCode >= 200 && res.statusCode < 300, result);
            } catch (error) {
                console.error('eSignatures.com API JSON parse error:', error);
                console.error('Raw response body:', responseBody);
                callback(false, { error: 'Invalid JSON response', raw: responseBody });
            }
        });
    });

    req.on('error', (error) => {
        console.error('eSignatures.com API request error:', error);
        callback(false, { error: error.message });
    });

    if (method === 'POST' && postData) {
        req.write(postData);
    }
    req.end();
}

// Function to check contract status and get signed document
function checkContractStatus(contractId, callback) {
    console.log('Checking contract status for:', contractId);
    
    makeESignaturesAPICall(`/contracts/${contractId}`, {}, async (success, result) => {
        console.log('Contract status response:', result);
        
        if (success && result.data && result.data.contract) {
            const contract = result.data.contract;
            const status = contract.status;
            const pdfUrl = contract.contract_pdf_url;
            
            let driveData = null;
            
            // If document is signed and has PDF URL, upload to Google Drive
            if (status === 'signed' && pdfUrl) {
                console.log('Document is signed, attempting Google Drive upload...');
                const fileName = `Signed_Demand_Letter_${contractId}_${new Date().toISOString().split('T')[0]}.pdf`;
                
                // Try to get any existing Google Drive link from eSignatures.com first
                let esignDriveData = null;
                if (contract.google_drive_url || contract.drive_url || contract.integrations?.google_drive) {
                    console.log('📁 eSignatures.com has Google Drive integration data');
                    esignDriveData = {
                        source: 'eSignatures.com',
                        driveLink: contract.google_drive_url || contract.drive_url,
                        integration: contract.integrations?.google_drive
                    };
                }
                
                // Upload to our own Google Drive as backup/alternative
                const ourDriveData = await downloadSignedPDFAndUploadToDrive(pdfUrl, fileName);
                
                // Combine both sources
                driveData = {
                    esignatures_drive: esignDriveData,
                    terms_law_drive: ourDriveData,
                    primary_source: esignDriveData ? 'eSignatures.com' : (ourDriveData ? 'Terms.law' : null)
                };
            }
            
            callback({
                success: true,
                status: status,
                contract_id: contractId,
                signed: status === 'signed',
                pdf_url: pdfUrl,
                google_drive: driveData,
                signers: contract.signers || []
            });
        } else {
            callback({
                success: false,
                error: 'Failed to retrieve contract status',
                details: result
            });
        }
    }, 'GET');
}

// Google Drive integration functions
async function getGoogleAccessToken() {
    // Check if credentials are configured
    if (!GOOGLE_CLIENT_ID || GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID' ||
        !GOOGLE_CLIENT_SECRET || GOOGLE_CLIENT_SECRET === 'YOUR_GOOGLE_CLIENT_SECRET' ||
        !GOOGLE_REFRESH_TOKEN || GOOGLE_REFRESH_TOKEN === 'YOUR_GOOGLE_REFRESH_TOKEN') {
        throw new Error('Google Drive credentials not configured. Please set up environment variables.');
    }
    
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            refresh_token: GOOGLE_REFRESH_TOKEN,
            grant_type: 'refresh_token'
        });

        const options = {
            hostname: 'oauth2.googleapis.com',
            port: 443,
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseBody);
                    if (result.access_token) {
                        resolve(result.access_token);
                    } else {
                        reject(new Error('No access token received from Google'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

async function uploadToGoogleDrive(pdfBuffer, fileName, accessToken) {
    return new Promise((resolve, reject) => {
        // Create multipart form data
        const boundary = '-------314159265358979323846';
        const delimiter = "\r\n--" + boundary + "\r\n";
        const close_delim = "\r\n--" + boundary + "--";

        const metadata = {
            'name': fileName,
            'parents': ['YOUR_GOOGLE_DRIVE_FOLDER_ID'] // Replace with your folder ID
        };

        const multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: application/pdf\r\n\r\n' +
            pdfBuffer.toString('binary') +
            close_delim;

        const options = {
            hostname: 'www.googleapis.com',
            port: 443,
            path: '/upload/drive/v3/files?uploadType=multipart',
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/related; boundary="' + boundary + '"',
                'Content-Length': Buffer.byteLength(multipartRequestBody, 'binary'),
                'Authorization': 'Bearer ' + accessToken
            }
        };

        const req = https.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseBody);
                    if (result.id) {
                        const driveLink = `https://drive.google.com/file/d/${result.id}/view`;
                        resolve({
                            fileId: result.id,
                            driveLink: driveLink,
                            downloadLink: `https://drive.google.com/file/d/${result.id}/view?usp=sharing`
                        });
                    } else {
                        reject(new Error('Failed to upload to Google Drive'));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(multipartRequestBody, 'binary');
        req.end();
    });
}

async function downloadSignedPDFAndUploadToDrive(pdfUrl, fileName) {
    try {
        console.log('📁 Attempting Google Drive upload for:', fileName);
        console.log('PDF URL:', pdfUrl);
        
        // Download the PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            https.get(pdfUrl, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to download PDF: HTTP ${res.statusCode}`));
                    return;
                }
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject);
        });

        console.log('✅ PDF downloaded successfully, size:', pdfBuffer.length, 'bytes');

        // Get Google Drive access token
        const accessToken = await getGoogleAccessToken();
        console.log('✅ Got Google Drive access token');

        // Upload to Google Drive
        const driveResult = await uploadToGoogleDrive(pdfBuffer, fileName, accessToken);
        console.log('✅ Successfully uploaded to Google Drive:', driveResult);

        return driveResult;
    } catch (error) {
        console.error('❌ Google Drive upload failed:', error.message);
        if (error.message.includes('credentials not configured')) {
            console.log('ℹ️ To enable Google Drive integration:');
            console.log('   1. Set up Google Drive API credentials');
            console.log('   2. Add them to environment variables or .env file');
            console.log('   3. See google-drive-setup.md for instructions');
        }
        return null;
    }
}

// Function to send signed document to Stripe via email
async function sendSignedDocumentToStripe(requestData, callback) {
    try {
        console.log('📧 Sending signed document to Stripe via email...');
        const { contractId, pdfUrl, companyName, contactName, withheldAmount } = requestData;
        
        if (!pdfUrl) {
            callback({ success: false, error: 'No PDF URL provided' });
            return;
        }
        
        // Download the signed PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            https.get(pdfUrl, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to download PDF: HTTP ${res.statusCode}`));
                    return;
                }
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject);
        });
        
        console.log('✅ Downloaded signed PDF, size:', pdfBuffer.length, 'bytes');
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Signed_Demand_Letter_${companyName || 'Company'}_${timestamp}.pdf`;
        
        // Email content
        const emailSubject = `FORMAL DEMAND LETTER - ${companyName || '[Company Name]'} - Withheld Funds $${withheldAmount || '[Amount]'}`;
        
        const emailBody = `Dear Stripe Legal Team,

Please find attached the signed formal demand letter regarding withheld merchant funds for ${companyName || '[Company Name]'}.

This letter constitutes formal notice under Section 13.3(a) of the Stripe Services Agreement and initiates the required 30-day pre-arbitration notice period.

Key Details:
- Company: ${companyName || '[Company Name]'}
- Contact: ${contactName || '[Contact Name]'}
- Withheld Amount: $${withheldAmount || '[Amount]'}
- Document: Signed demand letter with arbitration notice

This matter requires immediate attention from your legal department. Please direct all responses to the contact information provided in the attached demand letter.

Respectfully submitted,
${contactName || '[Contact Name]'}
${companyName || '[Company Name]'}`;

        // Email configuration
        const mailOptions = {
            from: EMAIL_USER,
            to: 'sergei.tokmakov@gmail.com', // Testing email - will change to Stripe later
            cc: 'complaints@stripe.com', // Optional - remove for testing
            subject: emailSubject,
            text: emailBody,
            attachments: [
                {
                    filename: filename,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        
        // Send the email
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Email sending failed:', error);
                callback({ 
                    success: false, 
                    error: 'Email sending failed', 
                    details: error.message 
                });
            } else {
                console.log('✅ Email sent successfully to Stripe!');
                console.log('Message ID:', info.messageId);
                callback({ 
                    success: true, 
                    messageId: info.messageId,
                    message: 'Signed demand letter sent to Stripe via email with PDF attachment'
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Error in sendSignedDocumentToStripe:', error);
        callback({ 
            success: false, 
            error: 'Failed to send email', 
            details: error.message 
        });
    }
}

// Function to send email with PDF attachment automatically
async function sendEmailWithPDFAttachment(requestData, callback) {
    try {
        console.log('📧 Sending automatic email to Stripe with PDF attachment...');
        const { contractId, pdfUrl, companyName, contactName, withheldAmount, fromEmail, senderName } = requestData;
        
        if (!pdfUrl) {
            callback({ success: false, error: 'No PDF URL provided' });
            return;
        }
        
        // Download the signed PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            https.get(pdfUrl, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to download PDF: HTTP ${res.statusCode}`));
                    return;
                }
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject);
        });
        
        console.log('✅ Downloaded signed PDF, size:', pdfBuffer.length, 'bytes');
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Signed_Demand_Letter_${companyName || 'Company'}_${timestamp}.pdf`;
        
        // Email content
        const emailSubject = `FORMAL DEMAND LETTER - ${companyName || '[Company Name]'} - Withheld Funds $${withheldAmount || '[Amount]'}`;
        
        const emailBody = `Dear Stripe Legal Team,

Please find attached the signed formal demand letter regarding withheld merchant funds for ${companyName || '[Company Name]'}.

This letter constitutes formal notice under Section 13.3(a) of the Stripe Services Agreement and initiates the required 30-day pre-arbitration notice period.

Key Details:
- Company: ${companyName || '[Company Name]'}
- Contact: ${contactName || '[Contact Name]'}
- Withheld Amount: $${withheldAmount || '[Amount]'}
- Document: Signed demand letter with arbitration notice

This matter requires immediate attention from your legal department. Please direct all responses to the contact information provided in the attached demand letter.

Respectfully submitted,
${contactName || '[Contact Name]'}
${companyName || '[Company Name]'}

---
This email was sent automatically from the Terms.law Demand Letter Generator.`;

        // Email configuration with sender details
        const mailOptions = {
            from: `"${senderName || 'Demand Letter Sender'}" <${EMAIL_USER}>`,
            replyTo: fromEmail || EMAIL_USER,
            to: 'complaints@stripe.com',
            // CC for testing - uncomment for production
            // cc: 'sergei.tokmakov@gmail.com', 
            subject: emailSubject,
            text: emailBody,
            attachments: [
                {
                    filename: filename,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        
        // Send the email
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Automatic email sending failed:', error);
                callback({ 
                    success: false, 
                    error: 'Email sending failed', 
                    details: error.message 
                });
            } else {
                console.log('✅ Automatic email sent successfully to Stripe!');
                console.log('Message ID:', info.messageId);
                console.log('To:', mailOptions.to);
                console.log('Subject:', emailSubject);
                callback({ 
                    success: true, 
                    messageId: info.messageId,
                    to: mailOptions.to,
                    subject: emailSubject,
                    message: 'Signed demand letter automatically sent to Stripe with PDF attachment'
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Error in sendEmailWithPDFAttachment:', error);
        callback({ 
            success: false, 
            error: 'Failed to send automatic email', 
            details: error.message 
        });
    }
}

// Function to send custom email with PDF attachment from preview interface
async function sendCustomEmailWithPDF(requestData, callback) {
    try {
        console.log('📧 Sending custom email with PDF attachment...');
        const { contractId, pdfUrl, to, subject, body, companyName, fromEmail, senderName } = requestData;
        
        if (!pdfUrl) {
            callback({ success: false, error: 'No PDF URL provided' });
            return;
        }
        
        if (!to || !subject || !body) {
            callback({ success: false, error: 'Missing required email fields (to, subject, body)' });
            return;
        }
        
        // Download the signed PDF
        const pdfBuffer = await new Promise((resolve, reject) => {
            https.get(pdfUrl, (res) => {
                if (res.statusCode !== 200) {
                    reject(new Error(`Failed to download PDF: HTTP ${res.statusCode}`));
                    return;
                }
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
                res.on('error', reject);
            }).on('error', reject);
        });
        
        console.log('✅ Downloaded signed PDF, size:', pdfBuffer.length, 'bytes');
        
        // Create filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `Signed_Demand_Letter_${companyName || 'Company'}_${timestamp}.pdf`;
        
        // Email configuration with custom content
        const mailOptions = {
            from: `"${senderName || 'Demand Letter Sender'}" <${EMAIL_USER}>`,
            replyTo: fromEmail || EMAIL_USER,
            to: to,
            subject: subject,
            text: body,
            attachments: [
                {
                    filename: filename,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        
        // Send the email
        mailTransporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('❌ Custom email sending failed:', error);
                callback({ 
                    success: false, 
                    error: 'Email sending failed', 
                    details: error.message 
                });
            } else {
                console.log('✅ Custom email sent successfully!');
                console.log('Message ID:', info.messageId);
                console.log('To:', to);
                console.log('Subject:', subject);
                callback({ 
                    success: true, 
                    messageId: info.messageId,
                    to: to,
                    subject: subject,
                    message: 'Custom email sent successfully with PDF attachment'
                });
            }
        });
        
    } catch (error) {
        console.error('❌ Error in sendCustomEmailWithPDF:', error);
        callback({ 
            success: false, 
            error: 'Failed to send custom email', 
            details: error.message 
        });
    }
}

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`eSignature proxy server running on http://localhost:${PORT}`);
    console.log('Use /esign-proxy endpoint for API calls');
    console.log('Use /contract-status/<contract_id> to check signing status');
    console.log('Use /send-to-stripe endpoint for manual email sending');
    console.log('Use /send-email-with-pdf endpoint for automatic email with PDF attachment');
    console.log('Use /send-custom-email endpoint for custom email preview interface');
    console.log('Use /upload-to-drive endpoint for Google Drive uploads');
    console.log('Google Drive integration enabled');
    console.log('Email integration enabled');
});