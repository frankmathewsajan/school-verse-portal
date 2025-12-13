# 🔐 SECURITY SETUP INSTRUCTIONS

## ⚠️ IMPORTANT: This repository has been sanitized for public access

This codebase has been secured by removing all hardcoded credentials and secrets. **You MUST follow these setup instructions** to run the application.

---

## 🚀 Quick Setup (For Development)

### 1. Clone the Repository
```bash
git clone https://github.com/frankmathewsajan/school-verse-portal.git
cd school-verse-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create Environment File
```bash
cp .env.example .env
```

### 4. Configure Environment Variables
Edit the `.env` file with your actual values:

```bash
# Required: Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Required: Admin Configuration  
VITE_ADMIN_PASSKEY=your-secure-random-passkey-here
VITE_ALLOWED_DOMAINS=gmail.com,outlook.com,hotmail.com

# Optional: Firebase (if using Firebase hosting)
FIREBASE_PROJECT_ID=your-firebase-project-id
```

### 5. Set Up Supabase
1. Go to [Supabase.com](https://supabase.com) and create a new project
2. Copy your project URL and anon key to the `.env` file
3. Run the SQL schema files in the `sql/` directory (if available)
4. Enable Row Level Security on all tables

### 6. Run the Application
```bash
npm run dev
```

---

## 🛡️ Security Measures Implemented

### ✅ What was Fixed:
- **Removed hardcoded Supabase credentials** from all files
- **Removed hardcoded admin passkey** ("143143")
- **Deleted vulnerable test files** containing exposed secrets
- **Updated .gitignore** to prevent future credential exposure
- **Sanitized all documentation** files
- **Added environment variable validation** with proper error messages

### ✅ Files Secured:
- `src/integrations/supabase/client.ts` - Now uses environment variables
- `src/hooks/useAuth.tsx` - Admin passkey from environment
- All documentation in `howitsdone/` - Credentials replaced with placeholders
- Removed: `populate-facilities.mjs`, `comprehensive-test.js`, `auth-flow-test.js`

### ✅ New Security Files:
- `.env.example` - Template for environment variables
- `V.md` - Complete security vulnerability assessment
- `SECURITY_SETUP.md` - This setup guide

---

## 🔧 Production Deployment

### Environment Variables for Production:
```bash
# Use strong, unique values for production!
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_ADMIN_PASSKEY=super-secure-random-passkey-min-20-chars
VITE_ALLOWED_DOMAINS=yourdomain.com,anotherdomain.com
```

### Additional Security Recommendations:
1. **Rotate all credentials** regularly
2. **Enable Row Level Security** on all Supabase tables
3. **Set up proper CORS** policies in Supabase
4. **Implement rate limiting** for admin endpoints
5. **Use HTTPS** in production
6. **Monitor access logs** regularly
7. **Set up database backups**

---

## 🚨 What NOT to Do

### ❌ NEVER:
- Commit `.env` files to version control
- Use default or weak passwords
- Share credentials in chat/email
- Hardcode secrets in source code
- Use the same credentials across environments

### ❌ DO NOT:
- Use "143143" as admin passkey
- Expose Supabase URLs in public documentation
- Share API keys in screenshots or demos
- Deploy without changing default values

---

## 🔍 Verify Your Setup

### Test Security Checklist:
- [ ] `.env` file is in `.gitignore`
- [ ] No hardcoded credentials in source code
- [ ] Admin passkey is strong and unique
- [ ] Supabase URL and keys are from your own project
- [ ] Environment variables load correctly
- [ ] Application runs without credential errors

### Quick Test:
```bash
# This should fail if environment variables are missing
npm run build
```

---

## 📞 Need Help?

If you encounter issues:
1. Check that all environment variables are set correctly
2. Verify your Supabase project is active
3. Ensure your domain is allowed in Supabase Auth settings
4. Check browser console for detailed error messages

---

## 📋 Original Vulnerability Report

See `V.md` for the complete security assessment that led to these changes. This document contains details about what vulnerabilities were found and how they were addressed.

---

**Remember: Security is everyone's responsibility. Always follow best practices for credential management and never expose sensitive information in public repositories.**