# Zaviroo — Music Player

## Overview
Full-stack music player built from scratch: React + Vite frontend, Express backend, 12 sample tracks streamed from SoundHelix.

## Architecture
- **Frontend**: React 18 + Vite 6 + TypeScript, dev server on port 5173 (mapped to host port 3000)
- **Backend**: Express.js API on port 8000, serves track metadata as JSON
- **Audio**: Streamed from external SoundHelix URLs via the browser `<audio>` element
- **Album art**: CSS gradients (no external image dependencies)

## Development
```bash
docker compose -f docker-compose.base44.yml up -d --build
```

## Key Details
- Frontend proxies `/api` requests to the backend via Vite's dev server proxy (`http://backend:8000`)
- Vite config conditionally adds `allowedHosts` when `BASE44_PREVIEW_MODE === '1'`
- No external secrets required — all sample data is public
- Backend uses nodemon for hot reload; frontend uses Vite HMR
