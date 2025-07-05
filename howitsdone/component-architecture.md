# Component Architecture Documentation

## 🏗️ Component Structure Overview

The School-Verse-Portal follows a well-organized component architecture that promotes reusability, maintainability, and separation of concerns.

## 📁 Component Organization

```
src/components/
├── admin/          # Administrative interface components
├── home/           # Homepage section components  
├── layout/         # Layout and navigation components
└── ui/            # Reusable UI components (Shadcn/UI)
```

## 🏠 Home Components

### **Hero Section** (`home/hero-section.tsx`)

**Purpose**: Main landing section with school branding and call-to-action

**Key Features**:
- Dynamic title and subtitle from database
- Customizable description and CTAs  
- Responsive background image
- Call-to-action buttons with configurable links
- Real-time content updates

**Props Interface**:
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  description?: string;
  image_url?: string;
  primary_button_text?: string;
  primary_button_link?: string;
  secondary_button_text?: string;
  secondary_button_link?: string;
}
```

**Database Integration**:
- Loads from `hero_section` table
- Uses ContentService for data fetching
- Real-time updates via Supabase subscriptions

**Styling**:
- Full viewport height design
- Gradient background overlay
- Responsive typography scaling
- Mobile-optimized button layout

---

### **About Section** (`home/about-section.tsx`)

**Purpose**: School introduction, principal message, and key features

**Key Features**:
- School description and history
- Principal message with photo
- Feature highlights grid
- Responsive card layout
- Animated content reveals

**Props Interface**:
```typescript
interface AboutSectionProps {
  title: string;
  subtitle: string;
  main_content: Json;
  principal_message: string;
  principal_name: string;
  principal_title: string;
  principal_image_url: string;
  school_founded_year: number;
  school_description: string;
  features: Json;
}
```

**Content Structure**:
- **Main Content**: Rich text with school information
- **Principal Section**: Photo, message, and credentials
- **Features Grid**: Highlighted school strengths
- **Statistics**: Founded year and key numbers

---

### **Vision Section** (`home/vision-section.tsx`)

**Purpose**: School's mission, vision, and core values

**Key Features**:
- Mission statement display
- Vision for the future
- Core values breakdown
- Icon-based value presentation
- Inspirational design theme

**Props Interface**:
```typescript
interface VisionSectionProps {
  title: string;
  subtitle: string;
  main_content: string;
  principal_message: string;
  principal_name: string;
  principal_title: string;
  features: Json;
}
```

**Layout Structure**:
- **Mission**: Primary educational philosophy
- **Vision**: Future aspirations and goals
- **Values**: Core principles with icons
- **Leadership Quote**: Principal's vision statement

---

### **Notification Section** (`home/notification-section.tsx`)

**Purpose**: Display important announcements and news

**Key Features**:
- Latest announcements feed
- Priority-based sorting
- Date-based filtering
- Expandable content cards
- Real-time updates

**Props Interface**:
```typescript
interface NotificationProps {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
```

**Features**:
- **Priority Indicators**: Color-coded importance levels
- **Category Filtering**: Group by announcement type
- **Expandable Cards**: Read more functionality
- **Date Sorting**: Newest announcements first

---

### **Gallery Preview** (`home/gallery-preview.tsx`)

**Purpose**: Showcase school life through photos

**Key Features**:
- Photo grid layout
- Image lazy loading
- Lightbox modal view
- Category-based filtering
- Responsive image sizing

**Props Interface**:
```typescript
interface GalleryItemProps {
  id: string;
  title: string;
  image_url: string;
  description: string;
  category: string;
  is_featured: boolean;
  created_at: string;
}
```

**Display Features**:
- **Masonry Layout**: Pinterest-style grid
- **Image Optimization**: Responsive sizing
- **Modal Viewer**: Full-size image display
- **Category Tags**: Filterable content

---

### **Materials Preview** (`home/materials-preview.tsx`)

**Purpose**: Quick access to learning resources

**Key Features**:
- Resource card display
- Download functionality
- Category organization
- Search capabilities
- File type indicators

**Props Interface**:
```typescript
interface LearningMaterialProps {
  id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  category: string;
  grade_level: string;
  is_featured: boolean;
  download_count: number;
}
```

**Functionality**:
- **Quick Downloads**: Direct file access
- **Category Filters**: Subject-based organization
- **Grade Levels**: Age-appropriate content
- **Usage Statistics**: Download tracking

## 🔧 Admin Components

### **Hero Editor** (`admin/HeroEditor.tsx`)

**Purpose**: Edit main banner content

**Key Features**:
- Form-based content editing
- Real-time preview
- Image upload functionality
- Link validation
- Save confirmation

**Form Fields**:
- Title and subtitle text
- Description content
- Background image upload
- Primary/secondary CTA buttons
- Button link destinations

**Validation**:
- Required field checking
- URL format validation
- Image size limits
- Character count limits

---

### **About Editor** (`admin/AboutEditor.tsx`)

**Purpose**: Manage school information content

**Key Features**:
- Rich text editing
- Principal information form
- Feature management
- Image upload for principal
- JSON content handling

**Content Sections**:
- **School Information**: Description and history
- **Principal Section**: Photo, bio, and message
- **Features**: Highlighted school strengths
- **Statistics**: Key numbers and achievements

---

### **Notification Editor** (`admin/NotificationEditor.tsx`)

**Purpose**: Create and manage announcements

**Key Features**:
- Announcement creation form
- Priority level setting
- Category assignment
- Active/inactive toggle
- Bulk operations

**Management Features**:
- **CRUD Operations**: Create, read, update, delete
- **Priority Management**: High, medium, low levels
- **Category Organization**: News, events, academic
- **Status Control**: Active/inactive announcements

---

### **Gallery Editor** (`admin/GalleryEditor.tsx`)

**Purpose**: Manage photo galleries

**Key Features**:
- Image upload interface
- Bulk image processing
- Category management
- Featured item selection
- Image optimization

**Upload Features**:
- **Multiple Upload**: Batch image processing
- **Auto-resize**: Optimal image sizing
- **Category Tags**: Organized content
- **Featured Selection**: Homepage highlights

---

### **Materials Editor** (`admin/MaterialsEditor.tsx`)

**Purpose**: Manage learning resources

**Key Features**:
- File upload system
- Metadata management
- Category organization
- Grade level assignment
- Download tracking

**File Management**:
- **Multi-format Support**: PDF, DOC, PPT, etc.
- **Metadata Entry**: Descriptions and categorization
- **Access Control**: Grade-level restrictions
- **Usage Analytics**: Download statistics

## 🎨 Layout Components

### **Header** (`layout/Header.tsx`)

**Purpose**: Site navigation and branding

**Key Features**:
- Responsive navigation menu
- School logo display
- Mobile hamburger menu
- Active page indicators
- Admin portal access

**Navigation Structure**:
```typescript
const navigation = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Materials', href: '/materials' },
  { name: 'Contact', href: '/contact' }
];
```

---

### **Footer** (`layout/Footer.tsx`)

**Purpose**: Site footer with contact info

**Key Features**:
- Contact information display
- Social media links
- Quick navigation links
- Copyright information
- School address and phone

---

### **Main Layout** (`layout/MainLayout.tsx`)

**Purpose**: Overall page structure wrapper

**Key Features**:
- Header and footer integration
- Main content area
- Responsive breakpoints
- Accessibility features
- SEO optimization

## 🧩 UI Components (Shadcn/UI)

### **Core Components**
- **Button**: Various styles and sizes
- **Card**: Content containers
- **Input**: Form inputs with validation
- **Textarea**: Multi-line text inputs
- **Label**: Form field labels
- **Badge**: Status indicators
- **Alert**: Message notifications

### **Advanced Components**
- **Dialog**: Modal overlays
- **Tabs**: Tabbed interfaces
- **Accordion**: Collapsible content
- **Progress**: Loading indicators
- **Toast**: Notification system
- **Command**: Search interfaces

### **Navigation Components**
- **Navigation Menu**: Complex nav structures
- **Dropdown Menu**: Contextual menus
- **Breadcrumb**: Navigation paths
- **Pagination**: Content pagination

### **Form Components**
- **Form**: Form validation wrapper
- **Select**: Dropdown selections
- **Checkbox**: Boolean inputs
- **Radio Group**: Single selections
- **Switch**: Toggle controls

### **Data Display**
- **Table**: Tabular data
- **Chart**: Data visualizations
- **Avatar**: User representations
- **Calendar**: Date selections
- **Carousel**: Image sliders

## 🔄 Component Communication

### **Props Flow**
- Parent-to-child data passing
- Event handlers for user interactions
- Callback functions for state updates
- Context for global state sharing

### **State Management**
- Local component state with useState
- Effect hooks for side effects
- Custom hooks for reusable logic
- Context API for global state

### **Data Flow Patterns**
```typescript
// Parent component
const [data, setData] = useState<ContentType[]>([]);

// Child component receives data and callback
<ChildComponent 
  data={data} 
  onUpdate={(newData) => setData(newData)} 
/>

// Custom hook for data management
const { content, loading, updateContent } = useContentManagement();
```

## 🎯 Best Practices

### **Component Design Principles**
1. **Single Responsibility**: Each component has one clear purpose
2. **Composition over Inheritance**: Build complex UIs from simple components
3. **Props Interface**: Well-defined TypeScript interfaces
4. **Error Boundaries**: Graceful error handling
5. **Accessibility**: ARIA labels and keyboard navigation

### **Performance Optimization**
1. **React.memo**: Prevent unnecessary re-renders
2. **useCallback**: Memoize event handlers
3. **useMemo**: Expensive calculation caching
4. **Lazy Loading**: Code splitting for large components
5. **Image Optimization**: Responsive and lazy-loaded images

### **Code Organization**
1. **Consistent Naming**: PascalCase for components
2. **File Structure**: Logical grouping and nesting
3. **Import Organization**: External, internal, relative imports
4. **Type Definitions**: Comprehensive TypeScript usage
5. **Documentation**: JSDoc comments for complex logic

This component architecture ensures maintainable, scalable, and performant code while providing a great developer experience and user interface.
