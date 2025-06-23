// Configuration Checker for Email and Google Drive Integration
require('dotenv').config();

console.log('🔧 Configuration Checker\n');

// Check Email Configuration
console.log('📧 EMAIL CONFIGURATION:');
const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

console.log(`   HOST: ${emailHost || '❌ Missing'}`);
console.log(`   PORT: ${emailPort || '❌ Missing'}`);
console.log(`   USER: ${emailUser || '❌ Missing'}`);
console.log(`   PASS: ${emailPass ? '✅ Set (length: ' + emailPass.length + ')' : '❌ Missing'}`);

if (!emailUser || !emailPass) {
    console.log('\n   ⚠️  Email not configured. Emails to Stripe will fail.');
    console.log('   📖 See email-setup.md for configuration instructions.');
} else {
    console.log('\n   ✅ Email configuration looks good!');
}

// Check Google Drive Configuration
console.log('\n📁 GOOGLE DRIVE CONFIGURATION:');
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const googleRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;
const googleApiKey = process.env.GOOGLE_DRIVE_API_KEY;
const googleFolderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

console.log(`   CLIENT_ID: ${googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID' ? '✅ Set' : '❌ Missing'}`);
console.log(`   CLIENT_SECRET: ${googleClientSecret && googleClientSecret !== 'YOUR_GOOGLE_CLIENT_SECRET' ? '✅ Set' : '❌ Missing'}`);
console.log(`   REFRESH_TOKEN: ${googleRefreshToken && googleRefreshToken !== 'YOUR_GOOGLE_REFRESH_TOKEN' ? '✅ Set' : '❌ Missing'}`);
console.log(`   API_KEY: ${googleApiKey && googleApiKey !== 'YOUR_GOOGLE_DRIVE_API_KEY' ? '✅ Set' : '❌ Missing'}`);
console.log(`   FOLDER_ID: ${googleFolderId || '⚪ Optional (will use root folder)'}`);

const googleConfigured = googleClientId && googleClientId !== 'YOUR_GOOGLE_CLIENT_ID' &&
                         googleClientSecret && googleClientSecret !== 'YOUR_GOOGLE_CLIENT_SECRET' &&
                         googleRefreshToken && googleRefreshToken !== 'YOUR_GOOGLE_REFRESH_TOKEN';

if (!googleConfigured) {
    console.log('\n   ⚠️  Google Drive not configured. Auto-backup to Drive will be disabled.');
    console.log('   📖 See google-drive-setup.md for configuration instructions.');
} else {
    console.log('\n   ✅ Google Drive configuration looks good!');
}

// Overall Status
console.log('\n🔍 OVERALL STATUS:');
if (emailUser && emailPass && googleConfigured) {
    console.log('   ✅ All integrations configured and ready!');
} else if (emailUser && emailPass) {
    console.log('   ⚪ Email ready, Google Drive optional');
} else if (googleConfigured) {
    console.log('   ⚪ Google Drive ready, email needs setup');
} else {
    console.log('   ⚠️  Setup required for email and/or Google Drive functionality');
}

console.log('\n📋 QUICK SETUP:');
console.log('   1. Copy .env.example to .env');
console.log('   2. Fill in your credentials');
console.log('   3. Restart the proxy server');
console.log('   4. Run this checker again to verify\n');

// Test email configuration if provided
if (emailUser && emailPass) {
    console.log('🧪 Testing email configuration...');
    
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
        host: emailHost,
        port: emailPort,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });
    
    transporter.verify((error, success) => {
        if (error) {
            console.log('   ❌ Email test failed:', error.message);
            if (error.message.includes('535')) {
                console.log('   💡 This usually means you need a Gmail App Password (not your regular password)');
                console.log('   📖 See email-setup.md for App Password setup instructions');
            }
        } else {
            console.log('   ✅ Email configuration verified successfully!');
        }
    });
}