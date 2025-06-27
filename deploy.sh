#!/bin/bash

# Vercel deployment script for eSignature APIs

echo "🚀 Deploying template-generator APIs to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "📦 Deploying to production..."
vercel --prod --confirm

echo "✅ Deployment complete!"
echo "🔗 Your API endpoints are now available at the deployed URL"
echo "📝 Don't forget to update the frontend API URL in:"
echo "   Tenant-Security-Deposit-Generator/index.html"