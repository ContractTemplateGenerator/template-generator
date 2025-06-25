/**
 * Redline Processor for Word
 * Processes redline instructions and applies them as native Word track changes
 */

Office.onReady((info) => {
    if (info.host === Office.HostType.Word) {
        document.getElementById("enable-tracking").onclick = enableTrackChanges;
        document.getElementById("process-redlines").onclick = processRedlines;
        
        // Check if track changes is already enabled
        checkTrackChangesStatus();
    }
});

/**
 * Enable track changes in the current document
 */
async function enableTrackChanges() {
    const button = document.getElementById("enable-tracking");
    const status = document.getElementById("tracking-status");
    
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span>Enabling...';
    
    try {
        await Word.run(async (context) => {
            // Enable track changes
            context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
            
            await context.sync();
            
            status.className = "status-message success";
            status.textContent = "✓ Track changes enabled successfully";
            
            button.innerHTML = '<span class="ms-Button-label">✓ Track Changes Enabled</span>';
            button.disabled = false;
        });
    } catch (error) {
        console.error("Error enabling track changes:", error);
        status.className = "status-message error";
        status.textContent = "Error enabling track changes: " + error.message;
        
        button.innerHTML = '<span class="ms-Button-label">Enable Track Changes</span>';
        button.disabled = false;
    }
}

/**
 * Check current track changes status
 */
async function checkTrackChangesStatus() {
    const status = document.getElementById("tracking-status");
    
    try {
        await Word.run(async (context) => {
            const trackingMode = context.document.changeTrackingMode;
            context.load(trackingMode);
            
            await context.sync();
            
            if (context.document.changeTrackingMode === Word.ChangeTrackingMode.trackAll) {
                status.className = "status-message success";
                status.textContent = "✓ Track changes is already enabled";
                
                const button = document.getElementById("enable-tracking");
                button.innerHTML = '<span class="ms-Button-label">✓ Track Changes Enabled</span>';
            } else {
                status.className = "status-message info";
                status.textContent = "Track changes is not enabled";
            }
        });
    } catch (error) {
        console.error("Error checking track changes status:", error);
        status.className = "status-message error";
        status.textContent = "Could not check track changes status";
    }
}

/**
 * Process redline instructions and apply as track changes
 */
async function processRedlines() {
    const button = document.getElementById("process-redlines");
    const status = document.getElementById("process-status");
    const results = document.getElementById("results");
    const instructions = document.getElementById("redline-instructions").value.trim();
    
    if (!instructions) {
        status.className = "status-message error";
        status.textContent = "Please enter redline instructions";
        return;
    }
    
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span>Processing...';
    status.className = "status-message info";
    status.textContent = "Processing redline instructions...";
    results.textContent = "";
    
    try {
        await Word.run(async (context) => {
            // Ensure track changes is enabled
            context.document.changeTrackingMode = Word.ChangeTrackingMode.trackAll;
            
            const processedInstructions = parseRedlineInstructions(instructions);
            const resultsLog = [];
            
            for (const instruction of processedInstructions) {
                try {
                    const result = await processInstruction(context, instruction);
                    resultsLog.push(result);
                } catch (error) {
                    resultsLog.push(`❌ Error processing "${instruction.original}": ${error.message}`);
                }
            }
            
            await context.sync();
            
            // Update results
            results.textContent = resultsLog.join('\n');
            
            status.className = "status-message success";
            status.textContent = `✓ Processed ${processedInstructions.length} instruction(s)`;
            
        });
    } catch (error) {
        console.error("Error processing redlines:", error);
        status.className = "status-message error";
        status.textContent = "Error processing redlines: " + error.message;
        results.textContent = `Error: ${error.message}`;
    } finally {
        button.innerHTML = '<span class="ms-Button-label">Apply Redlines as Track Changes</span>';
        button.disabled = false;
    }
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
    
    // If no pattern matches, treat as a simple find/replace
    const simplePattern = /"([^"]+)"\s+to\s+"([^"]+)"/i;
    const simpleMatch = line.match(simplePattern);
    if (simpleMatch) {
        return {
            type: 'replace',
            original: original,
            find: simpleMatch[1],
            replace: simpleMatch[2],
            context: null
        };
    }
    
    return null;
}

/**
 * Process a single instruction
 */
async function processInstruction(context, instruction) {
    switch (instruction.type) {
        case 'replace':
            return await processReplace(context, instruction);
        case 'delete':
            return await processDelete(context, instruction);
        case 'add':
            return await processAdd(context, instruction);
        default:
            throw new Error(`Unknown instruction type: ${instruction.type}`);
    }
}

/**
 * Process a replace instruction
 */
async function processReplace(context, instruction) {
    const searchOptions = {
        ignorePunct: false,
        ignoreSpace: false,
        matchCase: false,
        matchPrefix: false,
        matchSuffix: false,
        matchWholeWord: false,
        matchWildcards: false
    };
    
    // If context is specified (like "throughout" or "in section 5"), we might need to limit scope
    let searchScope = context.document.body;
    
    // For now, search the entire document
    const searchResults = searchScope.search(instruction.find, searchOptions);
    context.load(searchResults, ['items']);
    
    await context.sync();
    
    let replacementCount = 0;
    
    // Replace each occurrence
    for (let i = 0; i < searchResults.items.length; i++) {
        const searchResult = searchResults.items[i];
        
        // Insert replacement text before the found text
        const replacementRange = searchResult.insertText(instruction.replace, Word.InsertLocation.before);
        
        // Delete the original text (this will show as a deletion in track changes)
        searchResult.delete();
        
        replacementCount++;
    }
    
    await context.sync();
    
    if (replacementCount > 0) {
        return `✓ Replaced "${instruction.find}" with "${instruction.replace}" (${replacementCount} occurrence${replacementCount > 1 ? 's' : ''})`;
    } else {
        return `⚠️ Text "${instruction.find}" not found for replacement`;
    }
}

/**
 * Process a delete instruction
 */
async function processDelete(context, instruction) {
    const searchOptions = {
        ignorePunct: false,
        ignoreSpace: false,
        matchCase: false,
        matchPrefix: false,
        matchSuffix: false,
        matchWholeWord: false,
        matchWildcards: false
    };
    
    const searchResults = context.document.body.search(instruction.find, searchOptions);
    context.load(searchResults, ['items']);
    
    await context.sync();
    
    let deletionCount = 0;
    
    // Delete each occurrence
    for (let i = 0; i < searchResults.items.length; i++) {
        const searchResult = searchResults.items[i];
        searchResult.delete();
        deletionCount++;
    }
    
    await context.sync();
    
    if (deletionCount > 0) {
        return `✓ Deleted "${instruction.find}" (${deletionCount} occurrence${deletionCount > 1 ? 's' : ''})`;
    } else {
        return `⚠️ Text "${instruction.find}" not found for deletion`;
    }
}

/**
 * Process an add instruction
 */
async function processAdd(context, instruction) {
    const location = instruction.location.toLowerCase();
    
    if (location.includes('end')) {
        // Add at the end of the document
        const endRange = context.document.body.insertText('\n' + instruction.text, Word.InsertLocation.end);
        await context.sync();
        return `✓ Added "${instruction.text}" at the end of document`;
    } else if (location.includes('beginning') || location.includes('start')) {
        // Add at the beginning of the document
        const startRange = context.document.body.insertText(instruction.text + '\n', Word.InsertLocation.start);
        await context.sync();
        return `✓ Added "${instruction.text}" at the beginning of document`;
    } else if (location.includes('after')) {
        // Try to find the specified location and add after it
        const afterMatch = location.match(/after\s+"?([^"]+)"?/i);
        if (afterMatch) {
            const targetText = afterMatch[1];
            const searchResults = context.document.body.search(targetText, {});
            context.load(searchResults, ['items']);
            
            await context.sync();
            
            if (searchResults.items.length > 0) {
                const targetRange = searchResults.items[0];
                const insertRange = targetRange.insertText(' ' + instruction.text, Word.InsertLocation.after);
                await context.sync();
                return `✓ Added "${instruction.text}" after "${targetText}"`;
            } else {
                return `⚠️ Could not find "${targetText}" to add text after`;
            }
        }
    }
    
    // Default: add at the end
    const endRange = context.document.body.insertText('\n' + instruction.text, Word.InsertLocation.end);
    await context.sync();
    return `✓ Added "${instruction.text}" at the end of document (default location)`;
}