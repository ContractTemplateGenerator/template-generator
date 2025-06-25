/**
 * Word Document Processor
 * Handles parsing Word documents and applying redline instructions as track changes
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PizZip = require('pizzip');
const { DOMParser, XMLSerializer } = require('xmldom');

/**
 * Process a Word document with redline instructions
 */
async function processWordDocument(inputFilePath, redlineInstructions, outputDir) {
    console.log('Starting document processing...');
    
    // Read the input Word document
    const docxBuffer = fs.readFileSync(inputFilePath);
    const zip = new PizZip(docxBuffer);
    
    // Parse redline instructions
    const instructions = parseRedlineInstructions(redlineInstructions);
    console.log(`Parsed ${instructions.length} instructions`);
    
    // Process the main document content
    const documentXml = zip.file('word/document.xml').asText();
    const parser = new DOMParser();
    const doc = parser.parseFromString(documentXml, 'text/xml');
    
    // Apply redline instructions with track changes
    const processedDoc = applyRedlineInstructions(doc, instructions);
    
    // Serialize the modified document
    const serializer = new XMLSerializer();
    const modifiedDocumentXml = serializer.serializeToString(processedDoc);
    
    // Update the zip with modified content
    zip.file('word/document.xml', modifiedDocumentXml);
    
    // Add track changes settings to document settings
    updateDocumentSettings(zip);
    
    // Generate output file
    const outputFileName = `processed_${uuidv4()}.docx`;
    const outputFilePath = path.join(outputDir, outputFileName);
    
    // Write the modified document
    const outputBuffer = zip.generate({ type: 'nodebuffer' });
    fs.writeFileSync(outputFilePath, outputBuffer);
    
    console.log(`Document processed successfully: ${outputFilePath}`);
    return outputFilePath;
}

/**
 * Parse redline instructions into structured format
 */
function parseRedlineInstructions(instructions) {
    const lines = instructions.split('\n').filter(line => line.trim());
    const parsed = [];
    
    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        
        const instruction = parseInstruction(trimmed);
        if (instruction) {
            parsed.push(instruction);
        }
    }
    
    return parsed;
}

/**
 * Parse a single instruction line
 */
function parseInstruction(line) {
    const original = line;
    
    // Pattern: Change "old" to "new" [context]
    const changePattern = /^change\s+"([^"]+)"\s+to\s+"([^"]+)"(?:\s+(.+))?$/i;
    const changeMatch = line.match(changePattern);
    if (changeMatch) {
        return {
            type: 'replace',
            original: original,
            find: changeMatch[1],
            replace: changeMatch[2],
            context: changeMatch[3] || null
        };
    }
    
    // Pattern: Replace "old" with "new" [context]
    const replacePattern = /^replace\s+"([^"]+)"\s+with\s+"([^"]+)"(?:\s+(.+))?$/i;
    const replaceMatch = line.match(replacePattern);
    if (replaceMatch) {
        return {
            type: 'replace',
            original: original,
            find: replaceMatch[1],
            replace: replaceMatch[2],
            context: replaceMatch[3] || null
        };
    }
    
    // Pattern: Delete "text" [context]
    const deletePattern = /^delete\s+"([^"]+)"(?:\s+(.+))?$/i;
    const deleteMatch = line.match(deletePattern);
    if (deleteMatch) {
        return {
            type: 'delete',
            original: original,
            find: deleteMatch[1],
            context: deleteMatch[2] || null
        };
    }
    
    // Pattern: Add "text" [location]
    const addPattern = /^add\s+"([^"]+)"(?:\s+(.+))?$/i;
    const addMatch = line.match(addPattern);
    if (addMatch) {
        return {
            type: 'add',
            original: original,
            text: addMatch[1],
            location: addMatch[2] || 'at the end'
        };
    }
    
    return null;
}

/**
 * Apply redline instructions to the Word document XML
 */
function applyRedlineInstructions(doc, instructions) {
    console.log('Applying redline instructions...');
    
    // Get all text nodes in the document
    const textNodes = getTextNodes(doc);
    
    for (const instruction of instructions) {
        console.log(`Processing: ${instruction.original}`);
        
        switch (instruction.type) {
            case 'replace':
                applyReplaceInstruction(doc, textNodes, instruction);
                break;
            case 'delete':
                applyDeleteInstruction(doc, textNodes, instruction);
                break;
            case 'add':
                applyAddInstruction(doc, instruction);
                break;
        }
    }
    
    return doc;
}

/**
 * Get all text nodes from the document
 */
function getTextNodes(doc) {
    const textNodes = [];
    
    function traverseNode(node) {
        if (node.nodeType === 3) { // Text node
            if (node.nodeValue && node.nodeValue.trim()) {
                textNodes.push(node);
            }
        } else if (node.childNodes) {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNode(node.childNodes[i]);
            }
        }
    }
    
    traverseNode(doc);
    return textNodes;
}

/**
 * Apply a replace instruction with track changes
 */
function applyReplaceInstruction(doc, textNodes, instruction) {
    const { find, replace } = instruction;
    
    for (const textNode of textNodes) {
        const text = textNode.nodeValue;
        if (text.includes(find)) {
            // Create track changes for replacement
            const parent = textNode.parentNode;
            const grandParent = parent.parentNode;
            
            // Split the text and create tracked changes
            const beforeText = text.substring(0, text.indexOf(find));
            const afterText = text.substring(text.indexOf(find) + find.length);
            
            // Clear the original text node
            textNode.nodeValue = beforeText;
            
            // Create deletion markup for original text
            const deleteRun = doc.createElement('w:del');
            deleteRun.setAttribute('w:id', generateId());
            deleteRun.setAttribute('w:author', 'Redline Processor');
            deleteRun.setAttribute('w:date', new Date().toISOString());
            
            const deleteText = doc.createElement('w:delText');
            deleteText.appendChild(doc.createTextNode(find));
            deleteRun.appendChild(deleteText);
            
            // Create insertion markup for new text
            const insertRun = doc.createElement('w:ins');
            insertRun.setAttribute('w:id', generateId());
            insertRun.setAttribute('w:author', 'Redline Processor');
            insertRun.setAttribute('w:date', new Date().toISOString());
            
            const insertText = doc.createElement('w:t');
            insertText.appendChild(doc.createTextNode(replace));
            insertRun.appendChild(insertText);
            
            // Insert the track changes into the document
            if (grandParent) {
                grandParent.insertBefore(deleteRun, parent.nextSibling);
                grandParent.insertBefore(insertRun, deleteRun.nextSibling);
                
                // Add remaining text if any
                if (afterText) {
                    const afterTextNode = doc.createElement('w:t');
                    afterTextNode.appendChild(doc.createTextNode(afterText));
                    grandParent.insertBefore(afterTextNode, insertRun.nextSibling);
                }
            }
            
            break; // Only replace first occurrence per text node
        }
    }
}

/**
 * Apply a delete instruction with track changes
 */
function applyDeleteInstruction(doc, textNodes, instruction) {
    const { find } = instruction;
    
    for (const textNode of textNodes) {
        const text = textNode.nodeValue;
        if (text.includes(find)) {
            // Create track changes for deletion
            const parent = textNode.parentNode;
            const grandParent = parent.parentNode;
            
            const beforeText = text.substring(0, text.indexOf(find));
            const afterText = text.substring(text.indexOf(find) + find.length);
            
            textNode.nodeValue = beforeText + afterText;
            
            // Create deletion markup
            const deleteRun = doc.createElement('w:del');
            deleteRun.setAttribute('w:id', generateId());
            deleteRun.setAttribute('w:author', 'Redline Processor');
            deleteRun.setAttribute('w:date', new Date().toISOString());
            
            const deleteText = doc.createElement('w:delText');
            deleteText.appendChild(doc.createTextNode(find));
            deleteRun.appendChild(deleteText);
            
            if (grandParent) {
                grandParent.insertBefore(deleteRun, parent.nextSibling);
            }
            
            break; // Only delete first occurrence per text node
        }
    }
}

/**
 * Apply an add instruction with track changes
 */
function applyAddInstruction(doc, instruction) {
    const { text, location } = instruction;
    
    // For simplicity, add at the end of the document
    const body = doc.getElementsByTagName('w:body')[0];
    if (body) {
        // Create insertion markup
        const insertRun = doc.createElement('w:ins');
        insertRun.setAttribute('w:id', generateId());
        insertRun.setAttribute('w:author', 'Redline Processor');
        insertRun.setAttribute('w:date', new Date().toISOString());
        
        const paragraph = doc.createElement('w:p');
        const run = doc.createElement('w:r');
        const insertText = doc.createElement('w:t');
        insertText.appendChild(doc.createTextNode(text));
        
        run.appendChild(insertText);
        insertRun.appendChild(run);
        paragraph.appendChild(insertRun);
        body.appendChild(paragraph);
    }
}

/**
 * Update document settings to enable track changes
 */
function updateDocumentSettings(zip) {
    try {
        // Get or create settings.xml
        let settingsXml;
        const settingsFile = zip.file('word/settings.xml');
        
        if (settingsFile) {
            settingsXml = settingsFile.asText();
        } else {
            settingsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
</w:settings>`;
        }
        
        // Parse and modify settings
        const parser = new DOMParser();
        const settingsDoc = parser.parseFromString(settingsXml, 'text/xml');
        
        // Enable track changes
        const settings = settingsDoc.getElementsByTagName('w:settings')[0];
        
        // Remove existing trackRevisions if present
        const existingTrackRevisions = settings.getElementsByTagName('w:trackRevisions');
        for (let i = existingTrackRevisions.length - 1; i >= 0; i--) {
            settings.removeChild(existingTrackRevisions[i]);
        }
        
        // Add track changes setting
        const trackRevisions = settingsDoc.createElement('w:trackRevisions');
        settings.appendChild(trackRevisions);
        
        // Serialize and update
        const serializer = new XMLSerializer();
        const modifiedSettingsXml = serializer.serializeToString(settingsDoc);
        zip.file('word/settings.xml', modifiedSettingsXml);
        
    } catch (error) {
        console.error('Error updating document settings:', error);
    }
}

/**
 * Generate a unique ID for track changes
 */
function generateId() {
    return Math.floor(Math.random() * 1000000).toString();
}

module.exports = {
    processWordDocument
};