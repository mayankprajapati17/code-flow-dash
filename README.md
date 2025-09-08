## Code Flow Dash

### Prerequisites
- **Node.js**: v18 or newer (recommended)
- **npm**: v9+ (comes with Node)

### Quick Start
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start both apps in one command:
   ```bash
   npm run dev:all
   ```
   - Runs root Vite app and `AlgolearnWeb` in parallel
   - Local URL (root app): `http://localhost:8080`
   - AlgolearnWeb dev command: `npm --prefix AlgolearnWeb run dev`

3. Or start only the root app (Vite):
   ```bash
   npm run dev
   ```
   - Local URL: `http://localhost:8080`
   - Network URL: shown in the terminal

If localhost doesn’t open, try binding to all interfaces:
```bash
npm run dev -- --host 0.0.0.0 --port 8080
```

### Build for Production
```bash
npm run build:all
```

Preview the production build locally:
```bash
npm run preview
```

### Project Scripts
- `npm run dev`: Start Vite dev server
- `npm run dev:all`: Start Vite and AlgolearnWeb together
- `npm run start:all`: Start Vite and AlgolearnWeb (AlgolearnWeb in production mode)
- `npm run build`: Build production assets
- `npm run build:all`: Build both root app and AlgolearnWeb
- `npm run preview`: Preview the built app
- `npm run lint`: Lint the codebase

### Environment Variables
No environment variables are required for local development. Supabase client configuration is pre-wired under `src/integrations/supabase/`.

### Troubleshooting
- **Port already in use (8080)**
  - Find PID: `netstat -ano | findstr :8080`
  - Kill: `taskkill /PID <pid> /F`

- **Browser can’t reach localhost**
  - Allow the Windows Firewall prompt for Node/Vite
  - Run with host binding: `npm run dev -- --host 0.0.0.0 --port 8080`
  - Try a different port: `npm run dev -- --port 5173`

- **Corporate proxy issues**
  - Ensure proxy excludes `localhost`
  - Access via the Network URL printed by Vite

### Tech Stack
- React 18 + TypeScript
- Vite 5
- Tailwind CSS + Radix UI + shadcn/ui
- TanStack Query
- Supabase (preconfigured client)

