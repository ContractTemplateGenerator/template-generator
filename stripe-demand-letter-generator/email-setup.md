# Email Integration Setup

## Email to Stripe Functionality

The system now includes the ability to automatically send signed demand letters directly to Stripe via email with PDF attachments.

## Setup Required

### 1. Environment Variables
Create a `.env` file or set environment variables:

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 2. Gmail App Password Setup (Required)

**IMPORTANT:** You must use an App Password, not your regular Gmail password.

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click "Security" in the left sidebar
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the setup process

2. **Generate App Password:**
   - In the same Security section, click "App passwords"
   - Select "Mail" as the app and "Other" as the device
   - Name it "Stripe Demand Letter Generator"
   - Copy the 16-character password (remove spaces)

3. **Update Environment Variables:**
   - Use your full Gmail address as `EMAIL_USER`
   - Use the 16-character app password as `EMAIL_PASS`

**Example .env configuration:**
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # (remove spaces when copying)
```

### 3. How It Works

**After Document Signing:**
1. User completes eSignature process
2. "Send to Stripe" button appears in success interface
3. System downloads the signed PDF from eSignatures.com
4. Creates professional email with PDF attachment
5. Sends to Stripe's legal department

**Email Details:**
- **To:** sergei.tokmakov@gmail.com (for testing)
- **CC:** complaints@stripe.com (commented out for testing)
- **Subject:** "FORMAL DEMAND LETTER - [Company] - Withheld Funds $[Amount]"
- **Attachment:** `Signed_Demand_Letter_[Company]_[Date].pdf`

**Email Content:**
- Professional cover letter explaining the demand letter
- References Section 13.3(a) of Stripe Services Agreement
- Mentions 30-day pre-arbitration notice period
- Includes key case details

## Features

✅ **PDF Attachment** - Not links (avoids spam filtering)
✅ **Professional Format** - Legal department appropriate language
✅ **Automatic Filename** - Timestamped and company-specific
✅ **Error Handling** - Graceful failure with user feedback
✅ **Button States** - Loading, success, and error indicators

## Testing

1. Complete the eSignature process
2. Click "Send to Stripe" button
3. Check sergei.tokmakov@gmail.com for the email with PDF attachment
4. Verify PDF contains the signed demand letter

## Production Use

To send to Stripe in production:
1. Change line 833 in `esign-proxy.js` from `sergei.tokmakov@gmail.com` to `complaints@stripe.com`
2. Uncomment the CC line or remove it
3. Set up proper email credentials in environment variables

## Security Notes

- Uses secure SMTP connection
- Credentials stored in environment variables (not code)
- PDF is downloaded and attached (not linked for security)
- Professional email formatting maintains legal credibility