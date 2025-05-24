# Vercel GROQ_API_KEY Disconnect Guide

## The Problem:
Your GROQ_API_KEY is connected through a "store integration" which prevents manual updates. You need to disconnect it first.

## Solution Steps:

### Step 1: Disconnect Integration
1. In your Vercel dashboard, go to **Integrations** (left sidebar)
2. Look for **Groq** or **GroqCloud** integration
3. Click on it and **Disconnect** or **Remove**

### Step 2: Remove Old Environment Variable
1. Go back to **Settings** → **Environment Variables**
2. Click the **Remove** button next to GROQ_API_KEY
3. Confirm removal

### Step 3: Add New Environment Variable
1. Click **Add New** environment variable
2. **Name:** `GROQ_API_KEY`
3. **Value:** `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`
4. **Environments:** Select all (Production, Preview, Development)
5. Click **Save**

### Step 4: Force Redeploy
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Uncheck "Use existing Build Cache"
4. Click **Redeploy**

## Alternative: Quick Fix
If you can't find the integration:
1. Click **Remove** button (visible in your screenshot)
2. Immediately add new variable with your new key
3. Redeploy

## Verification:
After redeployment, test at: https://template.terms.law/api-key-debug.html
Check Groq console to see which key receives the API call.
