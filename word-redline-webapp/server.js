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
const { spawn } = require('child_process');

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
        
        // Process the document with Python (MCP-like capabilities)
        const processedFilePath = await processPythonRedlines(
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

/**
 * Process document using Python-based processor (with python-docx)
 */
async function processPythonRedlines(inputPath, instructions, outputDir) {
    return new Promise((resolve, reject) => {
        const outputFileName = `python_processed_${uuidv4()}.docx`;
        const outputPath = path.join(outputDir, outputFileName);
        
        const pythonProcess = spawn('python3', [
            path.join(__dirname, 'word_processor_python.py'),
            inputPath,
            outputPath,
            '--instructions', instructions
        ]);
        
        let stdout = '';
        let stderr = '';
        
        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });
        
        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                try {
                    // Parse the JSON output from Python script
                    const lines = stdout.trim().split('\n');
                    const jsonLine = lines[lines.length - 1]; // Last line should be JSON
                    const result = JSON.parse(jsonLine);
                    
                    if (result.success) {
                        resolve(outputPath);
                    } else {
                        reject(new Error(result.error || 'Python processing failed'));
                    }
                } catch (parseError) {
                    reject(new Error(`Failed to parse Python output: ${parseError.message}`));
                }
            } else {
                reject(new Error(`Python process failed with code ${code}: ${stderr}`));
            }
        });
    });
}

// Process redlines endpoint with Python backend (NEW!)
app.post('/process-redlines-python', upload.single('wordDocument'), async (req, res) => {
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

        console.log(`Processing file with Python: ${req.file.filename}`);
        console.log(`Instructions: ${redlineInstructions}`);

        // Process the document with Python
        const processedFilePath = await processPythonRedlines(
            req.file.path,
            redlineInstructions,
            processedDir
        );

        // Send the processed file
        const filename = `python_redlined_${req.file.originalname}`;
        
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
        console.error('Python processing error:', error);
        
        // Clean up uploaded file on error
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        
        res.status(500).json({
            error: 'Failed to process document with Python backend',
            details: error.message
        });
    }
});

// Process redlines endpoint (original)
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