# Technical Architecture & System Design

## 🏗️ System Architecture Overview

The School-Verse-Portal follows a modern, scalable architecture pattern that ensures maintainability, performance, and future growth capabilities.

### **Architecture Pattern: JAMstack**
- **JavaScript**: React/TypeScript for dynamic user interfaces
- **APIs**: Supabase for backend services and data management
- **Markup**: Pre-built static assets with dynamic content injection

### **High-Level Architecture Diagram**
```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                           │
├─────────────────────────────────────────────────────────────┤
│  React SPA (TypeScript)                                    │
│  ├── Components (Shadcn/UI)                               │
│  ├── Pages (React Router)                                 │
│  ├── Hooks (Custom & React)                               │
│  └── Utils (Helper Functions)                             │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     API LAYER                              │
├─────────────────────────────────────────────────────────────┤
│  Supabase Backend                                          │
│  ├── Authentication (Auth.js)                             │
│  ├── Database (PostgreSQL)                                │
│  ├── Storage (File Upload)                                │
│  ├── Real-time (WebSocket)                                │
│  └── Edge Functions                                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL Database                                       │
│  ├── Content Tables                                       │
│  ├── User Management                                      │
│  ├── File Metadata                                        │
│  └── Audit Logs                                           │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Technical Stack Details

### **Frontend Technologies**

#### **Core Framework**
- **React 18.2+**: Modern React with concurrent features
- **TypeScript 5.0+**: Type safety and enhanced developer experience
- **Vite 4.0+**: Fast build tool and development server
- **React Router Dom 6.8+**: Client-side routing and navigation

#### **UI & Styling**
- **Shadcn/UI**: Pre-built, accessible component library
- **Tailwind CSS 3.3+**: Utility-first CSS framework
- **Tailwind Animate**: Animation utilities for smooth transitions
- **Lucide React**: Modern icon library with 1000+ icons
- **Class Variance Authority**: Dynamic class generation

#### **State Management**
```typescript
// Custom hooks for state management
const useContentState = () => {
  const [heroData, setHeroData] = useState<HeroSection | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Centralized state management logic
  const updateHeroData = useCallback((data: HeroSection) => {
    setHeroData(data);
  }, []);
  
  return {
    heroData,
    announcements,
    loading,
    error,
    updateHeroData
  };
};
```

### **Backend Architecture**

#### **Supabase Services**
- **Authentication**: JWT-based authentication with Row Level Security
- **Database**: PostgreSQL with automatic API generation
- **Storage**: File upload and management system
- **Real-time**: WebSocket connections for live updates
- **Edge Functions**: Serverless functions for custom logic

#### **Database Schema Design**
```sql
-- Hierarchical table structure
CREATE TABLE hero_section (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL,
    subtitle TEXT,
    -- ... other fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit trigger for all tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all content tables
CREATE TRIGGER update_hero_section_updated_at
    BEFORE UPDATE ON hero_section
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## 🔐 Security Architecture

### **Authentication Flow**
```typescript
// Authentication service architecture
class AuthService {
  private static instance: AuthService;
  private supabase: SupabaseClient;
  
  constructor() {
    this.supabase = createClient(
      process.env.VITE_SUPABASE_URL!,
      process.env.VITE_SUPABASE_ANON_KEY!
    );
  }
  
  async signIn(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new AuthError(error.message);
    return data;
  }
  
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }
}
```

### **Row Level Security (RLS)**
```sql
-- Example RLS policy
CREATE POLICY "Users can view public content" ON announcements
    FOR SELECT USING (
        is_active = true 
        AND (start_date IS NULL OR start_date <= CURRENT_DATE)
        AND (end_date IS NULL OR end_date >= CURRENT_DATE)
    );

CREATE POLICY "Admin users can manage content" ON announcements
    FOR ALL USING (
        auth.uid() IS NOT NULL 
        AND auth.jwt() ->> 'role' = 'admin'
    );
```

### **Data Validation & Sanitization**
```typescript
// Input validation service
class ValidationService {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  static sanitizeHtml(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return !url.includes('javascript:');
    } catch {
      return false;
    }
  }
}
```

## 📊 Data Flow Architecture

### **Content Management Flow**
```typescript
// Data flow pattern
interface ContentFlow {
  // 1. User Input (Admin Dashboard)
  userInput: FormData;
  
  // 2. Validation Layer
  validation: ValidationResult;
  
  // 3. Service Layer
  service: ContentService;
  
  // 4. Database Layer
  database: SupabaseClient;
  
  // 5. Response Layer
  response: APIResponse;
  
  // 6. UI Update
  uiUpdate: StateUpdate;
}

// Implementation example
const updateContent = async (data: ContentData) => {
  // 1. Validate input
  const validation = await validateInput(data);
  if (!validation.isValid) {
    throw new ValidationError(validation.errors);
  }
  
  // 2. Process through service
  const result = await ContentService.updateContent(data);
  
  // 3. Update UI state
  if (result.success) {
    updateUIState(result.data);
  }
  
  return result;
};
```

### **Real-time Update Architecture**
```typescript
// Real-time subscription pattern
class RealtimeService {
  private subscriptions: Map<string, RealtimeSubscription> = new Map();
  
  subscribe(table: string, callback: (data: any) => void) {
    const subscription = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
          { event: '*', schema: 'public', table },
          callback
      )
      .subscribe();
    
    this.subscriptions.set(table, subscription);
    return subscription;
  }
  
  unsubscribe(table: string) {
    const subscription = this.subscriptions.get(table);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(table);
    }
  }
  
  unsubscribeAll() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
  }
}
```

## 🚀 Performance Architecture

### **Code Splitting Strategy**
```typescript
// Route-based code splitting
const routes = [
  {
    path: '/',
    element: lazy(() => import('./pages/Index')),
    errorElement: <ErrorBoundary />
  },
  {
    path: '/admin',
    element: lazy(() => import('./pages/AdminDashboard')),
    loader: async () => {
      // Preload admin dependencies
      await import('./services/AdminService');
      return null;
    }
  },
  {
    path: '/gallery',
    element: lazy(() => import('./pages/Gallery')),
    loader: async () => {
      // Preload gallery dependencies
      await import('./components/ImageGallery');
      return null;
    }
  }
];
```

### **Caching Strategy**
```typescript
// Multi-level caching system
class CacheService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private readonly TTL = 5 * 60 * 1000; // 5 minutes
  
  async get<T>(key: string): Promise<T | null> {
    // 1. Check memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    
    // 2. Check browser cache
    const browserCached = localStorage.getItem(key);
    if (browserCached) {
      const data = JSON.parse(browserCached);
      if (data.expiry > Date.now()) {
        this.memoryCache.set(key, data);
        return data.value;
      }
    }
    
    return null;
  }
  
  set<T>(key: string, data: T): void {
    const entry: CacheEntry = {
      data,
      expiry: Date.now() + this.TTL
    };
    
    // Store in memory
    this.memoryCache.set(key, entry);
    
    // Store in browser
    localStorage.setItem(key, JSON.stringify(entry));
  }
}
```

### **Image Optimization**
```typescript
// Progressive image loading
const useProgressiveImage = (src: string, placeholder: string) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setCurrentSrc(src);
      setLoading(false);
    };
    img.src = src;
  }, [src]);
  
  return { src: currentSrc, loading };
};

// Image component with optimization
const OptimizedImage = ({ src, alt, className }: ImageProps) => {
  const { src: imageSrc, loading } = useProgressiveImage(src, PLACEHOLDER_IMAGE);
  
  return (
    <div className={`relative ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          loading ? 'opacity-50' : 'opacity-100'
        }`}
        loading="lazy"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
};
```

## 🔄 Error Handling Architecture

### **Error Boundary Implementation**
```typescript
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    ErrorService.logError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: this.constructor.name
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Something went wrong
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### **API Error Handling**
```typescript
// Centralized error handling
class APIErrorHandler {
  static handle(error: any): never {
    if (error.code === 'PGRST301') {
      throw new AuthenticationError('Please log in to access this resource');
    }
    
    if (error.code === 'PGRST204') {
      throw new NotFoundError('The requested resource was not found');
    }
    
    if (error.code === 'PGRST116') {
      throw new ValidationError('Invalid data provided');
    }
    
    // Default error
    throw new APIError('An unexpected error occurred. Please try again.');
  }
}

// Service layer error handling
class ContentService {
  static async getContent<T>(tableName: string): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('*');
      
      if (error) {
        APIErrorHandler.handle(error);
      }
      
      return data || [];
    } catch (error) {
      // Log error and re-throw
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }
  }
}
```

## 📱 Responsive Architecture

### **Breakpoint System**
```typescript
// Responsive breakpoints
const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// Responsive hook
const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<keyof typeof breakpoints>('md');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setScreenSize('sm');
      else if (width < 768) setScreenSize('md');
      else if (width < 1024) setScreenSize('lg');
      else if (width < 1280) setScreenSize('xl');
      else setScreenSize('2xl');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return screenSize;
};
```

### **Mobile-First Design Pattern**
```typescript
// Mobile-first component architecture
const ResponsiveComponent = ({ children }: { children: React.ReactNode }) => {
  const screenSize = useResponsive();
  
  return (
    <div className={`
      grid gap-4
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4
      ${screenSize === 'sm' ? 'px-2' : 'px-4'}
    `}>
      {children}
    </div>
  );
};
```

## 🔍 Search Architecture

### **Search Service Implementation**
```typescript
class SearchService {
  private static searchIndex: SearchIndex = new Map();
  
  static async indexContent(): Promise<void> {
    const [announcements, materials, gallery] = await Promise.all([
      ContentService.getAnnouncements(),
      ContentService.getLearningMaterials(),
      ContentService.getGalleryItems()
    ]);
    
    // Build search index
    this.searchIndex.set('announcements', this.buildIndex(announcements));
    this.searchIndex.set('materials', this.buildIndex(materials));
    this.searchIndex.set('gallery', this.buildIndex(gallery));
  }
  
  static search(query: string, categories?: string[]): SearchResult[] {
    const results: SearchResult[] = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    for (const [category, index] of this.searchIndex) {
      if (categories && !categories.includes(category)) continue;
      
      for (const [id, content] of index) {
        const score = this.calculateRelevance(content, searchTerms);
        if (score > 0) {
          results.push({ id, category, content, score });
        }
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  private static calculateRelevance(content: IndexedContent, terms: string[]): number {
    let score = 0;
    const text = `${content.title} ${content.description}`.toLowerCase();
    
    for (const term of terms) {
      if (content.title.toLowerCase().includes(term)) score += 3;
      if (content.description.toLowerCase().includes(term)) score += 1;
      if (content.tags?.some(tag => tag.toLowerCase().includes(term))) score += 2;
    }
    
    return score;
  }
}
```

This comprehensive technical architecture documentation provides a complete understanding of the system's design patterns, implementation details, and architectural decisions that enable the School-Verse-Portal to be maintainable, scalable, and performant.
