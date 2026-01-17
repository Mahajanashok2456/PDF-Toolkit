# PDF Toolkit Frontend

A React-based frontend for PDF manipulation tools, built with Tailwind CSS and deployed as a PWA.

## Features

- **Responsive Design**: Mobile-friendly with Tailwind CSS.
- **Dark Mode**: Toggle between light and dark themes.
- **PWA Support**: Installable as a progressive web app.
- **Error Handling**: User-friendly error messages and validation.
- **Performance Optimized**: Code splitting, lazy loading, and memoization.

## Setup

1. Install dependencies:

   ```
   npm install
   ```

2. Run locally:

   ```
   npm start
   ```

3. Build for production:
   ```
   npm run build
   ```

## Testing

- Unit tests: `npm test`
- E2E tests: `npm run cypress:open` or `npm run cypress:run`

## Accessibility

- ARIA labels for interactive elements.
- Keyboard navigation support.
- High contrast for dark mode.

## Production Deployment

1. Build the app: `npm run build`
2. Deploy to your hosting service (e.g., Netlify, Vercel).
3. Ensure backend API is accessible and CORS is configured.

## Environment Variables

- No specific env vars required, but backend URL can be configured in App.js for production.
