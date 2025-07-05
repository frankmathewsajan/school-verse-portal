# Admin Portal & Content Management Documentation

## 🏢 Admin Portal Overview

The Admin Portal provides comprehensive content management capabilities for school administrators, allowing them to manage all aspects of the website content through an intuitive interface.

## 🔐 Authentication & Access Control

### **Authentication Flow**
```typescript
// Authentication using Supabase Auth
const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Session management
const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return session;
};

// Sign out
const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
};
```

### **Protected Routes**
```typescript
// Route protection component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );
    
    return () => subscription.unsubscribe();
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  if (!session) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};
```

## 📊 Admin Dashboard Layout

### **Dashboard Structure** (`AdminDashboard.tsx`)

```typescript
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("hero");
  const [saveStatus, setSaveStatus] = useState<string>("");
  
  const tabs = [
    { id: "hero", label: "Hero Section", icon: "🏠" },
    { id: "about", label: "About Section", icon: "ℹ️" },
    { id: "vision", label: "Vision & Mission", icon: "🎯" },
    { id: "announcements", label: "Announcements", icon: "📢" },
    { id: "gallery", label: "Gallery", icon: "📸" },
    { id: "materials", label: "Learning Materials", icon: "📚" },
    { id: "leadership", label: "Leadership Team", icon: "👥" }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <SaveStatus status={saveStatus} />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <ContentEditor 
          activeTab={activeTab} 
          onSave={setSaveStatus} 
        />
      </main>
    </div>
  );
};
```

## 🏠 Hero Section Editor

### **Hero Editor Component** (`HeroEditor.tsx`)

```typescript
const HeroEditor = ({ onSave }: { onSave: (status: string) => void }) => {
  const [heroData, setHeroData] = useState<HeroSection>({
    id: 'main',
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    image_description: '',
    primary_button_text: '',
    primary_button_link: '',
    secondary_button_text: '',
    secondary_button_link: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Load existing data
  useEffect(() => {
    const loadHeroData = async () => {
      setIsLoading(true);
      try {
        const data = await ContentService.getHeroSection();
        if (data) {
          setHeroData(data);
          setImagePreview(data.image_url || '');
        }
      } catch (error) {
        console.error('Error loading hero data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadHeroData();
  }, []);
  
  const handleSave = async () => {
    setIsLoading(true);
    onSave('saving');
    
    try {
      const success = await ContentService.updateHeroSection(heroData);
      
      if (success) {
        onSave('saved');
        setTimeout(() => onSave(''), 3000);
      } else {
        onSave('error');
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      onSave('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Hero Section Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Text Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Title
              </label>
              <input
                type="text"
                value={heroData.title}
                onChange={(e) => setHeroData({...heroData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter main title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={heroData.subtitle}
                onChange={(e) => setHeroData({...heroData, subtitle: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter subtitle"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={heroData.description}
                onChange={(e) => setHeroData({...heroData, description: e.target.value})}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div>
          </div>
          
          {/* Image Management */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Image URL
              </label>
              <input
                type="url"
                value={heroData.image_url}
                onChange={(e) => {
                  setHeroData({...heroData, image_url: e.target.value});
                  setImagePreview(e.target.value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            {imagePreview && (
              <div className="border rounded-md p-2">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded"
                  onError={() => setImagePreview('')}
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Description (Alt Text)
              </label>
              <input
                type="text"
                value={heroData.image_description}
                onChange={(e) => setHeroData({...heroData, image_description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>
        </div>
        
        {/* Call-to-Action Buttons */}
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">Call-to-Action Buttons</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Primary Button Text
              </label>
              <input
                type="text"
                value={heroData.primary_button_text}
                onChange={(e) => setHeroData({...heroData, primary_button_text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Learn More"
              />
              <input
                type="url"
                value={heroData.primary_button_link}
                onChange={(e) => setHeroData({...heroData, primary_button_link: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Secondary Button Text
              </label>
              <input
                type="text"
                value={heroData.secondary_button_text}
                onChange={(e) => setHeroData({...heroData, secondary_button_text: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Contact Us"
              />
              <input
                type="url"
                value={heroData.secondary_button_link}
                onChange={(e) => setHeroData({...heroData, secondary_button_link: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com"
              />
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Hero Section'}
          </button>
        </div>
      </div>
      
      {/* Live Preview */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Live Preview</h3>
        <div className="border rounded-lg overflow-hidden">
          <HeroPreview data={heroData} />
        </div>
      </div>
    </div>
  );
};
```

## 📢 Announcements Manager

### **Announcements Editor** (`NotificationEditor.tsx`)

```typescript
const NotificationEditor = ({ onSave }: { onSave: (status: string) => void }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    is_active: true,
    target_audience: 'all'
  });
  
  // Load announcements
  useEffect(() => {
    loadAnnouncements();
  }, []);
  
  const loadAnnouncements = async () => {
    setIsLoading(true);
    try {
      const data = await ContentService.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('Error loading announcements:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    onSave('saving');
    
    try {
      let success = false;
      
      if (editingId) {
        success = await ContentService.updateAnnouncement(editingId, formData);
      } else {
        success = await ContentService.createAnnouncement(formData as Omit<Announcement, 'id' | 'created_at'>);
      }
      
      if (success) {
        onSave('saved');
        setEditingId(null);
        setFormData({
          title: '',
          content: '',
          category: 'general',
          priority: 'medium',
          is_active: true,
          target_audience: 'all'
        });
        loadAnnouncements();
      } else {
        onSave('error');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      onSave('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData(announcement);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const success = await ContentService.deleteAnnouncement(id);
      if (success) {
        loadAnnouncements();
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Announcement Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? 'Edit' : 'Create'} Announcement
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Announcement title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Announcement content"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="academic">Academic</option>
                <option value="events">Events</option>
                <option value="holidays">Holidays</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                value={formData.target_audience}
                onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="parents">Parents</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
              className="mr-2"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
              Active (visible to users)
            </label>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end space-x-4">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({
                  title: '',
                  content: '',
                  category: 'general',
                  priority: 'medium',
                  is_active: true,
                  target_audience: 'all'
                });
              }}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={isLoading || !formData.title || !formData.content}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (editingId ? 'Update' : 'Create')} Announcement
          </button>
        </div>
      </div>
      
      {/* Announcements List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium mb-4">Existing Announcements</h3>
        
        {announcements.length === 0 ? (
          <p className="text-gray-500">No announcements found.</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

## 📸 Gallery Manager

### **Gallery Editor Features**

```typescript
const GalleryEditor = ({ onSave }: { onSave: (status: string) => void }) => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isUploading, setIsUploading] = useState(false);
  
  const features = [
    '🖼️ **Drag & Drop Upload**: Easy image uploading with preview',
    '📁 **Category Management**: Organize images by categories',
    '🏷️ **Tag System**: Flexible tagging for better organization',
    '⭐ **Featured Images**: Mark images as featured for homepage',
    '📊 **Bulk Operations**: Select multiple images for batch actions',
    '🔍 **Search & Filter**: Find images quickly by title, tags, or category',
    '📱 **Responsive Preview**: See how images look on different devices',
    '🗑️ **Safe Delete**: Confirm before removing images'
  ];
  
  // Image upload handler
  const handleImageUpload = async (files: FileList) => {
    setIsUploading(true);
    
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Upload to storage service (Supabase Storage, Cloudinary, etc.)
        const imageUrl = await uploadImage(file);
        
        // Create gallery item
        const galleryItem: Omit<GalleryItem, 'id' | 'created_at'> = {
          title: file.name.replace(/\.[^/.]+$/, ''),
          image_url: imageUrl,
          category: selectedCategory === 'all' ? 'general' : selectedCategory,
          is_featured: false,
          tags: []
        };
        
        return ContentService.createGalleryItem(galleryItem);
      });
      
      await Promise.all(uploadPromises);
      loadGalleryItems();
      onSave('saved');
    } catch (error) {
      console.error('Error uploading images:', error);
      onSave('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Gallery Management</h2>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl">📸</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                Drag & drop images here
              </p>
              <p className="text-sm text-gray-500">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Choose Images
            </label>
          </div>
        </div>
      </div>
      
      {/* Gallery Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Gallery Images</h3>
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {galleryItems.map((item) => (
            <GalleryItemCard
              key={item.id}
              item={item}
              onEdit={(updatedItem) => {
                // Handle edit
              }}
              onDelete={(id) => {
                // Handle delete
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

## 📚 Learning Materials Manager

### **Materials Editor Features**

```typescript
const MaterialsEditor = ({ onSave }: { onSave: (status: string) => void }) => {
  const [materials, setMaterials] = useState<LearningMaterial[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  
  const supportedFileTypes = [
    { type: 'pdf', icon: '📄', label: 'PDF Documents' },
    { type: 'doc', icon: '📝', label: 'Word Documents' },
    { type: 'ppt', icon: '📊', label: 'PowerPoint Presentations' },
    { type: 'xlsx', icon: '📈', label: 'Excel Spreadsheets' },
    { type: 'jpg', icon: '🖼️', label: 'Images' },
    { type: 'mp4', icon: '🎥', label: 'Video Files' }
  ];
  
  const gradeOptions = [
    'Pre-K', 'K', '1st', '2nd', '3rd', '4th', '5th',
    '6th', '7th', '8th', '9th', '10th', '11th', '12th'
  ];
  
  const subjectOptions = [
    'Mathematics', 'Science', 'English', 'History',
    'Geography', 'Art', 'Music', 'Physical Education',
    'Computer Science', 'Foreign Languages'
  ];
  
  const handleFileUpload = async (file: File, metadata: Partial<LearningMaterial>) => {
    setIsUploading(true);
    
    try {
      // Upload file to storage
      const fileUrl = await uploadFile(file);
      
      // Create material record
      const material: Omit<LearningMaterial, 'id' | 'created_at'> = {
        title: metadata.title || file.name,
        description: metadata.description || '',
        file_url: fileUrl,
        file_type: file.type,
        file_size: file.size,
        category: metadata.category || 'other',
        subject: metadata.subject || '',
        grade_level: metadata.grade_level || '',
        is_featured: false,
        download_count: 0,
        requires_login: metadata.requires_login || false,
        created_by: 'admin' // Get from auth context
      };
      
      const success = await ContentService.createLearningMaterial(material);
      
      if (success) {
        loadMaterials();
        onSave('saved');
      } else {
        onSave('error');
      }
    } catch (error) {
      console.error('Error uploading material:', error);
      onSave('error');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Learning Materials</h2>
        
        <FileUploadForm
          onUpload={handleFileUpload}
          supportedTypes={supportedFileTypes}
          gradeOptions={gradeOptions}
          subjectOptions={subjectOptions}
          isUploading={isUploading}
        />
      </div>
      
      {/* Materials List */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MaterialsList
          materials={materials}
          onEdit={(material) => {
            // Handle edit
          }}
          onDelete={(id) => {
            // Handle delete
          }}
        />
      </div>
    </div>
  );
};
```

## 🔧 Save Status & Notifications

### **Save Status Component**
```typescript
const SaveStatus = ({ status }: { status: string }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return { icon: '⏳', text: 'Saving...', color: 'text-yellow-600' };
      case 'saved':
        return { icon: '✅', text: 'Saved', color: 'text-green-600' };
      case 'error':
        return { icon: '❌', text: 'Error', color: 'text-red-600' };
      default:
        return null;
    }
  };
  
  const config = getStatusConfig();
  
  if (!config) return null;
  
  return (
    <div className={`flex items-center space-x-2 ${config.color}`}>
      <span>{config.icon}</span>
      <span className="text-sm font-medium">{config.text}</span>
    </div>
  );
};
```

## 📊 Analytics & Reporting

### **Content Analytics Dashboard**
```typescript
const AnalyticsDashboard = () => {
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    galleryImages: 0,
    learningMaterials: 0,
    totalDownloads: 0,
    recentActivity: []
  });
  
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  const loadAnalytics = async () => {
    try {
      const [
        announcements,
        gallery,
        materials,
        downloads
      ] = await Promise.all([
        ContentService.getAnnouncementStats(),
        ContentService.getGalleryStats(),
        ContentService.getMaterialStats(),
        ContentService.getDownloadStats()
      ]);
      
      setStats({
        totalAnnouncements: announcements.total,
        activeAnnouncements: announcements.active,
        galleryImages: gallery.total,
        learningMaterials: materials.total,
        totalDownloads: downloads.total,
        recentActivity: downloads.recent
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Announcements"
        value={stats.totalAnnouncements}
        icon="📢"
        color="blue"
      />
      <StatCard
        title="Active Announcements"
        value={stats.activeAnnouncements}
        icon="✅"
        color="green"
      />
      <StatCard
        title="Gallery Images"
        value={stats.galleryImages}
        icon="📸"
        color="purple"
      />
      <StatCard
        title="Learning Materials"
        value={stats.learningMaterials}
        icon="📚"
        color="orange"
      />
    </div>
  );
};
```

This comprehensive admin portal documentation covers all the major components and features of the content management system, providing administrators with powerful tools to manage all aspects of the school website effectively.
