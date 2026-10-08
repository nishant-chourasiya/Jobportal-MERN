# 🧪 Complete Testing Guide - All Endpoints & UI Workflow

A comprehensive guide to test every endpoint and understand how the UI interacts with the backend.

---

## 📌 Prerequisites

- Backend running on: `http://localhost:3000`
- Frontend running on: `http://localhost:5173`
- MongoDB running locally: `mongodb://localhost:27017/1jobportal`
- Two browser windows/tabs or incognito mode (to test as different users)

---

## 🔐 AUTHENTICATION ENDPOINTS

### **1. POST /api/v1/user/register - Register New User**

#### **Backend Processing:**
```
Request → Validate Input → Hash Password → Check if User Exists 
→ Upload Photo to Cloudinary → Create User in MongoDB → Response
```

#### **Frontend UI Steps to Test:**

**As Student:**
1. Open `http://localhost:5173/signup`
2. Fill form:
   - Full Name: "John Student"
   - Email: "john@gmail.com"
   - Phone: "9876543210"
   - Password: "password123"
   - Role: Select **"student"**
   - Profile Photo: Optional (upload or skip)
3. Click "Sign Up" button

**Expected Results:**
- Form submitted via `POST /api/v1/user/register`
- Success toast notification appears: "Account created successfully"
- Redirected to login page or home
- User data stored in MongoDB collection `users`

**Network Request (Developer Tools → Network Tab):**
```
Request Headers:
  Content-Type: application/json

Request Body:
{
  "fullname": "John Student",
  "email": "john@gmail.com",
  "phoneNumber": "9876543210",
  "password": "password123",
  "role": "student"
}

Response (201):
{
  "message": "Account created successfully.",
  "success": true
}
```

**What Happens in Backend:**
- Password hashed: `password123` → `$2a$10$...` (bcryptjs)
- If photo uploaded: Sent to Cloudinary, URL stored
- User document created:
```javascript
{
  fullname: "John Student",
  email: "john@gmail.com",
  phoneNumber: 9876543210,
  password: "$2a$10$...", // hashed
  role: "student",
  profile: {
    profilePhoto: "cloudinary_url_or_empty"
  }
}
```

---

**As Recruiter:**
1. Same steps as above, but select **"recruiter"** role
2. Email: "recruiter@gmail.com"

**Difference for Recruiter:**
- Can access admin pages after login
- Can create companies and post jobs

---

### **2. POST /api/v1/user/login - Login User**

#### **Frontend UI Steps to Test:**

1. Open `http://localhost:5173/login`
2. Fill form:
   - Email: "john@gmail.com"
   - Password: "password123"
   - Role: Select **"student"**
3. Click "Login" button

**Expected Results:**
- Form submitted via `POST /api/v1/user/login`
- Success toast notification: "Welcome back John Student"
- Redirected to home page (`/`)
- Redux store updated with user data
- Token stored in httpOnly cookie

**Network Request:**
```
POST /api/v1/user/login

Headers:
  Content-Type: application/json

Body:
{
  "email": "john@gmail.com",
  "password": "password123",
  "role": "student"
}

Response (200):
{
  "message": "Welcome back John Student",
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Student",
    "email": "john@gmail.com",
    "phoneNumber": 9876543210,
    "role": "student",
    "profile": {
      "bio": "",
      "skills": [],
      "resume": "",
      "profilePhoto": ""
    }
  }
}

Cookies Set:
  token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  (httpOnly, maxAge: 86400000 - 24 hours)
```

**How It Works:**
1. Backend finds user by email
2. Compares entered password with hashed password
3. Creates JWT token with userId
4. Sets token in httpOnly cookie
5. Returns user object to frontend
6. Frontend Redux updates `auth.user` with received data

**To Verify Token in Browser:**
1. Open DevTools (F12)
2. Go to "Application" tab
3. Check "Cookies" → token value (encrypted, can't read content)

---

### **3. GET /api/v1/user/logout - Logout User**

#### **Frontend UI Steps to Test:**

1. After logging in, click **"Logout"** button in Navbar
2. Or navigate to `http://localhost:3000/api/v1/user/logout`

**Expected Results:**
- GET request sent to `/api/v1/user/logout`
- Token cookie cleared (maxAge: 0)
- Redux auth store reset
- Redirected to home page
- Login button appears in navbar

**Network Request:**
```
GET /api/v1/user/logout
withCredentials: true

Response (200):
{
  "message": "Logged out successfully.",
  "success": true
}

Cookies Cleared:
  token: "" (deleted)
```

**What Happens:**
- Backend clears token from cookies
- Frontend clears Redux `auth.user` state
- Redirect guard (in ProtectedRoute) now redirects admin pages to home

---

### **4. POST /api/v1/user/profile/update - Update User Profile**

#### **Frontend UI Steps to Test:**

1. Login as any user
2. Click **"Profile"** in navbar or go to `/profile`
3. On Profile page, click **"Edit"** or **"Update Profile"** button
4. Dialog/Modal opens (UpdateProfileDialog component)
5. Fill form:
   - Bio: "I am a passionate developer"
   - Skills: "React,Node,MongoDB" (comma-separated)
   - Resume: Upload PDF/file
6. Click "Update" button

**Expected Results:**
- POST request to `/api/v1/user/profile/update`
- Success toast: "Profile updated successfully"
- Profile data re-fetched and displayed
- Resume URL stored in Cloudinary

**Network Request:**
```
POST /api/v1/user/profile/update

Headers:
  Content-Type: multipart/form-data
  Cookie: token=...

Body (FormData):
  fullname: "John Student"
  bio: "I am a passionate developer"
  skills: "React,Node,MongoDB"
  profilePhoto: [File object]
  resume: [File object]

Response (200):
{
  "message": "Profile updated successfully.",
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "fullname": "John Student",
    "profile": {
      "bio": "I am a passionate developer",
      "skills": ["React", "Node", "MongoDB"],
      "resume": "https://cloudinary.com/...",
      "resumeOriginalName": "john_resume.pdf"
    }
  }
}
```

**Backend Processing:**
1. Authenticated via middleware (checks token)
2. If file uploaded: Upload to Cloudinary, get URL
3. Update user document in MongoDB
4. Return updated user object

---

## 💼 COMPANY ENDPOINTS

### **5. POST /api/v1/company/register - Create Company (Recruiter Only)**

#### **Frontend UI Steps to Test:**

1. Login as **recruiter**
2. Click **"Admin"** in navbar or go to `/admin/companies`
3. Click **"Create New Company"** button
4. Form opens (CompanyCreate component)
5. Fill form:
   - Company Name: "TechCorp Solutions"
   - Description: "Leading tech solutions provider"
   - Website: "www.techcorp.com"
   - Location: "San Francisco, CA"
   - Company Logo: Upload image
6. Click "Create" button

**Expected Results:**
- POST request to `/api/v1/company/register`
- Success toast: "Company registered successfully"
- Redirected to company setup page or companies list
- Company appears in list

**Network Request:**
```
POST /api/v1/company/register

Headers:
  Content-Type: multipart/form-data
  Cookie: token=...

Body:
{
  "companyName": "TechCorp Solutions",
  "description": "Leading tech solutions provider",
  "website": "www.techcorp.com",
  "location": "San Francisco, CA",
  "logo": [File object]
}

Response (201):
{
  "message": "Company registered successfully.",
  "success": true,
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "TechCorp Solutions",
    "description": "Leading tech solutions provider",
    "website": "www.techcorp.com",
    "location": "San Francisco, CA",
    "logo": "https://cloudinary.com/...",
    "userId": "507f1f77bcf86cd799439011"
  }
}
```

**Protection:** ✅ Requires authentication (isAuthenticated middleware)

---

### **6. GET /api/v1/company/get - Get All Companies**

#### **Frontend UI Steps to Test:**

1. Open `http://localhost:5173` (Home page)
2. Page loads automatically
3. Companies carousel displays at top
4. OR go to `/admin/companies` (as recruiter)

**Expected Results:**
- GET request to `/api/v1/company/get` fires automatically
- All companies from MongoDB displayed
- No authentication required (public endpoint)

**Network Request:**
```
GET /api/v1/company/get

Response (200):
{
  "companies": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "TechCorp Solutions",
      "description": "Leading tech solutions provider",
      "website": "www.techcorp.com",
      "location": "San Francisco, CA",
      "logo": "https://cloudinary.com/...",
      "userId": "507f1f77bcf86cd799439011",
      "createdAt": "2025-02-24T10:00:00Z"
    },
    // ... more companies
  ],
  "success": true
}
```

**Frontend Component:**
- Companies displayed in `CategoryCarousel.jsx` on Home
- Also shown in Companies table on `/admin/companies`

---

### **7. GET /api/v1/company/get/:id - Get Single Company Details**

#### **Frontend UI Steps to Test:**

1. Go to `/admin/companies` (as recruiter)
2. Click on a company name/row
3. Redirected to `/admin/companies/:id`

**Expected Results:**
- GET request to `/api/v1/company/get/:companyId`
- Company details loaded
- All jobs posted by this company shown
- Edit option available for company creator

**Network Request:**
```
GET /api/v1/company/get/507f1f77bcf86cd799439012

Headers:
  Cookie: token=...

Response (200):
{
  "company": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "TechCorp Solutions",
    "description": "Leading tech solutions provider",
    "website": "www.techcorp.com",
    "location": "San Francisco, CA",
    "logo": "https://cloudinary.com/...",
    "userId": "507f1f77bcf86cd799439011"
  },
  "success": true
}
```

**Protection:** ✅ Requires authentication

---

## 💼 JOB ENDPOINTS

### **8. POST /api/v1/job/post - Post New Job (Recruiter Only)**

#### **Frontend UI Steps to Test:**

1. Login as **recruiter**
2. Go to `/admin/jobs`
3. Click **"Post New Job"** button
4. Form opens (PostJob component)
5. Fill form:
   - Job Title: "Senior React Developer"
   - Job Type: "Full Time"
   - Experience Level: "3-5 years"
   - Position: "5" (number of openings)
   - Salary: "80000" (annual)
   - Location: "Remote"
   - Description: "Looking for experienced React developer..."
   - Requirements: "React,TypeScript,Redux" (comma-separated)
   - Company: Select from dropdown
6. Click "Post Job" button

**Expected Results:**
- POST request to `/api/v1/job/post`
- Success toast: "New job created successfully"
- Job appears in admin jobs list
- Visible to students on `/jobs` page

**Network Request:**
```
POST /api/v1/job/post

Headers:
  Content-Type: application/json
  Cookie: token=...

Body:
{
  "title": "Senior React Developer",
  "description": "Looking for experienced React developer...",
  "requirements": "React,TypeScript,Redux",
  "salary": "80000",
  "location": "Remote",
  "jobType": "Full Time",
  "experience": "3-5 years",
  "position": "5",
  "companyId": "507f1f77bcf86cd799439012"
}

Response (201):
{
  "message": "New job created successfully.",
  "success": true,
  "job": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "description": "Looking for experienced React developer...",
    "requirements": ["React", "TypeScript", "Redux"],
    "salary": 80000,
    "location": "Remote",
    "jobType": "Full Time",
    "experienceLevel": "3-5 years",
    "position": 5,
    "company": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "TechCorp Solutions"
    },
    "created_by": "507f1f77bcf86cd799439011",
    "createdAt": "2025-02-24T10:00:00Z"
  }
}
```

**Protection:** ✅ Requires authentication + checks userId matches recruiter

---

### **9. GET /api/v1/job/get - Get All Jobs with Search**

#### **Frontend UI Steps to Test:**

1. Navigate to `/jobs` page (or `/browse` page)
2. Page loads and displays all jobs
3. Type in search box: "React"
4. Jobs filtered to show only React-related positions

**Expected Results:**
- GET request with query parameter: `/api/v1/job/get?keyword=React`
- Jobs matching "React" in title/description displayed
- No authentication required

**Network Request:**
```
GET /api/v1/job/get?keyword=React

Response (200):
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Senior React Developer",
      "description": "Looking for experienced React developer...",
      "requirements": ["React", "TypeScript", "Redux"],
      "salary": 80000,
      "location": "Remote",
      "jobType": "Full Time",
      "experienceLevel": "3-5 years",
      "position": 5,
      "company": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "TechCorp Solutions",
        "location": "San Francisco, CA"
      },
      "created_by": "507f1f77bcf86cd799439011",
      "createdAt": "2025-02-24T10:00:00Z"
    },
    // ... more matching jobs
  ],
  "success": true
}
```

**Frontend Workflow:**
1. User types search query
2. `useGetAllJobs` hook triggers with `searchedQuery`
3. Query parameter appended to API call
4. Results filtered using MongoDB regex (case-insensitive)
5. Jobs displayed in grid on Jobs.jsx

---

### **10. GET /api/v1/job/get/:id - Get Single Job Details**

#### **Frontend UI Steps to Test:**

1. On `/jobs` or `/browse` page
2. Click on any job card
3. Redirected to `/description/:jobId`
4. Single job details displayed

**Expected Results:**
- GET request to `/api/v1/job/get/:jobId`
- Job title, description, requirements, salary displayed
- Company details shown
- "Apply Now" button visible for students
- Applicants list visible for recruiter who posted job

**Network Request:**
```
GET /api/v1/job/get/507f1f77bcf86cd799439013

Headers:
  Cookie: token=...

Response (200):
{
  "job": {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Senior React Developer",
    "description": "Looking for experienced React developer...",
    "requirements": ["React", "TypeScript", "Redux"],
    "salary": 80000,
    "location": "Remote",
    "jobType": "Full Time",
    "experienceLevel": "3-5 years",
    "position": 5,
    "company": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "TechCorp Solutions",
      "website": "www.techcorp.com",
      "location": "San Francisco, CA"
    },
    "created_by": "507f1f77bcf86cd799439011",
    "createdAt": "2025-02-24T10:00:00Z"
  },
  "success": true
}
```

**Protection:** ✅ Requires authentication

---

### **11. GET /api/v1/job/getadminjobs - Get Admin's Jobs (Recruiter Only)**

#### **Frontend UI Steps to Test:**

1. Login as **recruiter**
2. Go to `/admin/jobs`
3. Page loads automatically

**Expected Results:**
- GET request to `/api/v1/job/getadminjobs`
- Only jobs posted by logged-in recruiter displayed
- Edit/Delete options available for each job
- Applicant count shown

**Network Request:**
```
GET /api/v1/job/getadminjobs

Headers:
  Cookie: token=...

Response (200):
{
  "jobs": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "title": "Senior React Developer",
      "description": "Looking for experienced React developer...",
      "requirements": ["React", "TypeScript", "Redux"],
      "salary": 80000,
      "location": "Remote",
      "jobType": "Full Time",
      "created_by": "507f1f77bcf86cd799439011",
      // ... full job object
    },
    // ... more jobs by this recruiter
  ],
  "success": true
}
```

**Protection:** ✅ Requires authentication (only shows recruiter's own jobs)

---

## 📋 APPLICATION ENDPOINTS

### **12. POST /api/v1/application/apply - Apply for Job (Student Only)**

#### **Frontend UI Steps to Test:**

1. Login as **student**
2. Go to `/jobs` page
3. Click on any job card to see details
4. On job details page, click **"Apply Now"** button

**Expected Results:**
- POST request to `/api/v1/application/apply`
- Success toast: "Applied successfully"
- Button changes to "Already Applied" or disabled
- Application record created in MongoDB

**Network Request:**
```
POST /api/v1/application/apply

Headers:
  Content-Type: application/json
  Cookie: token=...

Body:
{
  "jobId": "507f1f77bcf86cd799439013"
}

Response (201):
{
  "message": "Applied successfully.",
  "success": true,
  "application": {
    "_id": "507f1f77bcf86cd799439014",
    "job": "507f1f77bcf86cd799439013",
    "applicant": "507f1f77bcf86cd799439011",
    "status": "pending",
    "createdAt": "2025-02-24T10:30:00Z"
  }
}
```

**What Happens Behind Scenes:**
1. Backend verifies user is student
2. Checks if already applied (prevents duplicate applications)
3. Creates Application document linking Job + Student
4. Application status set to "pending"
5. Frontend updates Redux `application.appliedJobs` list

**Protection:** ✅ Requires authentication

---

### **13. GET /api/v1/application/get - Get Applications (Student Only)**

#### **Frontend UI Steps to Test:**

1. Login as **student**
2. Click **"Applied Jobs"** in navbar or go to that section
3. All jobs student applied for displayed in table

**Expected Results:**
- GET request to `/api/v1/application/get`
- Student's applications listed
- Shows job title, company, status, date applied

**Network Request:**
```
GET /api/v1/application/get

Headers:
  Cookie: token=...

Response (200):
{
  "applications": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "job": {
        "_id": "507f1f77bcf86cd799439013",
        "title": "Senior React Developer",
        "company": {
          "_id": "507f1f77bcf86cd799439012",
          "name": "TechCorp Solutions"
        }
      },
      "applicant": "507f1f77bcf86cd799439011",
      "status": "pending",
      "createdAt": "2025-02-24T10:30:00Z"
    },
    // ... more applications
  ],
  "success": true
}
```

**Frontend Component:** `AppliedJobTable.jsx`

---

### **14. GET /api/v1/application/applicants/:id - Get Job Applicants (Recruiter Only)**

#### **Frontend UI Steps to Test:**

1. Login as **recruiter**
2. Go to `/admin/jobs`
3. Table shows each job with applicant count
4. Click **"Applicants"** button next to a job
5. Or click job row to view details with applicants

**Expected Results:**
- GET request to `/api/v1/application/applicants/:jobId`
- All students who applied for job displayed
- Shows name, email, status, applied date
- Recruiter can accept/reject applications

**Network Request:**
```
GET /api/v1/application/applicants/507f1f77bcf86cd799439013

Headers:
  Cookie: token=...

Response (200):
{
  "application": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "job": "507f1f77bcf86cd799439013",
      "applicant": {
        "_id": "507f1f77bcf86cd799439011",
        "fullname": "John Student",
        "email": "john@gmail.com",
        "phoneNumber": 9876543210,
        "profile": {
          "bio": "Passionate developer",
          "skills": ["React", "Node", "MongoDB"],
          "resume": "https://cloudinary.com/..."
        }
      },
      "status": "pending",
      "createdAt": "2025-02-24T10:30:00Z"
    },
    // ... more applicants
  ],
  "success": true
}
```

**Frontend Component:** `ApplicantsTable.jsx`

**Protection:** ✅ Requires authentication + checks if recruiter posted this job

---

## 🧪 Complete End-to-End Testing Scenarios

### **Scenario 1: Student Journey**

```
1. Sign up as student
   ↓
2. Login with student credentials
   ↓
3. Browse jobs on /jobs
   ↓
4. Search for "React" jobs
   ↓
5. View job details
   ↓
6. Apply for job
   ↓
7. View applied jobs on profile
   ↓
8. Update profile with bio, skills, resume
   ↓
9. Logout
```

**Commands to Execute in Browser Console:**
```javascript
// Check redux state at each step
console.log(store.getState()); // Check auth, jobs, applications

// Verify API calls in Network tab
// Watch Cookies for token
```

---

### **Scenario 2: Recruiter Journey**

```
1. Sign up as recruiter
   ↓
2. Login with recruiter credentials
   ↓
3. Create new company
   ↓
4. Post 3 new jobs for company
   ↓
5. View posted jobs on admin dashboard
   ↓
6. Have students apply (use student account)
   ↓
7. View applicants for each job
   ↓
8. Accept/Reject applications (if feature exists)
   ↓
9. Logout
```

---

## 🔍 Debugging Guide

### **Check Redux State:**
Open DevTools → Redux DevTools Extension (if installed)
```
View full state tree
Check auth.user
Check jobs.allJobs
Check applications.appliedJobs
```

### **Monitor Network Requests:**
1. Open DevTools → Network tab
2. Filter by XHR (XMLHttpRequest)
3. Each API call shows:
   - Request method (GET/POST)
   - URL with query params
   - Response status (200/201/400/401)
   - Request/Response body
   - Time taken

### **Check Console for Errors:**
```
Look for red error messages
Check for console.log() debug outputs
Verify JWT verification errors
```

### **Cookie Verification:**
1. DevTools → Application
2. Cookies → localhost:3000
3. Check `token` cookie exists after login
4. Check `token` cleared after logout

---

## ✅ Test Checklist

- [ ] **User Registration** - Create student account
- [ ] **User Registration** - Create recruiter account
- [ ] **User Login** - Login as student
- [ ] **User Login** - Login as recruiter
- [ ] **User Logout** - Logout successfully
- [ ] **Profile Update** - Update profile as student
- [ ] **Company Creation** - Create company as recruiter
- [ ] **Get All Companies** - View companies on home page
- [ ] **Get Company Details** - Click on company card
- [ ] **Post Job** - Post job as recruiter
- [ ] **Get All Jobs** - View jobs on /jobs page
- [ ] **Search Jobs** - Search for specific job keyword
- [ ] **Get Job Details** - Click on job card
- [ ] **Apply for Job** - Apply as student
- [ ] **View Applied Jobs** - Check applied jobs list
- [ ] **View Applicants** - View applicants as recruiter
- [ ] **Protected Routes** - Try accessing admin as student (should redirect)
- [ ] **Authentication Check** - Verify token in cookies

---

## 🚨 Common Issues & Solutions

### **Issue: "User not authenticated" error**
- **Cause:** Missing or invalid token cookie
- **Solution:** Login again, check Network tab for cookie

### **Issue: Jobs not showing**
- **Cause:** MongoDB not running or collection empty
- **Solution:** Check MongoDB connection, POST a job first

### **Issue: "Apply" button disabled**
- **Cause:** Already applied or not logged in as student
- **Solution:** Use different student account or clear localStorage

### **Issue: CORS error**
- **Cause:** Frontend/Backend URL mismatch
- **Solution:** Ensure backend on 3000, frontend on 5173

### **Issue: Image upload fails**
- **Cause:** Cloudinary credentials invalid
- **Solution:** Check .env file for correct Cloudinary API key

---

## 📞 Quick Reference URLs

| Page | URL | Authentication | Purpose |
|------|-----|---|---------|
| Home | `/` | Optional | Browse featured jobs & companies |
| Sign Up | `/signup` | ❌ | Create new account |
| Login | `/login` | ❌ | Login to account |
| Jobs | `/jobs` | Optional | Browse all jobs |
| Browse | `/browse` | Optional | Browse jobs with filter |
| Job Details | `/description/:id` | ✅ | View single job details |
| Profile | `/profile` | ✅ | View/Edit user profile |
| Admin Jobs | `/admin/jobs` | ✅ Recruiter | Post & manage jobs |
| Admin Companies | `/admin/companies` | ✅ Recruiter | Create & manage companies |
| Applicants | `/admin/applicants/:id` | ✅ Recruiter | View job applicants |

---

**Happy Testing! 🎉**
