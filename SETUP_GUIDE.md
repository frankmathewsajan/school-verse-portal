# Quick Setup Guide for Facilities Image Upload

## 🚀 Step 1: Create Storage Buckets in Supabase

1. Go to your **Supabase Dashboard** at https://app.supabase.io
2. Select your project: **school-verse-portal**
3. Navigate to **SQL Editor** in the left sidebar
4. Create a new query and **copy/paste this SQL**:

```sql
-- Copy the contents of create-storage-buckets.sql file
```

5. Click **Run** to execute the SQL

## 🔧 Step 2: Fix Facilities Table Function (if needed)

If you get the function error, run this in SQL Editor:

```sql
-- Copy the updated contents of setup-facilities-table.sql file
```

## ✅ Step 3: Test the Setup

1. Go to your admin dashboard: `http://localhost:8080/admin/dashboard`
2. Click **Storage Test** tab
3. Click **Test Storage Connection**
4. You should see: "✅ site-images bucket exists"

## 🖼️ Step 4: Test Image Upload

1. Go to **Facilities** tab in admin dashboard
2. Click **Add Facility**
3. Fill in facility name and description
4. Upload an image using the **Upload Image** button
5. You should see immediate preview in the form
6. Save the facility
7. Check that the facility appears in the list with image preview

## 🎯 New Features Added

### **Enhanced Facilities Management:**
- ✅ Image previews in admin cards
- ✅ Hover overlay with edit/delete buttons
- ✅ Status badges (Active/Hidden)
- ✅ Better text wrapping and truncation
- ✅ Improved card layout with consistent heights

### **Enhanced Announcements:**
- ✅ **Clickable links** - URLs automatically become clickable
- ✅ **Text wrapping** - Long content stays within card boundaries
- ✅ **Better layout** - Improved spacing and typography
- ✅ **Link parsing** - Supports http/https/www URLs
- ✅ **Mobile responsive** - Works on all screen sizes

## 📝 How to Use Announcements with Links

When creating announcements, just include URLs naturally in your text:

```
Join our online meeting at https://zoom.us/j/123456789
Visit our website www.school.edu for more info
Download the form from https://drive.google.com/file/xyz
```

The system will automatically make these clickable links that open in new tabs!

## 🐛 Troubleshooting

**If image upload fails:**
- Check browser console for errors
- Verify storage buckets exist (use Storage Test)
- Ensure you're authenticated as admin

**If announcements don't show links:**
- Clear browser cache
- Check that the text-with-links component is imported correctly

**If facilities don't appear:**
- Check that the facilities table exists in Supabase
- Verify RLS policies are set correctly
