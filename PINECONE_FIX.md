# Pinecone Index Configuration Fix

## Problem
Your Pinecone index is configured for **1536 dimensions** (OpenAI embedding size), but Google's `embedding-001` model produces **768 dimensions**.

## Error Message
```
Vector dimension 768 does not match the dimension of the index 1536
```

## Solution Options

### Option 1: Recreate Pinecone Index (RECOMMENDED)
Delete the old index and create a new one with the correct dimensions.

#### Steps:

1. **Go to Pinecone Dashboard**: https://app.pinecone.io

2. **Delete the existing index** named `anurag` (or your index name)

3. **Create a new index** with these settings:
   - **Name**: `anurag` (or your preferred name)
   - **Dimensions**: **768** (for Google embedding-001 model)
   - **Metric**: `cosine` (recommended for text embeddings)
   - **Cloud**: Choose your cloud provider
   - **Region**: Choose your preferred region

4. **Update your `.env` file** (if you changed the index name):
   ```bash
   PINECONE_INDEX_NAME=anurag
   ```

5. **Re-upload your documents** - They will be re-embedded with the correct dimensions

### Option 2: Use a Different Embedding Model (Not Recommended)
Switch to an embedding model that produces 1536 dimensions, but this would require finding an alternative to Google Gemini embeddings.

## What Happens After Fix?

Once you recreate the index with 768 dimensions:
- ✅ New documents will upload successfully
- ✅ Embeddings will be generated correctly
- ✅ Chat/search will work properly
- ⚠️ Old documents need to be re-uploaded (the old ones won't be accessible)

## Current Configuration

Your app is now configured to use:
- **Embedding Model**: `models/embedding-001` (Google Gemini)
- **Expected Dimensions**: 768
- **Chat Model**: `gemini-2.0-flash-exp`

## Testing After Fix

1. Upload a new PDF document
2. Check the console - you should see:
   ```
   --- Generating embeddings for document: [id]
   --- Split into X parts
   --- Storing embeddings in [id] namespace...
   ```
3. Try asking questions in the chat
4. Verify no dimension mismatch errors appear

## Need Help?

If you need assistance:
1. Check Pinecone documentation: https://docs.pinecone.io/
2. Verify your API key has quota remaining
3. Check the browser console for any errors

---

**Note**: The dimension mismatch is a one-time fix. After recreating the index with the correct dimensions, everything will work smoothly with your new Google API key.
