# fontextractor

Extract font families from any website instantly.

## Features

- Extract font families from any URL
- Clean industrial dark theme UI
- API endpoint for font extraction
- Mobile-responsive design
- Click-to-copy CSS functionality

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run production server
node dist/server/entry.mjs
```

## API Usage

```bash
curl -X POST http://localhost:4321/api/extract \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

## Tech Stack

- Astro
- Tailwind CSS
- Node.js adapter