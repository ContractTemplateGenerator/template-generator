/**
 * Word Redline Processor Web App
 * Accepts Word document uploads and redline instructions
 * Returns Word documents with native track changes applied
 */

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { processWordDocument } = require('./wordProcessor');

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Create uploads and processed directories
const uploadsDir = path.join(__dirname, 'uploads');
const processedDir = path.join(__dirname, 'processed');

[uploadsDir, processedDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const extension = path.extname(file.originalname);
        cb(null, `${uniqueId}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept Word documents
        const allowedMimes = [
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.ms-word'
        ];
        
        if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.docx') || file.originalname.endsWith('.doc')) {
            cb(null, true);
        } else {
            cb(new Error('Please upload a Word document (.docx or .doc)'));
        }
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Word Redline Processor Web App',
        timestamp: new Date().toISOString()
    });
});

// One-click test endpoint
app.post('/test-redlines', async (req, res) => {
    try {
        console.log('Processing one-click test...');
        
        // Use the realistic employment agreement test document
        const testDocPath = path.join(__dirname, 'real-employment-test.docx');
        if (!fs.existsSync(testDocPath)) {
            throw new Error('Test document not found');
        }
        
        // Default test instructions that work with the employment agreement
        const testInstructions = `Change "[Employee Name]" to "Sarah Johnson"
Change "[Title]" to "Software Engineer"
Change "$[Salary Amount] per annum" to "$75,000 per annum"
Change "PTO in accordance with California law and Company policy" to "PTO at the rate of 15 days per year"`;
        
        console.log('Using test document:', testDocPath);
        console.log('Test instructions:', testInstructions);
        
        // Process the document
        const processedFilePath = await processWordDocument(
            testDocPath,
            testInstructions,
            processedDir
        );
        
        // Send the processed file
        const filename = 'test-redlined-document.docx';
        
        res.download(processedFilePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Failed to download test file' });
            }
            
            // Clean up processed file after download
            setTimeout(() => {
                try {
                    fs.unlinkSync(processedFilePath);
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }, 5000);
        });
        
    } catch (error) {
        console.error('Test processing error:', error);
        res.status(500).json({
            error: 'Failed to process test document',
            details: error.message
        });
    }
});

// Process redlines endpoint
app.post('/process-redlines', upload.single('wordDocument'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No Word document uploaded'
            });
        }

        const { redlineInstructions } = req.body;
        
        if (!redlineInstructions || redlineInstructions.trim() === '') {
            return res.status(400).json({
                error: 'No redline instructions provided'
            });
        }

        console.log(`Processing file: ${req.file.filename}`);
        console.log(`Instructions: ${redlineInstructions}`);

        // Process the document
        const processedFilePath = await processWordDocument(
            req.file.path,
            redlineInstructions,
            processedDir
        );

        // Send the processed file
        const filename = `redlined_${req.file.originalname}`;
        
        res.download(processedFilePath, filename, (err) => {
            if (err) {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Failed to download processed file' });
            }
            
            // Clean up files after download
            setTimeout(() => {
                try {
                    fs.unlinkSync(req.file.path); // Remove uploaded file
                    fs.unlinkSync(processedFilePath); // Remove processed file
                } catch (cleanupError) {
                    console.error('Cleanup error:', cleanupError);
                }
            }, 5000); // Clean up after 5 seconds
        });

    } catch (error) {
        console.error('Processing error:', error);
        
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            error: 'Failed to process document',
            details: error.message
        });
    }
});

// Get processing status
app.get('/status/:jobId', (req, res) => {
    // For future implementation of async processing
    res.json({
        status: 'completed',
        message: 'Document processing completed'
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large. Maximum size is 10MB.'
            });
        }
    }
    
    console.error('Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Word Redline Processor Web App running on port ${PORT}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
    console.log(`📄 Upload Word documents and get them back with track changes!`);
    console.log('');
    console.log('📋 How to use:');
    console.log('1. Open http://localhost:3001 in your browser');
    console.log('2. Upload a Word document (.docx)');
    console.log('3. Enter redline instructions');
    console.log('4. Download the processed document with track changes');
    console.log('');
});