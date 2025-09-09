# Algolearn Integration Guide

This project now includes the AlgolearnWeb code execution platform integrated into the main landing page.

## 🚀 Quick Start

### Option 1: Integrated Development (Recommended)
```bash
# Start both the main project and AlgolearnWeb server
npm run dev:integrated
```

This will start:
- Main project on http://localhost:8080
- AlgolearnWeb server on http://localhost:5000

### Option 2: Manual Start
```bash
# Terminal 1: Start AlgolearnWeb server
cd src/components/AlgolearnWeb
npm run dev

# Terminal 2: Start main project
npm run dev
```

## 🔗 Navigation

- **Landing Page**: http://localhost:8080
- **Code Editor**: http://localhost:8080/code-editor
- **AlgolearnWeb API**: http://localhost:5000/api

## 🎯 Features

### Main Landing Page
- Hero section with animated laptop mockup
- Code execution preview
- DSA topics overview
- Platform features showcase

### Integrated Code Editor
- Real-time Python & Java code execution
- Monaco Editor with syntax highlighting
- AI-powered error explanations
- Secure sandbox environment
- Execution statistics and monitoring

## 🔧 Integration Details

### Routing
- `/` - Main landing page
- `/code-editor` - Integrated AlgolearnWeb application

### API Proxy
The main Vite server proxies `/api` requests to the AlgolearnWeb server (port 5000) to handle code execution.

### Navigation
- "Get Started" button in hero section → Code Editor
- "Try Code Editor" button in features section → Code Editor
- Back button in code editor → Landing page

## 🛠️ Development

### File Structure
```
src/
├── components/
│   ├── AlgolearnWeb/          # Full-stack code execution platform
│   │   ├── client/            # React frontend
│   │   ├── server/            # Express backend
│   │   └── package.json       # AlgolearnWeb dependencies
│   ├── HeroSection.tsx        # Landing page hero
│   ├── CodeExecutionPreview.tsx # Code editor preview
│   └── ...
├── pages/
│   ├── Index.tsx              # Main landing page
│   ├── CodeEditor.tsx         # AlgolearnWeb wrapper
│   └── NotFound.tsx           # 404 page
└── App.tsx                    # Main app with routing
```

### Adding New Features
1. **Landing Page Features**: Add components to `src/components/`
2. **Code Editor Features**: Modify `src/components/AlgolearnWeb/client/src/`
3. **API Endpoints**: Add to `src/components/AlgolearnWeb/server/routes/`

## 🚨 Troubleshooting

### Port Conflicts
- Main project uses port 8080
- AlgolearnWeb server uses port 5000
- Ensure both ports are available

### API Issues
- Check that AlgolearnWeb server is running on port 5000
- Verify proxy configuration in `vite.config.ts`
- Check browser console for CORS errors

### Build Issues
- Ensure all dependencies are installed in both projects
- Run `npm install` in both root and `src/components/AlgolearnWeb/`

### Routing Issues
- **Wouter Conflict**: The AlgolearnWeb project originally used Wouter for routing, which conflicts with React Router DOM
- **Solution**: Modified AlgolearnWeb App.tsx to directly render the Home component instead of using Wouter routing
- **Import Paths**: Fixed all `@` alias imports to use relative paths to avoid conflicts with the main project's path resolution

## 📝 Notes

- The integration maintains the original AlgolearnWeb functionality
- All code execution features work as expected
- The landing page provides a professional introduction to the platform
- Users can seamlessly transition between marketing and actual usage 