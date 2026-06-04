# GreenMart

## Description
This is the frontend of our final cdac project 'GreenMart'

## Links
For the backend please go here<br>
https://github.com/D6-GreenMart/GreenMart-Backend<br><br>
For the project documentation please go here<br>
https://drive.google.com/file/d/1H6oIPP48zm1A4mCptkiUe8_rTSrzwNHO/view?usp=sharing<br>

### Instruction
To run the webapp use the following command<br>
```bash
npm install
npm run dev
```

## Local API URL
The frontend reads its backend URL from `src/services/config.js`.

For local development, no extra setup is needed. It falls back to:

```txt
http://localhost:8080/api/v1
```

## Vercel Deployment
Deploy this repo from the `deploy/showcase` branch.

Use these Vercel settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Add this environment variable in Vercel:

```txt
VITE_API_URL=https://your-backend-domain/api/v1
```

After changing `VITE_API_URL`, redeploy the frontend.

The `vercel.json` file keeps React routes working after refresh by sending all routes to `index.html`.
