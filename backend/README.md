# PDF Toolkit Backend API

This is a serverless backend API for PDF manipulation tools, built with Express and deployed on Vercel Functions.

## Features

- **PDF Merge**: Combine multiple PDF files into one.
- **PDF Split**: Extract specific pages from a PDF.
- **PDF Convert**: Convert PDF to text format.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Run locally:

   ```
   npm run dev
   ```

3. Deploy to Vercel:
   ```
   vercel --prod
   ```

## API Endpoints

- `POST /api/merge` - Merge multiple PDFs (upload files as 'pdfs')
- `POST /api/split` - Split a PDF (upload file as 'pdf', specify startPage and endPage)
- `POST /api/convert` - Convert PDF to text (upload file as 'pdf')
- `GET /api/health` - Health check

## Security

- Rate limiting: 100 requests per 15 minutes per IP.
- CORS enabled.
- Helmet for security headers.

## Scalability

- Serverless architecture with Vercel Functions.
- In-memory processing to avoid file storage.
- Configured for global regions.

## Environment Variables

- `ALLOWED_ORIGINS`: Comma-separated list of allowed origins for CORS (default: '\*').
- `NODE_ENV`: Set to 'production' for production mode.

## Testing

Run tests with:

```
npm test
```

## Error Handling

- Comprehensive error handling with specific error messages.
- File validation for type and size.
- Custom error classes for better debugging.

## Production Deployment

1. Set environment variables in Vercel.
2. Deploy with `vercel --prod`.
3. Ensure CORS origins are set for your frontend domain.
