# Vercel API Deployment Instructions

## Quick Deploy to Vercel

1. **Install Vercel CLI (if not installed):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy this project to Vercel:**
   ```bash
   cd /Users/mac/Dropbox/Mac/Documents/GitHub/template-generator
   vercel --prod
   ```

3. **Expected Deployment URL:**
   - Main deployment: `template-generator-[hash].vercel.app`
   - API endpoints will be available at: `[deployment-url]/api/mcp-esign`

4. **Update Frontend URLs:**
   - Replace `template-generator-api.vercel.app` in the frontend with actual deployment URL
   - File to update: `Tenant-Security-Deposit-Generator/index.html`

## Manual Deploy Alternative

If you have access to Vercel dashboard:
1. Connect this GitHub repository to Vercel
2. Deploy from main branch
3. Update the API URL in the frontend code

## API Endpoints Available
- `/api/test` - Test endpoint
- `/api/mcp-esign` - Main eSignature endpoint  
- `/api/tenant-esign` - Alternative eSignature endpoint
- `/api/esignature` - Legacy endpoint

## Environment Variables Needed
- `ESIGNATURES_SECRET_TOKEN` = `1807161e-d29d-4ace-9b87-864e25c70b05`