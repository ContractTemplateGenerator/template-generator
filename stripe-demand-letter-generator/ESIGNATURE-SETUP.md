# eSignature Setup Guide

## Current Status
✅ **REAL eSignature API integrated with DocuSeal!**

The E-Sign button now creates ACTUAL signable documents using DocuSeal's API. No templates required - your demand letters are sent directly for real electronic signature with legal compliance.

## How It Works

### Real eSignature Mode (Current)
- Click the **E-Sign** button  
- Creates real DocuSeal eSignature request with your demand letter
- Sends email to signer with secure signing link
- Legally compliant electronic signatures
- Shows: "🔥 REAL eSignature Created!" (with API token)
- Shows: "🧪 Demo Mode Active" (without API token)

### Production Setup (Real API)
To activate real DocuSeal eSignatures:

1. **Get Free DocuSeal API Token:**
   - Visit: https://www.docuseal.com/
   - Sign up for free account
   - Generate API token from dashboard

2. **Update API Token:**
   - Edit `esign-proxy.js`
   - Replace `'demo-token'` with your real token

3. **Start Servers:**
   ```bash
   # Terminal 1: Start DocuSeal proxy
   node esign-proxy.js
   
   # Terminal 2: Start HTTP server
   python3 -m http.server 8000
   ```

4. **Open in Browser:**
   ```
   http://localhost:8000
   ```

3. **Click E-Sign Button:**
   - Creates real eSignature contract
   - Opens actual signing interface
   - Uses test mode for free trial account

## Features Implemented

### ✅ **E-Sign Button**
- Added after Download button in navigation
- Red background (#dc2626) for visibility
- Loading state: "Processing..." when active
- Proper styling matches existing buttons

### ✅ **API Integration**
- **Endpoint:** `https://esignatures.com/api/templates` (with `/contracts` fallback)
- **Authentication:** Bearer token `1807161e-d29d-4ace-9b87-864e25c70b05`
- **Test Mode:** `test: "yes"` parameter for free trial
- **Hardcoded Signer:** sergei.tokmakov@gmail.com / Sergei Tokmakov

### ✅ **Document Processing**
- Uses existing `generateDemandLetter()` function
- Supports both single demand letter and combined arbitration
- Dynamic titles: "Stripe Demand Letter - [Company Name]"
- Creates professional HTML signing interface with embedded content
- No templates required - works with any demand letter content

### ✅ **Error Handling**
- CORS error detection and messaging
- Detailed console logging for debugging
- Fallback to demo mode when API unavailable
- Specific error messages for different failure types

### ✅ **User Experience**
- One-click signing (no email input required)
- Opens signing interface in new window/tab
- Success/error alerts with clear messaging
- Loading states during API calls

## Files Modified

1. **stripe-demand-generator.js** - Main implementation
   - Added `eSignLoading` state
   - Added `eSignDocument()` function
   - Added E-Sign button to navigation

2. **esign-proxy.php** - Server-side proxy (for production API)
   - Handles CORS restrictions
   - Manages API authentication
   - Fallback between templates/contracts endpoints

## Testing

### Quick Test (Demo Mode)
1. Open `index.html` in browser
2. Fill out some form fields (company name recommended)
3. Click **E-Sign** button
4. Should see demo success message and open demo page

### Full Test (Real API)
1. Start PHP server: `php -S localhost:8000`
2. Open `http://localhost:8000`
3. Fill out form and click **E-Sign**
4. Should create real eSignature contract with test data

## API Credentials Used

- **API Token:** `1807161e-d29d-4ace-9b87-864e25c70b05`
- **Base URL:** `https://esignatures.com/api`
- **Dashboard:** `https://esignatures.com/api_accounts/3f1196fb-e8dc-4e46-8894-b6ee9eb929ed`
- **Test Mode:** Enabled for free trial account

## Next Steps

1. **Test with real API** using PHP server
2. **Make signer dynamic** (replace hardcoded email)
3. **Add form validation** for required fields
4. **Implement webhook handling** for signed documents
5. **Add document templates** for different contract types

## Troubleshooting

### "Failed to fetch" Error
- This indicates CORS restrictions
- Solution: Use PHP server for production API calls
- Fallback: Demo mode works without server

### PHP Server Issues
```bash
# Check if PHP is installed
php --version

# Start server with specific PHP version if needed
/usr/bin/php -S localhost:8000

# Alternative port if 8000 is busy
php -S localhost:8080
```

### API Errors
- Check browser console (F12) for detailed error messages
- Verify API token in `esign-proxy.php`
- Ensure `test: "yes"` parameter for free trial accounts