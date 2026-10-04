Summary of fixes for deployment connection issue

What I changed and why

- `frontend/src/utils/constant.js`
  - Replaced hardcoded `http://localhost:3000` fallback with `import.meta.env.VITE_BACKEND_URL` fallback. This ensures the frontend uses the build-time `VITE_BACKEND_URL` when available and avoids embedding a localhost URL into production builds.

- `frontend/src/main.jsx`
  - Switched `axios.defaults.baseURL` to use `import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"`. This makes axios use the Vite env variable when present.

- `backend/index.js`
  - Replaced hardcoded CORS origin with `process.env.FRONTEND_URL || 'http://localhost:5173'` and enabled `credentials: true`. This allows the backend to accept requests from the deployed frontend origin when `FRONTEND_URL` is set in production.
  - Added `app.set('trust proxy', true)` and bound the server to `HOST` (`0.0.0.0` by default) so the backend listens on external interfaces in production.

Why this fixed the error

- The error `POST http://localhost:3000/api/v1/user/login net::ERR_CONNECTION_REFUSED` happened because the built frontend referenced `http://localhost:3000` (either hardcoded or from env at build time). In production the backend isn't running on the user's machine at that address, so the request failed.
- Fixing the source to use `VITE_BACKEND_URL` and updating `.env` at build time ensures the build embeds the correct production backend URL.
- Updating backend CORS to read `FRONTEND_URL` and binding to `0.0.0.0` makes the backend reachable by the deployed frontend and allows cookies/credentials when required.

How to use these changes

1. Backend environment variables (on your server/host):

   - `PORT` (optional)
   - `HOST` (optional, default `0.0.0.0`)
   - `FRONTEND_URL` — set this to your frontend origin, e.g. `https://www.yourfrontend.com`

2. Frontend environment variables (at build-time):

   - In `frontend/.env` or in your hosting provider build settings, set `VITE_BACKEND_URL` to your backend URL, e.g. `https://api.yourdomain.com`.

3. Rebuild frontend and redeploy:

   ```bash
   cd frontend
   npm install
   npm run build
   # deploy the produced build/dist to your static host
   ```

4. Start backend (on server):

   ```bash
   cd backend
   npm install
   # set env vars FRONTEND_URL, PORT, HOST as needed
   node index.js
   ```

Verification steps

- Open your deployed frontend, open DevTools → Network, and confirm login request goes to `https://api.yourdomain.com/api/v1/user/login` (not `localhost`).
- Confirm backend returns 200/401 instead of connection refused.

If you want, I can also:
- Update `frontend/.env` to a specific production URL and run a local build here.
- Configure backend to allow multiple origins or a whitelist.

Files changed by me:

- [frontend/src/utils/constant.js](frontend/src/utils/constant.js#L1)
- [frontend/src/main.jsx](frontend/src/main.jsx#L14)
- [backend/index.js](backend/index.js#L1)

If you want me to proceed with updating `frontend/.env` and building, tell me the production backend URL to use.
