# Installation Guide - Word Redline Processor Add-in

This guide will help you install and test the Word Redline Processor add-in.

## Prerequisites

- **Microsoft Word** (2016 or later, Office 365, or Word for the web)
- **Node.js** (for running the development server)
- **Admin privileges** (may be required for add-in installation)

## Step-by-Step Installation

### 1. Setup the Development Environment

```bash
# Navigate to the add-in directory
cd word-redline-addin

# Install dependencies
npm install

# Start the development server
npm start
```

The server should start on `http://localhost:3000`. You should see output like:
```
🚀 Word Redline Processor Add-in Server running on port 3000
📝 Manifest URL: http://localhost:3000/manifest.xml
🌐 Task Pane URL: http://localhost:3000/taskpane.html
```

### 2. Install the Add-in in Word

#### Option A: Upload My Add-in (Recommended for Testing)

1. **Open Microsoft Word**
2. **Go to Insert tab** → **My Add-ins** → **Upload My Add-in**
3. **Browse** to select the `manifest.xml` file from this folder
4. **Click Upload**

#### Option B: Shared Folder (For Development)

1. **Create a shared network folder** or use a local folder
2. **Copy manifest.xml** to the shared folder
3. In Word: **Insert** → **My Add-ins** → **Shared Folder**
4. **Browse** to the shared folder and select `manifest.xml`

#### Option C: Microsoft 365 Admin Center (For Organization)

If you're an admin and want to deploy organization-wide:
1. Go to Microsoft 365 Admin Center
2. Navigate to Settings → Integrated apps
3. Upload the manifest.xml file

### 3. Verify Installation

1. **Look for "Redline Tools" group** in the Home tab ribbon
2. **Click "Process Redlines"** button
3. **Task pane should open** on the right side of Word

## Testing the Add-in

### Quick Test

1. **Create a new Word document** with some sample text:
   ```
   This is a sample document. The Company will provide services to the Client within 30 days.
   ```

2. **Open the Redline Processor** (Home tab → Process Redlines)

3. **Click "Enable Track Changes"**

4. **Enter test instructions:**
   ```
   Change "Company" to "Contractor"
   Change "30 days" to "45 days"
   ```

5. **Click "Apply Redlines as Track Changes"**

6. **Verify** that changes appear as proper Word track changes

### Full Test

Use the `test-document.md` file in this folder for comprehensive testing with various instruction types.

## Troubleshooting

### Add-in Doesn't Appear

**Problem**: Add-in not visible in Word ribbon
**Solutions**:
- Restart Word completely
- Check if manifest.xml loaded without errors
- Verify development server is running
- Try using a different installation method

### Task Pane Won't Load

**Problem**: Clicking button shows error or blank pane
**Solutions**:
- Check that server is running on port 3000
- Verify firewall isn't blocking localhost:3000
- Try refreshing the task pane (right-click → Reload)
- Check browser console for errors (right-click → Inspect)

### Track Changes Not Working

**Problem**: Changes appear but not as track changes
**Solutions**:
- Ensure you clicked "Enable Track Changes" first
- Check document isn't in read-only mode
- Verify Word supports track changes for your document format
- Try with a new blank document

### Instructions Not Processing

**Problem**: No changes appear after clicking process
**Solutions**:
- Check instruction format (text must be in quotes)
- Look at the results log for error messages
- Verify the text to find actually exists in document
- Try simpler instructions first

### HTTPS/SSL Issues

**Problem**: Mixed content or SSL errors
**For production deployment**, you'll need HTTPS:
- Use a service like ngrok: `ngrok http 3000`
- Update manifest.xml URLs to use the HTTPS ngrok URL
- Or deploy to a proper HTTPS web server

## Development Tips

### Debugging
- **Open Developer Tools** in task pane: Right-click → Inspect
- **Check Console** for JavaScript errors
- **Use console.log()** for debugging code changes

### Making Changes
1. **Edit code files** (taskpane.js, taskpane.css, etc.)
2. **Refresh task pane** in Word (right-click → Reload)
3. **Test changes** immediately

### Hot Reload
For faster development, changes to files are served immediately. Just refresh the task pane to see updates.

## Next Steps

Once basic functionality is working:

1. **Test with real documents** and redline instructions
2. **Customize the UI** in taskpane.html/css
3. **Enhance instruction parsing** in taskpane.js
4. **Add error handling** for edge cases
5. **Deploy to production** with HTTPS server

## Getting Help

- **Check console** for error messages
- **Review the README.md** for technical details
- **Test with simple instructions** first
- **Use the test document** provided for validation

## Production Deployment

For production use:
1. **Deploy to HTTPS server** (required for production)
2. **Update manifest.xml** URLs to production server
3. **Test thoroughly** with real documents
4. **Consider Microsoft AppSource** for broader distribution