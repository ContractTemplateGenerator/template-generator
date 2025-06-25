/**
 * Word Redline Processor - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('redlineForm');
    const fileInput = document.getElementById('wordDocument');
    const fileDisplay = document.querySelector('.file-input-display');
    const fileText = document.querySelector('.file-text');
    const processBtn = document.getElementById('processBtn');
    const btnText = document.getElementById('btnText');
    const btnLoader = document.getElementById('btnLoader');
    const statusMessage = document.getElementById('statusMessage');
    const progressBar = document.getElementById('progressBar');

    // File input handling
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileText.textContent = file.name;
            fileDisplay.parentElement.classList.add('has-file');
            
            // Validate file type
            const validTypes = [
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                'application/msword'
            ];
            
            if (!validTypes.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
                showStatus('Please select a valid Word document (.docx or .doc)', 'error');
                fileInput.value = '';
                fileText.textContent = 'Choose Word document...';
                fileDisplay.parentElement.classList.remove('has-file');
                return;
            }
            
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                showStatus('File too large. Maximum size is 10MB.', 'error');
                fileInput.value = '';
                fileText.textContent = 'Choose Word document...';
                fileDisplay.parentElement.classList.remove('has-file');
                return;
            }
            
            showStatus(`Selected: ${file.name} (${formatFileSize(file.size)})`, 'success');
        } else {
            fileText.textContent = 'Choose Word document...';
            fileDisplay.parentElement.classList.remove('has-file');
        }
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const file = fileInput.files[0];
        const instructions = document.getElementById('redlineInstructions').value.trim();
        
        // Validation
        if (!file) {
            showStatus('Please select a Word document', 'error');
            return;
        }
        
        if (!instructions) {
            showStatus('Please enter redline instructions', 'error');
            return;
        }

        // Start processing
        setProcessingState(true);
        showStatus('Processing your document...', 'info');
        showProgress(true);

        try {
            // Create form data
            const formData = new FormData();
            formData.append('wordDocument', file);
            formData.append('redlineInstructions', instructions);

            // Send request
            const response = await fetch('/process-redlines', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Server error: ${response.status}`);
            }

            // Get the processed file
            const blob = await response.blob();
            const filename = getFilenameFromResponse(response) || `redlined_${file.name}`;

            // Download the file
            downloadFile(blob, filename);
            
            showStatus(`✅ Document processed successfully! Downloaded: ${filename}`, 'success');
            
        } catch (error) {
            console.error('Processing error:', error);
            showStatus(`❌ Error: ${error.message}`, 'error');
        } finally {
            setProcessingState(false);
            showProgress(false);
        }
    });

    // Helper functions
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 10000);
        }
    }

    function showProgress(show) {
        progressBar.style.display = show ? 'block' : 'none';
    }

    function setProcessingState(processing) {
        processBtn.disabled = processing;
        
        if (processing) {
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
        } else {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFilenameFromResponse(response) {
        const contentDisposition = response.headers.get('content-disposition');
        if (contentDisposition) {
            const matches = /filename="([^"]*)"/.exec(contentDisposition);
            if (matches != null && matches[1]) {
                return matches[1];
            }
        }
        return null;
    }

    function downloadFile(blob, filename) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    }

    // Example instruction presets
    const exampleButtons = document.querySelectorAll('.example-item code');
    exampleButtons.forEach(button => {
        button.style.cursor = 'pointer';
        button.title = 'Click to copy to instructions';
        
        button.addEventListener('click', function() {
            const instruction = this.textContent;
            const textarea = document.getElementById('redlineInstructions');
            
            if (textarea.value.trim()) {
                textarea.value += '\n' + instruction;
            } else {
                textarea.value = instruction;
            }
            
            // Provide visual feedback
            this.style.background = '#48bb78';
            setTimeout(() => {
                this.style.background = '#2d3748';
            }, 300);
            
            showStatus(`Added instruction: ${instruction}`, 'success');
        });
    });

    // Drag and drop file handling
    const fileContainer = document.querySelector('.file-input-container');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileContainer.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        fileContainer.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        fileContainer.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        fileContainer.classList.add('drag-over');
    }

    function unhighlight(e) {
        fileContainer.classList.remove('drag-over');
    }

    fileContainer.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            fileInput.files = files;
            fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
});