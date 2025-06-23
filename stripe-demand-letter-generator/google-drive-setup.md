# Google Drive Integration Setup

## Prerequisites
You mentioned you have eSignatures MCP integrated with Google Drive. To complete the integration:

## 1. Environment Variables
Create a `.env` file in this directory with your Google Drive API credentials:

```bash
GOOGLE_DRIVE_API_KEY=your_api_key_here
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

## 2. Google Drive Folder ID
In `esign-proxy.js` line 617, replace `YOUR_GOOGLE_DRIVE_FOLDER_ID` with your actual folder ID.

## 3. How it Works
When a document is signed:
1. The system detects completion via multiple monitoring methods
2. Downloads the signed PDF from eSignatures.com
3. Automatically uploads it to your specified Google Drive folder
4. Provides both the original PDF link AND Google Drive link
5. Shows a "View in Google Drive" button alongside the regular PDF viewer

## 4. Features
- ✅ Automatic signed document upload to Google Drive
- ✅ Both PDF viewer and Google Drive links provided
- ✅ Success message indicates Google Drive save
- ✅ No user intervention required - fully automated
- ✅ Timestamped filenames for organization
- ✅ Error handling if Google Drive is unavailable

## 5. Testing
1. Fill out a demand letter
2. Click E-Sign
3. Complete signing process
4. Watch for "Document automatically saved to your Google Drive!" message
5. Click "View in Google Drive" button to access the file

The integration preserves email delivery while adding automated Google Drive backup.