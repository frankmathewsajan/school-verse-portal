# Development Setup & Deployment Guide

## 🚀 Development Environment Setup

### **Prerequisites**
- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE with extensions

### **Required VS Code Extensions**
```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

## 📦 Project Installation

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/school-verse-portal.git
cd school-verse-portal
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
Create a `.env` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Development Settings
VITE_DEV_MODE=true
VITE_API_BASE_URL=http://localhost:5173
```

### **4. Supabase Setup**
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Initialize Supabase
supabase init

# Start local development
supabase start
```

### **5. Database Migration**
```sql
-- Run these SQL commands in your Supabase dashboard

-- Enable Row Level Security
ALTER TABLE hero_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_section ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_life_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_team ENABLE ROW LEVEL SECURITY;

-- Create policies (see database documentation for full policies)
CREATE POLICY "Public read access" ON hero_section FOR SELECT USING (true);
-- ... additional policies
```

## 🏗️ Project Structure Deep Dive

### **Core Configuration Files**

#### **Vite Configuration** (`vite.config.ts`)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui': ['lucide-react', 'class-variance-authority'],
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  }
})
```

#### **TypeScript Configuration** (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **Tailwind Configuration** (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
```

## 🔧 Development Commands

### **Available Scripts** (`package.json`)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

### **Development Workflow**

#### **Starting Development Server**
```bash
# Start development server
npm run dev

# Start with specific port
npm run dev -- --port 3000

# Start with host access
npm run dev -- --host
```

#### **Code Quality Commands**
```bash
# Type checking
npm run type-check

# Linting
npm run lint

# Auto-fix linting issues
npm run lint -- --fix

# Format code
npm run format

# Run tests
npm run test

# Test with coverage
npm run test:coverage
```

## 🏗️ Build Process

### **Production Build**
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build -- --analyze
```

### **Build Output Structure**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── vendor-[hash].js
├── favicon.ico
└── robots.txt
```

### **Build Optimization**
- **Code Splitting**: Automatic chunk splitting for better caching
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS compression
- **Asset Optimization**: Image compression and format optimization

## 🚀 Deployment Options

### **1. Vercel Deployment (Recommended)**

#### **Automatic Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Production deployment
vercel --prod
```

#### **Vercel Configuration** (`vercel.json`)
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "env": {
    "VITE_SUPABASE_URL": "@supabase-url",
    "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
  },
  "build": {
    "env": {
      "VITE_SUPABASE_URL": "@supabase-url",
      "VITE_SUPABASE_ANON_KEY": "@supabase-anon-key"
    }
  }
}
```

### **2. Netlify Deployment**

#### **Netlify Configuration** (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_SUPABASE_URL = "your_production_supabase_url"
  VITE_SUPABASE_ANON_KEY = "your_production_supabase_anon_key"
```

### **3. Firebase Hosting**

#### **Firebase Setup**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy to Firebase
firebase deploy
```

#### **Firebase Configuration** (`firebase.json`)
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      }
    ]
  }
}
```

### **4. GitHub Pages Deployment**

#### **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🌐 Environment Management

### **Environment Variables**
```env
# Development Environment (.env.development)
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_anon_key
VITE_DEV_MODE=true

# Production Environment (.env.production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
VITE_DEV_MODE=false

# Staging Environment (.env.staging)
VITE_SUPABASE_URL=https://your-staging-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_staging_anon_key
VITE_DEV_MODE=false
```

### **Environment-Specific Configuration**
```typescript
// src/config/environment.ts
const config = {
  development: {
    apiUrl: 'http://localhost:54321',
    enableDevTools: true,
    logLevel: 'debug'
  },
  production: {
    apiUrl: 'https://your-project.supabase.co',
    enableDevTools: false,
    logLevel: 'error'
  },
  staging: {
    apiUrl: 'https://your-staging-project.supabase.co',
    enableDevTools: true,
    logLevel: 'warn'
  }
};

export const environment = config[import.meta.env.MODE] || config.development;
```

## 🔒 Security Best Practices

### **Environment Security**
- **Never commit `.env` files** to version control
- **Use environment-specific secrets** for each deployment
- **Rotate API keys regularly** and update in all environments
- **Enable Row Level Security** on all Supabase tables

### **Build Security**
```typescript
// src/utils/security.ts
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .trim();
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return !url.includes('javascript:');
  } catch {
    return false;
  }
};
```

## 📊 Performance Optimization

### **Code Splitting Strategy**
```typescript
// Lazy loading for better performance
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Materials = lazy(() => import('./pages/Materials'));

// Route-based code splitting
const router = createBrowserRouter([
  {
    path: "/admin",
    element: <Suspense fallback={<Loading />}><AdminDashboard /></Suspense>
  },
  {
    path: "/gallery",
    element: <Suspense fallback={<Loading />}><Gallery /></Suspense>
  }
]);
```

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck

# Audit for security vulnerabilities
npm audit
```

## 🔍 Testing Strategy

### **Unit Testing Setup**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true
  }
})
```

### **Test Structure**
```
src/tests/
├── __mocks__/
│   └── supabase.ts
├── components/
│   └── Button.test.tsx
├── pages/
│   └── Index.test.tsx
├── services/
│   └── ContentService.test.ts
└── setup.ts
```

## 📈 Monitoring & Analytics

### **Error Tracking**
```typescript
// src/utils/errorTracking.ts
export const trackError = (error: Error, context?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    // Send to error tracking service
    console.error('Error:', error, context);
  }
};
```

### **Performance Monitoring**
```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};
```

This comprehensive development and deployment guide provides all the necessary information to set up, develop, and deploy the School-Verse-Portal project successfully across different environments and platforms.
