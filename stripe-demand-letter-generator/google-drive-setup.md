# Google Drive Integration Setup

## Overview
This guide helps you set up Google Drive integration to automatically save signed demand letters to your Google Drive.

## Prerequisites
- Google account with Google Drive access
- Google Cloud Platform account (free tier available)

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Drive API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"

## Step 2: Create Service Account Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in service account details
4. Download the JSON key file
5. Extract these values from the JSON:
   - `client_id`
   - `client_secret` 
   - `refresh_token` (see Step 3)

## Step 3: Get Refresh Token

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the gear icon (settings) in top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In left sidebar, expand "Drive API v3"
6. Select "https://www.googleapis.com/auth/drive.file"
7. Click "Authorize APIs"
8. Complete the authorization flow
9. Click "Exchange authorization code for tokens"
10. Copy the `refresh_token` value

## Step 4: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Google Drive Configuration
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here  
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
GOOGLE_DRIVE_API_KEY=your_api_key_here

# Optional: Create a specific folder for signed documents
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_here
```

## Step 5: Create Dedicated Folder (Optional)

1. Create a folder in Google Drive called "Signed_Demand_Letters"
2. Open the folder and copy the folder ID from the URL
3. Add the folder ID to your `.env` file

## Step 6: Test Integration

1. Restart your proxy server: `node esign-proxy.js`
2. Generate and sign a test document
3. Check your Google Drive for the automatically uploaded PDF

## Troubleshooting

### "Credentials not configured" error
- Verify all environment variables are set correctly
- Check that the .env file is in the correct location
- Restart the proxy server after making changes

### "Access denied" error  
- Verify the service account has Drive API access
- Check that the refresh token is valid and not expired
- Ensure the Google Drive API is enabled in your project

### "Folder not found" error
- Verify the GOOGLE_DRIVE_FOLDER_ID is correct
- Make sure the service account has access to the folder
- Try removing the folder ID to use the root directory

## Security Notes

- Keep your .env file secure and never commit it to version control
- The .env file is already included in .gitignore
- Consider using a dedicated Google account for this integration
- Regularly rotate your API credentials for security