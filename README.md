

**Algolearn - Comprehensive DSA Learning & Code Execution Platform**

**Overview**
Algolearn is a modern full-stack web application designed as an all-in-one coding practice platform for Data Structures and Algorithms (DSA). It combines a sleek landing page showcasing platform capabilities with an integrated code execution environment supporting Python and Java. The platform features curated DSA problems organized by topics, real-time code execution, AI-powered assistance, and progress tracking, all built with React and enhanced by Supabase backend services.

**System Architecture**

**Frontend Architecture**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: React Router DOM for client-side navigation
- **Styling**: CSS custom properties with comprehensive design system
- **Authentication**: Supabase Auth integration
- **Database**: Supabase PostgreSQL with real-time capabilities

**Backend Architecture**
- **Backend-as-a-Service**: Supabase for authentication, database, and real-time features
- **Code Execution**: Integrated Node.js/Express server with Python and Java support
- **API Design**: RESTful API with proxy configuration via Vite
- **Development**: Hot reload with integrated server setup

**Key Components**

**Landing Page System**
- **Hero Section**: Animated introduction with call-to-action buttons and platform statistics
- **Features Showcase**: AI-powered learning, secure execution, and performance metrics
- **DSA Topics Preview**: Interactive grid of algorithm categories with problem counts
- **Code Execution Preview**: Visual demonstration of real-time code execution capabilities
- **Responsive Design**: Mobile-first approach with Framer Motion animations

**Integrated Code Editor**
- **Multi-Language Support**: Python and Java execution with language-specific snippets
- **Real-Time Execution**: Instant code compilation and execution with output display
- **AI Assistance**: Error explanation and debugging help powered by Replit AI
- **User Interface**: Monaco-style editor with syntax highlighting and line numbers
- **Output Management**: Copy, clear, and error handling functionality

**DSA Learning System**
- **Topic Organization**: Comprehensive categorization (Arrays, Trees, Graphs, etc.)
- **Difficulty Levels**: Easy, Medium, Hard problem classification
- **LeetCode Integration**: Direct links to original problem statements
- **Progress Tracking**: User completion status and streak display
- **Problem Database**: 200+ curated DSA problems across multiple categories

**Authentication & User Management**
- **Supabase Auth**: Email/password and social login integration
- **User Profiles**: Progress tracking and personalized dashboards
- **Session Management**: Secure token-based authentication
- **Profile Management**: User preferences and settings

**Data Flow**

**Learning Flow**
1. **Landing Page**: Users discover platform capabilities and features
2. **Topic Selection**: Browse DSA categories and select learning paths
3. **Problem Access**: Navigate to specific problems via LeetCode links
4. **Code Practice**: Use integrated editor for solution development
5. **Real-Time Execution**: Test solutions with immediate feedback
6. **Progress Tracking**: Monitor completion status and maintain streaks

**Code Execution Flow**
1. **Language Selection**: Choose between Python and Java
2. **Code Input**: Write solutions in the integrated editor
3. **Execution Request**: Submit code via API proxy to execution server
4. **Processing**: Server compiles/interprets and executes code securely
5. **Result Display**: Output, errors, and execution time shown in real-time
6. **AI Assistance**: Automatic error explanations when execution fails

**External Dependencies**

**Frontend Dependencies**
- **@supabase/supabase-js**: Database and authentication client
- **@tanstack/react-query**: Server state management and caching
- **framer-motion**: Animation and transition effects
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **react-router-dom**: Client-side routing
- **lucide-react**: Modern icon library

**Backend Dependencies**
- **Supabase**: Backend-as-a-Service platform
- **Express**: Code execution server framework
- **@replit/ai-modelfarm**: AI-powered code assistance

**Database Schema**
- **User Profiles**: Personal information and preferences
- **Progress Tracking**: Problem completion and streak data
- **Session Management**: Authentication and user state
- **Problem Metadata**: Topic categorization and difficulty levels

**Deployment Strategy**

**Development Environment**
- **Frontend**: Vite dev server on port 8080
- **Backend**: Express server on port 3001 with API proxy
- **Database**: Supabase cloud instance
- **Commands**: `npm run dev:integrated` for full-stack development

**Production Build**
- **Frontend**: Static assets optimized with Vite
- **Backend**: Serverless functions via Supabase Edge Functions
- **CDN**: Global content delivery for optimal performance
- **Commands**: `npm run build` for production optimization

**Security Considerations**
- **Row Level Security**: Supabase RLS policies for data protection
- **Code Execution Sandboxing**: Isolated execution environment
- **Authentication**: JWT-based secure session management
- **Input Validation**: Zod schemas for type-safe API interactions
- **CORS Configuration**: Secure cross-origin resource sharing

**Recent Architecture Updates**
- **Integrated Development**: Unified landing page and code editor experience
- **Enhanced DSA Coverage**: Expanded to 200+ problems across 10+ categories
- **LeetCode Integration**: Direct problem linking for seamless workflow
- **Responsive Design**: Mobile-optimized interface with touch support
- **Performance Optimization**: Lazy loading and code splitting implementation

This platform serves as a comprehensive solution for algorithm learning, combining educational content with practical coding experience in a modern, user-friendly interface.
-----

## ⚡ Getting Started

Follow these simple steps to get the project up and running locally.

### 1\. Clone the Repository

```bash
git clone https://github.com/mayankprajapati17/code-flow-dash.git
cd code-flow-dash
```

### 2\. Install Dependencies

First, install the backend dependencies, then the frontend.

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3\. Run the Project

With the dependencies installed, you can start both the backend and frontend servers.

```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd ../client
npm run dev
```

The application will now be running at `http://localhost:3000`.



-----

## 🤝 Contributing

Contributions are what make the open-source community an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

-----

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

-----

## 👨‍💻 Author

Developed with ❤️ by **Mayank Prajapati**

-----


