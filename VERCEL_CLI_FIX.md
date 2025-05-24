# Vercel CLI Method to Remove Connected Environment Variable

## If all else fails, use Vercel CLI:

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Link to your project
```bash
cd /path/to/your/project
vercel link
```

### Step 4: Remove the environment variable
```bash
vercel env rm GROQ_API_KEY production
vercel env rm GROQ_API_KEY preview
vercel env rm GROQ_API_KEY development
```

### Step 5: Add new environment variable
```bash
vercel env add GROQ_API_KEY production
# When prompted, paste: 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

vercel env add GROQ_API_KEY preview
# When prompted, paste: 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

vercel env add GROQ_API_KEY development
# When prompted, paste: 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
```

### Step 6: Redeploy
```bash
vercel --prod
```

This bypasses the UI restrictions and forces the environment variable update.
