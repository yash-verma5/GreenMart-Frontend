# Frontend Deployment Guide

## Prerequisites
- Node.js (Latest LTS recommended)
- BPM (npm or yarn)

## Environment Variables
The application requires the following environment variables to be set at build time:

| Variable | Description | Default (Dev) |
|----------|-------------|---------------|
| `REACT_APP_API_URL` | Base URL of the backend API | `http://localhost:8080/api/v1` |

## Building the Application

### Using npm
```bash
npm install
npm run build
```
The build artifacts will be generated in the `build/` directory.

## Cloud Deployment (Example: Vercel/Netlify)
1. Connect your GitHub repository.
2. Set the **Root Directory** to `GreenMart-Frontend` (if it's a monorepo) or leave as root.
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`
5. Configure the `REACT_APP_API_URL` in the platform's environment variables settings. Set it to your deployed backend URL (e.g., `https://greenmart-backend.railway.app/api/v1`).
