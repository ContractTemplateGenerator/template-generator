# How to Install Custom Word Add-in (Step-by-Step)

## 🔍 **First: Check Your Word Version**

Different Word versions have different installation methods:

### Check Your Version:
1. **Open Word**
2. **Click:** Word menu → About Word
3. **Note your version:** (Office 365, Word 2019, Word 2021, etc.)

---

## 📥 **Installation Methods (Try in Order)**

### **Method 1: Sideloading (Office 365/Word 2019+)**

1. **Open Word**
2. **Go to:** File → Options → Trust Center → Trust Center Settings
3. **Click:** Trusted Add-in Catalogs
4. **Add this URL:** `http://localhost:3000`
5. **Check:** "Show in Menu"
6. **Click:** OK and restart Word
7. **Go to:** Insert → My Add-ins → Shared Folder
8. **Select:** Your manifest.xml file

### **Method 2: Developer Mode (Recommended)**

1. **Enable Developer Tab:**
   - File → Options → Customize Ribbon
   - Check "Developer" tab
   - Click OK

2. **Use Developer Tab:**
   - Click Developer tab → Add-ins → COM Add-ins
   - Browse to manifest.xml file

### **Method 3: Registry Method (Windows)**

If on Windows, I can help add registry entries to enable sideloading.

### **Method 4: Office Developer Tools**

1. **Install Office Developer Tools** (if you have Visual Studio)
2. **Open as Office Add-in project**
3. **Deploy directly to Word**

---

## 🌐 **Alternative: Use Word Online**

Word Online is often more permissive:

1. **Go to:** office.com
2. **Open Word Online**
3. **Insert → Office Add-ins → Upload My Add-in**
4. **Upload manifest.xml**

---

## 🔧 **Troubleshooting**

### If "Upload My Add-in" is Grayed Out:
- Your organization may have disabled custom add-ins
- Try Word Online instead
- Use Developer mode

### If You Get Security Warnings:
- Add `localhost` to trusted sites
- Enable "Trust access to the VBA project object model"

### If Nothing Works:
- We can convert this to a Word macro (VBA)
- Or create a standalone desktop app
- Or use Word's built-in find/replace with automation

---

## 📞 **Need Help?**

Let me know:
1. **Your Word version**
2. **Which method you tried**
3. **Any error messages you see**

I'll help you get this working!