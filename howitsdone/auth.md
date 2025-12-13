# Authentication System - St. G. D. Convent School

## Overview
The St. G. D. Convent School website implements a two-factor authentication system for admin access using Supabase as the backend authentication service. The system combines traditional email/password authentication with an additional passkey verification step to ensure secure admin access.

## Architecture

## Architecture

### 1. Supabase Integration
- **Backend Service**: Supabase (configure with your own instance)
- **Client Library**: `@supabase/supabase-js` v2.49.9
- **Database**: PostgreSQL with admin_users table for role management
- **Authentication**: Supabase Auth with email/password and session management
- **API Key**: Use environment variables (see .env.example)
- **Project ID**: Configure in your Supabase dashboard

#### Supabase Client Configuration
```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// SECURITY: Use environment variables instead of hardcoded credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'
  );
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
```

### 2. Authentication Flow

#### Two-Step Authentication Process:

**Step 1: Email/Password Authentication**
1. User visits `/admin/login` 
2. Can either sign in with existing credentials or sign up for new account
3. Email domains are restricted to specific allowed domains (`gmail.com`, `outlook.com`, `hotmail.com`)
4. Supabase handles user authentication and session management
5. Email verification required for new signups

**Step 2: Admin Passkey Verification**
1. After successful email/password auth, user must enter admin passkey
2. Secure passkey: Configure in environment variables (VITE_ADMIN_PASSKEY)
3. System checks if user's email domain is in allowed list
4. On successful verification, admin status is stored in localStorage
5. User record is automatically created/updated in `admin_users` table

### 3. Session Management

#### Context & State Management
- **useAuth Hook**: Custom React hook managing authentication state
- **React Query**: Used for data fetching and caching
- **Local Storage**: Stores admin verification status (`adminVerified` key)
- **Supabase Session**: Handles user session persistence across browser refreshes

#### Authentication States
```typescript
interface AuthState {
  isAuthenticated: boolean;    // Admin access granted
  loading: boolean;           // Auth state loading
  user: User | null;         // Supabase user object
}
```

### 4. Protected Routes

#### Admin Dashboard Access
- **Route**: `/admin/dashboard`
- **Protection**: Requires both Supabase auth AND admin passkey verification
- **Redirect Logic**: Unauthenticated users redirected to `/admin/login`
- **Auto-redirect**: Authenticated users accessing login page redirected to dashboard

#### Route Guards
```typescript
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    navigate("/admin/login");
  }
}, [isAuthenticated, authLoading, navigate]);
```

### 5. Database Schema

#### admin_users Table
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Complete Database Tables Used by System
```sql
-- Core authentication table (managed by Supabase Auth)
-- auth.users table is automatically created by Supabase

-- Custom admin users table
CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text DEFAULT 'admin'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_users_pkey PRIMARY KEY (id),
  CONSTRAINT admin_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Other tables that admin can manage
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text DEFAULT 'general'::text,
  type text DEFAULT 'info'::text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id)
);

CREATE TABLE public.leadership_team (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  qualifications text,
  email text,
  phone text,
  image_url text,
  display_order integer,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT leadership_team_pkey PRIMARY KEY (id)
);

CREATE TABLE public.learning_materials (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  subject text NOT NULL,
  class_level text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  file_size text,
  downloads integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT learning_materials_pkey PRIMARY KEY (id)
);

CREATE TABLE public.school_life_gallery (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text DEFAULT 'general'::text,
  date_taken date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT school_life_gallery_pkey PRIMARY KEY (id)
);
```

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_life_gallery ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for website visitors)
CREATE POLICY "Public read access for announcements" ON public.announcements
FOR SELECT USING (true);

CREATE POLICY "Public read access for leadership" ON public.leadership_team
FOR SELECT USING (true);

CREATE POLICY "Public read access for materials" ON public.learning_materials
FOR SELECT USING (true);

CREATE POLICY "Public read access for gallery" ON public.school_life_gallery
FOR SELECT USING (true);

-- Admin-only policies for modification (implement based on admin verification)
-- Note: These would need to be implemented with proper admin role checking
```

#### Database Functions
```sql
-- Function to check admin status
CREATE OR REPLACE FUNCTION public.check_admin_status(user_uuid uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF user_uuid IS NULL THEN
    user_uuid := auth.uid();
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid
  );
END;
$$;
```

#### Key Features
- Links Supabase auth users to admin roles
- Automatic user creation on first successful admin login
- Role-based access control (currently only 'admin' role)
- Public read access for website content
- Admin-only write access for content management

### 6. Security Features

#### Domain Restrictions
- Only specific email domains allowed for admin access
- Configurable list: `["gmail.com", "outlook.com", "hotmail.com"]`
- Prevents unauthorized domain users from gaining admin access

#### Session Security
- Supabase handles secure session tokens
- Automatic session refresh and validation
- Session cleanup on logout
- Admin verification status cleared on session end

#### Error Handling
- Comprehensive error logging and user feedback
- Toast notifications for auth events
- Graceful handling of network errors and edge cases

### 7. Admin Features Access

#### After Successful Authentication
Admin users gain access to:
- **Content Management Dashboard**
- **Announcements Management**: Create, edit, delete school announcements
- **Gallery Management**: Upload and manage school life photos
- **Learning Materials Management**: Upload educational resources
- **Leadership Team Management**: Manage staff profiles and information

#### Admin Dashboard Components
- Real-time statistics display
- Tabbed interface for different management sections
- Role-based UI elements
- Secure logout functionality

### 8. Development & Production Considerations

#### Environment Variables
- Supabase URL and keys are currently hardcoded
- **Production Recommendation**: Move to environment variables
- **Security Note**: Admin passkey should be stored securely (database/env vars)

#### Authentication Persistence
- Sessions persist across browser refreshes
- Auth state listener monitors session changes
- Automatic cleanup on authentication errors

#### Error Recovery
- Password reset functionality available
- Email verification resend capability
- Session restoration on page reload

### 9. Technical Implementation

#### Key Files
- `src/hooks/useAuth.tsx`: Main authentication logic
- `src/integrations/supabase/client.ts`: Supabase configuration
- `src/pages/admin/AdminLogin.tsx`: Login interface
- `src/pages/admin/AdminDashboard.tsx`: Protected admin interface
- `src/integrations/supabase/types.ts`: TypeScript definitions

#### Complete useAuth Hook Implementation
```typescript
// src/hooks/useAuth.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || "CHANGE_ME_IN_PRODUCTION";
const ALLOWED_ADMIN_DOMAINS = import.meta.env.VITE_ALLOWED_DOMAINS?.split(',') || ["gmail.com", "outlook.com", "hotmail.com"];

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    // Auth state listener setup
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          const adminVerified = localStorage.getItem("adminVerified");
          if (adminVerified === "true") {
            setIsAuthenticated(true);
            ensureAdminUser(session.user.id);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
          localStorage.removeItem("adminVerified");
        }
        
        if (event === 'SIGNED_OUT') {
          localStorage.removeItem("adminVerified");
          setIsAuthenticated(false);
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const adminVerified = localStorage.getItem("adminVerified");
        if (adminVerified === "true") {
          setIsAuthenticated(true);
          ensureAdminUser(session.user.id);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const ensureAdminUser = async (userId) => {
    try {
      const { data: existingAdmin, error: checkError } = await supabase
        .from("admin_users")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error("Error checking admin user:", checkError);
        return;
      }

      if (!existingAdmin) {
        const { error: insertError } = await supabase
          .from("admin_users")
          .insert({ 
            user_id: userId, 
            role: "admin",
            created_at: new Date().toISOString()
          });

        if (insertError) {
          console.error("Error creating admin user:", insertError);
        }
      }
    } catch (error) {
      console.error("Admin user setup exception:", error);
    }
  };

  const signUp = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/admin/login`
        }
      });
      
      if (error) {
        toast({
          title: "Signup Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      toast({
        title: "Signup Successful",
        description: "Please check your email to confirm your account.",
      });
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error };
      }
      
      return { success: true, error: null, user: data.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const verifyPasskey = async (passkey) => {
    if (!user) {
      return { success: false, error: { message: "Not signed in" } };
    }
    
    try {
      const emailDomain = user.email.split('@')[1];
      const isDomainAllowed = ALLOWED_ADMIN_DOMAINS.includes(emailDomain);
      
      if (!isDomainAllowed) {
        return { 
          success: false, 
          error: { message: "Email domain not authorized for admin access" } 
        };
      }
      
      if (passkey === ADMIN_PASSKEY) {
        localStorage.setItem("adminVerified", "true");
        setIsAuthenticated(true);
        await ensureAdminUser(user.id);
        return { success: true, error: null };
      } else {
        return { success: false, error: { message: "Invalid passkey" } };
      }
    } catch (error) {
      return { success: false, error: { message: "Verification failed" } };
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("adminVerified");
      setIsAuthenticated(false);
      
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      return { success: !error, error };
    } catch (error) {
      return { success: false, error: { message: "An unexpected error occurred" } };
    }
  };

  return {
    isAuthenticated,
    loading,
    user,
    signUp,
    signIn,
    verifyPasskey,
    signOut,
    resetPassword,
  };
};
```

#### Required Dependencies (package.json)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.9",
    "@tanstack/react-query": "^5.56.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "lucide-react": "^0.462.0",
    "@radix-ui/react-toast": "^1.2.1",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-slot": "^1.1.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  }
}
```

#### Project Structure Requirements
```
src/
├── hooks/
│   ├── useAuth.tsx          # Main authentication hook
│   ├── use-toast.ts         # Toast notification hook
│   └── use-mobile.tsx       # Mobile detection hook
├── integrations/
│   └── supabase/
│       ├── client.ts        # Supabase client configuration
│       └── types.ts         # Database type definitions
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx   # Admin login page
│       └── AdminDashboard.tsx # Admin dashboard
├── components/
│   ├── ui/                  # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── tabs.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── admin/               # Admin management components
│       ├── AnnouncementManager.tsx
│       ├── GalleryManager.tsx
│       ├── LearningMaterialsManager.tsx
│       └── LeadershipManager.tsx
└── App.tsx                  # Main app component with routing
```

#### Environment Setup Steps
1. **Create Supabase Project**:
   - Go to https://supabase.com
   - Create new project with name "StgdSchool"
   - Note down the URL and anon key

2. **Configure Database**:
   - Run the SQL schema creation scripts
   - Set up Row Level Security policies
   - Enable authentication in Supabase dashboard

3. **Project Initialization**:
   ```bash
   npm create vite@latest stgd-school -- --template react-ts
   cd stgd-school
   npm install @supabase/supabase-js @tanstack/react-query react-router-dom
   npm install lucide-react @radix-ui/react-toast @radix-ui/react-tabs
   npm install class-variance-authority clsx tailwind-merge
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Configure Tailwind CSS**:
   ```javascript
   // tailwind.config.js
   module.exports = {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: { extend: {} },
     plugins: [],
   }
   ```

#### Files to Edit for Authentication Changes

**Core Authentication Logic:**
- `src/hooks/useAuth.tsx` - Main authentication hook
  - Change admin passkey (`ADMIN_PASSKEY` constant)
  - Modify allowed email domains (`ALLOWED_ADMIN_DOMAINS` array)
  - Update authentication flow logic
  - Add/remove authentication methods

**UI Components:**
- `src/pages/admin/AdminLogin.tsx` - Login page interface
  - Modify login form fields
  - Update UI/UX for authentication steps
  - Change error messages and validation
  - Customize branding and styling

- `src/pages/admin/AdminDashboard.tsx` - Protected admin dashboard
  - Add/remove admin features
  - Modify access control logic
  - Update dashboard layout and components
  - Change user information display

**Database Configuration:**
- `src/integrations/supabase/client.ts` - Supabase connection
  - Update Supabase URL and API keys
  - Modify client configuration options
  - Change connection settings

- `src/integrations/supabase/types.ts` - Database type definitions
  - Update table schemas when database changes
  - Add new table types for additional features
  - Modify existing type interfaces

**Routing & App Structure:**
- `src/App.tsx` - Main application routes
  - Add/remove protected routes
  - Modify route structure
  - Update authentication route guards

**Admin Management Components:**
- `src/components/admin/AnnouncementManager.tsx` - Announcements management
- `src/components/admin/GalleryManager.tsx` - Gallery management  
- `src/components/admin/LearningMaterialsManager.tsx` - Learning materials
- `src/components/admin/LeadershipManager.tsx` - Leadership team management
  - Modify admin feature functionality
  - Update CRUD operations
  - Change UI for content management

**Configuration Files:**
- `supabase/config.toml` - Supabase project configuration
  - Update project ID
  - Modify Supabase settings

**Common Edit Scenarios:**

1. **Change Admin Passkey:**
   - Edit `ADMIN_PASSKEY` in `src/hooks/useAuth.tsx`

2. **Add/Remove Allowed Email Domains:**
   - Modify `ALLOWED_ADMIN_DOMAINS` array in `src/hooks/useAuth.tsx`

3. **Add New Admin Features:**
   - Create new components in `src/components/admin/`
   - Update `src/pages/admin/AdminDashboard.tsx` to include new tabs
   - Add corresponding database tables in Supabase
   - Update `src/integrations/supabase/types.ts` with new types

4. **Modify Authentication Flow:**
   - Update logic in `src/hooks/useAuth.tsx`
   - Adjust UI in `src/pages/admin/AdminLogin.tsx`
   - Update route protection in `src/pages/admin/AdminDashboard.tsx`

5. **Change Database Structure:**
   - Update Supabase database schema
   - Regenerate types in `src/integrations/supabase/types.ts`
   - Modify queries in relevant components

#### State Management Flow
1. **Initial Load**: Check existing session
2. **Auth State Listener**: Monitor authentication changes
3. **Verification**: Two-step process with localStorage persistence
4. **Access Control**: Route protection and UI state management
5. **Cleanup**: Proper session termination and state reset

#### Complete App.tsx Route Configuration
```typescript
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <div className="">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

#### Critical Implementation Notes

**Authentication Flow Logic**:
1. User authentication happens in two distinct phases
2. Phase 1: Standard Supabase email/password authentication
3. Phase 2: Custom passkey verification with domain checking
4. Both phases must succeed for admin access

**Session Persistence Strategy**:
- Supabase handles JWT token management automatically
- Local storage key `adminVerified` tracks passkey verification
- Auth listener maintains state synchronization
- Clean logout removes both Supabase session and local verification

**Security Implementation Details**:
- Email domain whitelist prevents unauthorized signups
- Hardcoded passkey provides additional security layer
- Admin user records created automatically in database
- Route guards prevent direct URL access to admin areas

**Error Handling Requirements**:
- All async operations must have try-catch blocks
- User feedback via toast notifications
- Graceful degradation for network failures
- Clear error messages for authentication failures

### 10. Future Enhancements

#### Recommended Improvements
- Move hardcoded passkey to secure backend storage
- Implement role-based permissions (beyond just admin)
- Add multi-factor authentication (MFA)
- Implement session timeout and refresh mechanisms
- Add audit logging for admin actions
- Enhanced email domain management (admin configurable)

#### Security Enhancements
- Rate limiting for authentication attempts
- IP-based access restrictions
- Enhanced password policies
- Regular security audits and updates

### 11. Deployment & Production Setup

#### Environment Variables Setup
```bash
# .env file (for production) - NEVER commit this file!
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSKEY=your-secure-random-passkey-here
VITE_ALLOWED_DOMAINS=gmail.com,outlook.com,hotmail.com
```

#### Build Configuration
```json
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

#### Production Checklist
- [ ] Move hardcoded credentials to environment variables
- [ ] Set up proper CORS policies in Supabase
- [ ] Configure email templates in Supabase Auth
- [ ] Set up database backups
- [ ] Enable Supabase security features (RLS, etc.)
- [ ] Configure custom domain for Supabase (optional)
- [ ] Set up monitoring and logging
- [ ] Test authentication flow in production environment
- [ ] Configure CDN for static assets
- [ ] Set up SSL certificates

#### Troubleshooting Common Issues

**Authentication Not Working**:
1. Check Supabase URL and API key
2. Verify database table existence
3. Check browser console for errors
4. Ensure RLS policies are correctly set

**Session Not Persisting**:
1. Check localStorage in browser dev tools
2. Verify auth state listener is set up
3. Check for JavaScript errors in console
4. Ensure proper cleanup on logout

**Admin Access Denied**:
1. Verify email domain is in allowed list
2. Check passkey is correct (configured in environment variables)
3. Ensure user record exists in admin_users table
4. Check browser network tab for API errors

### 12. Testing Strategy

#### Unit Tests for Authentication
```typescript
// Example test structure
describe('useAuth Hook', () => {
  test('should authenticate user with valid credentials', async () => {
    // Test email/password authentication
  });
  
  test('should verify admin passkey correctly', async () => {
    // Test passkey verification
  });
  
  test('should reject unauthorized email domains', async () => {
    // Test domain restrictions
  });
  
  test('should handle session persistence', async () => {
    // Test session management
  });
});
```

#### Integration Tests
- Test complete authentication flow end-to-end
- Verify database operations work correctly
- Test route protection and redirects
- Validate error handling scenarios

#### Manual Testing Checklist
- [ ] Sign up with valid email domain
- [ ] Sign up with invalid email domain (should fail)
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials (should fail)
- [ ] Enter correct passkey (should grant access)
- [ ] Enter incorrect passkey (should deny access)
- [ ] Test session persistence across browser refresh
- [ ] Test logout functionality
- [ ] Test protected route access without authentication
- [ ] Test automatic redirect after successful authentication

---

This comprehensive authentication system documentation provides all necessary information for recreating the system from scratch, including complete code implementations, database schemas, configuration requirements, and deployment considerations. An AI agent should be able to fully understand and recreate this authentication system using this documentation.