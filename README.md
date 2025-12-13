# School Verse Portal

School Verse Portal is a comprehensive web application designed for St. G. D. Convent School to provide easy access to school information, photo galleries, and educational resources for students, parents, and the school community.

## 🔐 IMPORTANT: Security Setup Required

**This repository has been secured for public access.** All credentials have been removed and must be configured via environment variables.

### Quick Start:
1. **Copy environment template**: `cp .env.example .env`
2. **Configure your credentials** in the `.env` file
3. **See [SECURITY_SETUP.md](SECURITY_SETUP.md)** for complete setup instructions
4. **Review [V.md](V.md)** for security vulnerability assessment

⚠️ **DO NOT use default values in production!**

## About the Application

The School Verse Portal serves as a central hub for all school-related information and resources. It provides an intuitive interface for browsing school activities, accessing learning materials, and staying updated with the latest school news and events.

## Available Pages and Features

### Home Page (/)
The main landing page that provides an overview of the school with the following sections:
- **Hero Section**: Welcome message and school introduction
- **About Section**: Information about the school's mission and values
- **Vision Section**: School's vision and goals
- **Notifications**: Important announcements and updates
- **Gallery Preview**: Featured photos from recent school events
- **Materials Preview**: Quick access to educational resources

### About Section
Click the "About" link in the navigation menu to scroll directly to the about section on the home page, where you can learn more about the school's history, mission, and values.

### Gallery Page (/gallery)
Browse through the school's photo collection with these features:
- **Search Functionality**: Find specific photos by title or description
- **Category Filtering**: Filter photos by different categories (events, activities, etc.)
- **Responsive Grid Layout**: View photos in an organized grid format
- **Photo Details**: Each photo includes title, category, and date information
- **Load More**: Browse through extensive photo collections

### Materials Page (/materials)
Access educational resources and study materials:
- **Grade Level Filtering**: Filter materials by grade groups:
  - Primary (Grades 1-5)
  - Middle (Grades 6-8)
  - Secondary (Grades 9-10)
  - Senior Secondary (Grades 11-12)
- **Subject Filtering**: Browse materials by subject area
- **Search Functionality**: Find specific materials by title or description
- **File Information**: View file type, size, and upload date
- **Download Access**: Download materials directly from the portal

### Admin Portal (/admin)
Secure administrative interface for school staff to manage content:
- **Login System**: Protected access for authorized personnel
- **Dashboard**: Overview of all system content
- **Content Management**: Add, edit, and manage school information
- **Gallery Management**: Upload and organize photo collections
- **Materials Management**: Upload and categorize educational resources
- **Notifications**: Manage school announcements and updates

## How to Use the Application

### For Students and Parents

1. **Browsing School Information**
   - Visit the home page to get an overview of the school
   - Click "About" in the navigation to learn more about the school
   - Check the notifications section for important updates

2. **Viewing Photos**
   - Navigate to the Gallery page
   - Use the search bar to find specific events or activities
   - Click on category tabs to filter photos by type
   - Browse through the photo grid to explore school memories

3. **Accessing Learning Materials**
   - Go to the Materials page
   - Select your grade level using the grade group tabs
   - Choose your subject from the subject filter
   - Use the search function to find specific materials
   - Click the download button to access materials

### For School Staff

1. **Administrative Access**
   - Navigate to the Admin portal
   - Login with your authorized credentials
   - Access the dashboard to manage all content

2. **Content Management**
   - Upload new photos to the gallery
   - Add educational materials for different grades
   - Update school information and announcements
   - Manage notifications and important updates

## Navigation

The application uses the following main navigation structure:
- **Home**: Main landing page with school overview
- **About**: Scrolls to the about section on the home page
- **Gallery**: Photo gallery with search and filtering
- **Materials**: Educational resources and study materials
- **Admin Portal**: Administrative access for content management

## Technical Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Search Functionality**: Comprehensive search across photos and materials
- **Filtering System**: Advanced filtering options for better content discovery
- **Secure Admin Access**: Protected administrative interface with environment-based authentication
- **File Management**: Efficient handling of images and document uploads
- **Real-time Updates**: Dynamic content loading and updates
- **🔒 Security**: Environment variables for all sensitive configuration
- **🛡️ No Hardcoded Credentials**: All secrets managed via .env files

## 🚀 Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### Installation
```bash
# Clone the repository
git clone https://github.com/frankmathewsajan/school-verse-portal.git
cd school-verse-portal

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure your environment variables (see SECURITY_SETUP.md)
# Edit .env with your actual Supabase credentials

# Start development server
npm run dev
```

### Required Environment Variables
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_PASSKEY=your-secure-passkey-here
VITE_ALLOWED_DOMAINS=gmail.com,outlook.com,hotmail.com
```

## 📁 Project Structure

```
school-verse-portal/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   └── services/           # Business logic and API calls
├── howitsdone/             # Documentation and guides
├── .env.example            # Environment variable template
├── SECURITY_SETUP.md       # Security setup instructions
└── V.md                    # Security vulnerability assessment
```

## Support

For technical support or questions about using the School Verse Portal, please contact the school administration or IT support team.

## 🔒 Security

This project follows security best practices:
- No hardcoded credentials in source code
- Environment variables for all sensitive configuration
- Sanitized documentation and examples
- Regular security assessments

For security concerns, please review the [V.md](V.md) vulnerability assessment and follow the [SECURITY_SETUP.md](SECURITY_SETUP.md) guidelines.

---

*School Verse Portal - Connecting the school community through technology*