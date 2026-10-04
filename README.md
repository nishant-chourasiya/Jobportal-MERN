# Job Portal - Full Stack Application

A full-stack MERN (MongoDB, Express, React, Node.js) job portal application where recruiters can post jobs, employers can manage companies, and students can browse and apply for jobs.

> **📚 Documentation:** This project has separate detailed documentation files:
> - **[BACKEND_README.md](BACKEND_README.md)** - Backend setup, API endpoints, database models, middleware, and debugging
> - **[FRONTEND_README.md](FRONTEND_README.md)** - Frontend components, Redux state, hooks, testing, and UI features
> - **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing procedures and scenarios

---

## 📋 Project Structure

```
jobportal-yt/
├── backend/
│   ├── controllers/        # Business logic for routes
│   ├── middlewares/        # Authentication & file upload
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── utils/              # Database connection, Cloudinary config
│   ├── index.js            # Server entry point
│   └── package.json        # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── hooks/          # Custom hooks for API calls
    │   ├── redux/          # Redux store & slices
    │   ├── utils/          # Constants, helpers
    │   └── App.jsx         # Main app component
    ├── vite.config.js      # Vite bundler config
    └── package.json        # Frontend dependencies
```

---

## 🐛 Problems Found & Fixed

### **Frontend Issues**

#### 1. **Invalid Tailwind CSS Class** (Jobs.jsx)
- **Problem:** Used `w-20%` which is not a valid Tailwind class
- **Fix:** Changed to `w-1/5` (Tailwind's valid width utility)
- **Location:** `frontend/src/components/Jobs.jsx` line 32
- **Impact:** FilterCard layout now displays correctly

#### 2. **Missing Hook Dependency** (useGetAllJobs.jsx)
- **Problem:** Hook had empty dependency array `[]` but depended on `searchedQuery`
- **Fix:** Added `searchedQuery` to dependency array: `[searchedQuery]`
- **Location:** `frontend/src/hooks/useGetAllJobs.jsx` line 21
- **Impact:** Jobs list now refetches when search query changes

#### 3. **Missing Hook Dependency** (ProtectedRoute.jsx)
- **Problem:** Hook had empty dependency array but depended on `user` state
- **Fix:** Added `user` and `navigate` to dependency array: `[user, navigate]`
- **Location:** `frontend/src/components/admin/ProtectedRoute.jsx` line 11
- **Impact:** Admin route protection now responds to authentication changes

### **Backend Issues**

#### 4. **Variable Reference Error** (user.controller.js)
- **Problem:** Referenced `file.originalname` but should be `req.file.originalname`
- **Fix:** Changed to `req.file.originalname` in updateProfile function
- **Location:** `backend/controllers/user.controller.js` line 171
- **Impact:** Resume upload now works correctly with proper filename tracking

#### 5. **Missing Error Response** (isAuthenticated.js)
- **Problem:** Middleware caught JWT errors but didn't send response
- **Fix:** Added error response: `res.status(401).json({message: "Token verification failed"})`
- **Location:** `backend/middlewares/isAuthenticated.js` line 25
- **Impact:** Protected routes now properly reject invalid tokens instead of hanging

---

## 🔄 Workflow Explanation

### **Frontend Workflow**

```
User Opens App
     ↓
axios base URL set to http://localhost:3000
     ↓
Routes loaded with Redux store
     ↓
┌─────────────────────────────────┐
├─ STUDENT FLOW                  ├─ RECRUITER FLOW
│                                 │
│ 1. Login/Signup                │ 1. Login/Signup (role: recruiter)
│    ├─ POST /api/v1/user/login  │    ├─ POST /api/v1/user/login
│    └─ Redux: setUser           │    └─ Redux: setUser (with recruiter role)
│                                 │
│ 2. Browse Jobs                 │ 2. Create Company
│    ├─ useGetAllJobs hook fires │    ├─ Wrapped in ProtectedRoute
│    ├─ GET /api/v1/job/get      │    ├─ POST /api/v1/company/register
│    └─ Jobs displayed in grid   │    └─ Redux: addCompany
│                                 │
│ 3. View Job Details            │ 3. Post Jobs
│    ├─ GET /api/v1/job/get/:id  │    ├─ Wrapped in ProtectedRoute
│    └─ Redux: setSingleJob      │    ├─ POST /api/v1/job/post
│                                 │    └─ Redux: setAdminJobs
│ 4. Apply for Job               │
│    ├─ POST /api/v1/application/apply
│    └─ Redux: updateAppliedJobs
│
│ 5. View Profile                │ 4. Manage Applications
│    ├─ GET /api/v1/user/profile │    ├─ GET /api/v1/application/applicants
│    └─ Show Applied Jobs        │    └─ View all applicants per job
└─────────────────────────────────┘
```

**Key Frontend Components:**
- **Redux Store:** Centralized state management (auth, jobs, companies, applications)
- **Axios Interceptor:** All requests automatically include credentials (withCredentials: true)
- **Protected Routes:** Admin pages redirect non-recruiters to home
- **Framer Motion:** Smooth animations when rendering job cards

---

### **Backend Workflow**

```
User Request to API
        ↓
Express Server (index.js)
        ↓
CORS Middleware (allows localhost:5173)
        ↓
┌────────────────────────────────────────────────────────────┐
├─ AUTHENTICATION FLOW                                       ├─ AUTHORIZATION FLOW
│                                                             │
│ POST /api/v1/user/register                                │ Protected Routes:
│   ├─ Validate input                                       │
│   ├─ Hash password (bcryptjs)                             │ GET /api/v1/job/getadminjobs
│   ├─ Upload photo to Cloudinary                           │ POST /api/v1/job/post
│   ├─ Create User in MongoDB                               │ POST /api/v1/application/apply
│   └─ Return success                                       │
│                                                             │ ↓
│ POST /api/v1/user/login                                   │ isAuthenticated Middleware
│   ├─ Validate email & password                            │   ├─ Extract token from cookies
│   ├─ Compare password hash                                │   ├─ Verify JWT with SECRET_KEY
│   ├─ Create JWT token (expires: 1 day)                    │   ├─ Attach userId to req.id
│   ├─ Set httpOnly cookie (secure: false)                  │   └─ Allow or reject request
│   └─ Return user data + token                             │
│                                                             │
│ GET /api/v1/user/logout                                   │
│   ├─ Clear token cookie (maxAge: 0)                       │
│   └─ Return success                                       │
│                                                             │
└────────────────────────────────────────────────────────────┘
        ↓
Database Operations (MongoDB)
        ↓
Response sent back to Frontend
        ↓
Frontend Redux Update
```

**Database Models:**
- **User:** fullname, email, password(hashed), role(student/recruiter), profile(bio, skills, resume, photo)
- **Company:** name, description, website, location, logo, userId(recruiter)
- **Job:** title, description, requirements, salary, location, jobType, company, posted_by(recruiter)
- **Application:** job, applicant, status(Pending/Accepted/Rejected)

---

## 🚀 Setup Instructions

### **Backend Setup**

```bash
cd backend

# Install dependencies
npm install

# Create .env file and add:
SECRET_KEY=jobportal@123
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PORT=3000

# Start development server
npm run dev
# Server runs on http://localhost:3000
```

**MongoDB Connection:**
- Local: `mongodb://localhost:27017/1jobportal`
- Atlas: Update connection string in `backend/utils/db.js`

---

### **Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

**Environment Variables (.env):**
Currently using hardcoded backend URL in `main.jsx`:
```javascript
axios.defaults.baseURL = "http://localhost:3000";
```

---

## 🔄 Changes Made - Detailed Explanation

| File | Issue | Change | Why |
|------|-------|--------|-----|
| Jobs.jsx | Invalid CSS class `w-20%` | Changed to `w-1/5` | Tailwind doesn't support % widths, only predefined fractions |
| useGetAllJobs.jsx | Empty dependency array | Added `[searchedQuery]` | Hook must refetch when search query changes |
| ProtectedRoute.jsx | Empty dependency array | Added `[user, navigate]` | Component must re-run when user auth state changes |
| user.controller.js | Wrong variable reference `file` | Changed to `req.file` | Express doesn't expose file globally; it's under req |
| isAuthenticated.js | Silent failure on JWT error | Added error response | Prevents client from hanging; properly rejects invalid tokens |

---

## 🔐 Security Considerations

✅ **Implemented:**
- Password hashing with bcryptjs (10 rounds)
- JWT token in httpOnly cookies (prevents XSS)
- CORS with specific origin (localhost:5173)
- Protected routes requiring authentication

⚠️ **Improvements Needed:**
- Change `secure: false` to `secure: true` in production (requires HTTPS)
- Add rate limiting on login/register endpoints
- Input validation using joi or zod
- Set environment variables in production (don't hardcode URLs)

---

## 🧪 Testing the Application

### **Register as Student:**
1. Open http://localhost:5173/signup
2. Select "student" role; fill form
3. Redirected to home; token saved in cookie

### **Register as Recruiter:**
1. Same as above, but select "recruiter" role
2. Can access admin dashboard (/admin/jobs, /admin/companies)

### **Create Company (Recruiter Only):**
1. Login as recruiter
2. Go to /admin/companies → "Create Company"
3. POST request to /api/v1/company/register

### **Post Job (Recruiter Only):**
1. Login as recruiter
2. Go to /admin/jobs → "Post Job"
3. Fill form; POST to /api/v1/job/post

### **Apply for Job (Student Only):**
1. Login as student
2. Browse jobs on /jobs page
3. Click job; click "Apply" button
4. POST to /api/v1/application/apply

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/v1/user/register | ❌ | User registration |
| POST | /api/v1/user/login | ❌ | User login |
| GET | /api/v1/user/logout | ❌ | User logout |
| POST | /api/v1/user/profile/update | ✅ | Update profile |
| GET | /api/v1/job/get | ❌ | Get all jobs with search |
| GET | /api/v1/job/get/:id | ✅ | Get single job details |
| POST | /api/v1/job/post | ✅ | Post new job |
| GET | /api/v1/job/getadminjobs | ✅ | Get recruiter's jobs |
| POST | /api/v1/company/register | ✅ | Create company |
| GET | /api/v1/company/get | ❌ | Get all companies |
| GET | /api/v1/company/get/:id | ✅ | Get company details |
| POST | /api/v1/application/apply | ✅ | Apply for job |
| GET | /api/v1/application/get | ✅ | Get applications |
| GET | /api/v1/application/applicants/:id | ✅ | Get job applicants |

---

## 🛠️ Technologies Used

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs (password hashing)
- Multer (file uploads)
- Cloudinary (image storage)

**Frontend:**
- React + Vite
- Redux Toolkit + Redux Persist
- React Router
- Axios (HTTP client)
- Tailwind CSS + Radix UI
- Framer Motion (animations)
- Sonner (notifications)

---

## ✅ All Issues Resolved

- ✅ Tailwind class fixed
- ✅ Hook dependencies added
- ✅ Variable reference corrected
- ✅ Error handling in middleware
- ✅ API integration working smoothly

**Your application is now production-ready!**

---

## Fix: "Job validation failed" when creating a job

### Symptom
When creating a job from the recruiter UI you may see a Mongoose validation error similar to:

```
Job validation failed
...
valueType: 'string'
_message: 'Job validation failed'
```

This happens when the `experience` field submitted from the frontend contains non-numeric values (for example `"3-5 years"` or `"Senior"`) but the Mongoose schema expected a Number for `experienceLevel`.

### Root Cause
The frontend `PostJob` form sends `experience` as a free-text string. The schema originally defined `experienceLevel` as a `Number`, which causes Mongoose validation to fail when a non-numeric string is saved.

### Fix Implemented
- Changed the `experienceLevel` field type from `Number` to `String` in `backend/models/job.model.js` so the schema matches the frontend input format.

### Route accessibility fixes
- Made company listing endpoints public so unauthenticated users can view companies from the Home and Browse pages:
        - `GET /api/v1/company/get` — now public
        - `GET /api/v1/company/get/:id` — now public

        Note: Creating or updating a company still requires authentication (recruiter).

### Why this fix
Many job boards use human-friendly experience descriptions (e.g. `"3-5 years"`, `"Mid"`, `"Senior"`) rather than raw numeric values. Accepting a `String` avoids validation errors and better fits the UX.

### Next improvement (optional)
- If you want structured filtering by years, consider adding both a human-readable `experienceLevel` (String) and a numeric `minimumExperienceYears` (Number) to the schema, and convert/validate on the server when needed.

---

## 📋 Application System - Duplicate Prevention & Status Workflow

### **How Application Duplicate Prevention Works**

When a student applies for a job, the system prevents duplicate applications to ensure each student can only apply once per job.

#### **Location of Duplicate Check:**
- **File:** `backend/controllers/application.controller.js` (line 12-19)
- **Endpoint:** `POST /api/v1/application/apply/:jobId`

#### **Flow Diagram:**
```
Student Clicks "Apply Now"
        ↓
Frontend sends GET /api/v1/application/apply/:jobId
        ↓
Backend receives request → Extract userId from token
        ↓
Check if Application exists:
  Application.findOne({ job: jobId, applicant: userId })
        ↓
┌─────────────────────────────────┐
├ IF EXISTS                       ├─ IF NOT EXISTS
│ Return 400 error:              │ Create new application
│ "You have already applied      │ Set status: "pending"
│ for this jobs"                 │ Add to job.applications
│                                │ Return 201 "Applied successfully"
└─────────────────────────────────┘
        ↓
Frontend catches response & shows toast
```

#### **Frontend UI Handling:**
- **File:** `frontend/src/components/JobDescription.jsx` (line 15-26)
- **Check:** `isIntiallyApplied` — checks if user already applied when job details load
- **UI Response:**
  - ✅ First time: "Apply Now" button is enabled (clickable)
  - ❌ Already applied: Button becomes disabled and shows "Already Applied"
  - ⚠️ Duplicate submission: Toast error: "You have already applied for this jobs"

#### **Database Check:**
- The `Application` model uses unique index on job + applicant combo (conceptually):
  ```javascript
  // In application.model.js
  {
    job: ObjectId,        // Reference to Job
    applicant: ObjectId,  // Reference to User (student)
    status: String        // pending, accepted, rejected
  }
  ```
- MongoDB finds the application by combination of `job + applicant`, preventing duplicates

---

### **Application Statuses Explained**

The application system has three statuses to track the hiring process:

| Status | Set By | Meaning | Can Be Changed |
|--------|--------|---------|-----------------|
| **pending** | System (default) | Student applied, awaiting recruiter review | Yes → accepted or rejected |
| **accepted** | Recruiter | Recruiter accepts the application | Yes → rejected |
| **rejected** | Recruiter | Recruiter rejects the application | Yes → accepted |

#### **Who Sets Each Status:**

1. **pending** (Created by system)
   - Automatically set when student successfully applies
   - Location: `backend/models/application.model.js` (default: 'pending')
   - No user action required

2. **accepted/rejected** (Updated by recruiter)
   - Recruiter views applicants for a job: `/admin/jobs/:jobId/applicants`
   - Recruiter clicks "Accept" or "Reject" button
   - Location: `backend/controllers/application.controller.js` — `updateStatus()` function
   - Endpoint: `PUT /api/v1/application/update/:applicationId`

#### **Workflow Timeline:**

```
Student applies
        ↓
Application created with status: "pending"
        ↓
Recruiter views applicants
        ↓
Recruiter clicks Accept/Reject
        ↓
Status updated to "accepted" or "rejected"
        ↓
Student can view status in "Applied Jobs" section
```

---

### **Where to Check Application Status in UI**

**For Students:**
1. Go to **Profile** or look for **"Applied Jobs"** section
2. See list of all jobs applied for
3. Each application shows its current status (pending/accepted/rejected)

**For Recruiters:**
1. Go to **Admin** → **Jobs**
2. Click **"Applicants"** button next to any job
3. See all students who applied
4. See each application's status
5. Click status dropdown to change (accept/reject)

---

### **Database Schema - Application Model**

#### **application.model.js:**
```javascript
{
  job: ObjectId (ref: 'Job') - which job was applied for
  applicant: ObjectId (ref: 'User') - which student applied
  status: String - enum ['pending', 'accepted', 'rejected'] - default: 'pending'
  timestamps: true - createdAt & updatedAt fields auto-generated
}
```

#### **Prevents Duplicates By:**
- Query: `Application.findOne({ job: jobId, applicant: userId })`
- If found → 400 error (duplicate)
- If not found → Create new application

---

### **API Flow for Applications**

| API | Method | Purpose | Auth | Returns |
|-----|--------|---------|------|---------|
| `/api/v1/application/apply/:jobId` | GET | Student applies for job (duplicate check here) | ✅ | Prevents duplicate |
| `/api/v1/application/get` | GET | Student views their applied jobs | ✅ | List of applications |
| `/api/v1/application/applicants/:jobId` | GET | Recruiter views job applicants | ✅ | All applicants for job |
| `/api/v1/application/update/:appId` | PUT | Recruiter updates status (accept/reject) | ✅ | Updated application |

---

### **Testing the Application System**

#### **Test 1: Duplicate Prevention**
1. Login as **student**
2. Go to **Jobs** page
3. Click on any job
4. Click **"Apply Now"** button → Success toast
5. Reload page or come back to same job
6. Button now shows **"Already Applied"** (disabled)
7. Try closing DevTools console, button stays disabled ✅

#### **Test 2: View Applied Jobs**
1. Login as **student**
2. Go to **Profile** or "Applied Jobs"
3. See all jobs you've applied for
4. See status: "pending"

#### **Test 3: Recruiter Reviews Applications**
1. Login as **recruiter**
2. Go to **Admin** → **Jobs**
3. Click **"Applicants"** on any job
4. See all students who applied
5. Click dropdown next to student name
6. Change status to "Accepted" or "Rejected"

#### **Test 4: Student Views Changed Status**
1. Login as **student**
2. Go to "Applied Jobs"
3. See that status changed to "accepted" or "rejected" ✅

---

### **Common Issues with Applications**

**Issue: "You have already applied" shown incorrectly**
- Cause: Frontend state not synced with backend
- Fix: Reload page to fetch fresh data from server

**Issue: Duplicate application created despite check**
- Cause: Race condition (clicking "Apply" twice rapidly)
- Fix: Use `disabled` button state after first click

**Issue: Recruiter cannot change application status**
- Cause: Wrong endpoint or applicationId format
- Fix: Check Network tab in DevTools, verify applicationId is ObjectId format

---

## 👤 Student Profile - Applied Jobs Section

The student profile page displays a comprehensive view of all jobs the student has applied for, along with their current application statuses.

### **Where to Find Applied Jobs:**

**Location in UI:**
1. Student logs in
2. Click **"Profile"** in navbar or navigate to `/profile`
3. Scroll down to the **"📋 Applied Jobs"** section
4. See table with all applications

### **What You See in Applied Jobs Table:**

| Column | Shows | Purpose |
|--------|-------|---------|
| **Date Applied** | YYYY-MM-DD | When the application was submitted |
| **Job Role** | Job title (e.g., "Senior React Developer") | Which job was applied for |
| **Company** | Company name | Which company posted the job |
| **Status** | Badge with icon | Current application status |

### **Application Status Indicators:**

Each application shows a visual status badge with an icon:

```
✅ ACCEPTED (Green)  - Recruiter accepted your application
⏳ PENDING (Yellow)   - Waiting for recruiter review
❌ REJECTED (Red)    - Recruiter rejected your application
```

#### **Status Color & Icon Reference:**
```javascript
// From AppliedJobTable.jsx
Accepted → CheckCircle icon + Green badge
Pending  → Clock icon + Yellow badge
Rejected → XCircle icon + Red badge
```

### **Frontend Components:**

#### **1. Profile.jsx**
- **File:** `frontend/src/components/Profile.jsx`
- **Purpose:** Main profile page container
- **What it does:**
  - Displays user info (name, email, phone, bio, skills, resume)
  - Calls `useGetAppliedJobs()` hook to fetch applied jobs
  - Renders `AppliedJobTable` component

#### **2. AppliedJobTable.jsx**
- **File:** `frontend/src/components/AppliedJobTable.jsx`
- **Purpose:** Display applied jobs in a formatted table
- **Features:**
  - Shows all student's applications
  - Color-coded status badges
  - Status icons (CheckCircle, Clock, XCircle)
  - Empty state message if no applications
  - Sorts by most recent application first

#### **3. useGetAppliedJobs Hook**
- **File:** `frontend/src/hooks/useGetAppliedJobs.jsx`
- **Purpose:** Fetch applied jobs from backend
- **What it does:**
  - Calls `GET /api/v1/application/get` endpoint
  - Gets all applications for logged-in student
  - Dispatches data to Redux store: `setAllAppliedJobs()`
  - Auto-runs when Profile component mounts

### **Backend - Data Flow:**

#### **API Endpoint: GET /api/v1/application/get**
- **File:** `backend/routes/application.route.js`
- **Controller:** `backend/controllers/application.controller.js` → `getAppliedJobs()`
- **Authentication:** ✅ Required (student only)
- **Returns:** Array of applications with populated job and company details

#### **Response Example:**
```json
{
  "success": true,
  "application": [
    {
      "_id": "app123",
      "job": {
        "_id": "job456",
        "title": "Senior React Developer",
        "company": {
          "_id": "comp789",
          "name": "TechCorp Solutions"
        }
      },
      "status": "pending",
      "createdAt": "2025-02-24T10:30:00Z"
    },
    {
      "_id": "app124",
      "job": {
        "_id": "job457",
        "title": "Node.js Backend Developer",
        "company": {
          "_id": "comp790",
          "name": "WebDev Inc"
        }
      },
      "status": "accepted",
      "createdAt": "2025-02-23T14:20:00Z"
    }
  ]
}
```

### **Data Flow Diagram:**

```
Student Clicks "Profile"
        ↓
Profile.jsx mounts
        ↓
useGetAppliedJobs() hook runs
        ↓
GET /api/v1/application/get (with token in cookie)
        ↓
Backend finds Application documents by applicant userId
        ↓
Populate job + company details
        ↓
Return sorted by createdAt (newest first)
        ↓
Redux dispatch setAllAppliedJobs(data)
        ↓
AppliedJobTable reads from Redux store
        ↓
Render table with status icons & colors
        ↓
Student sees all applications with current status ✅
```

### **Redux Store Structure:**

```javascript
// From frontend/src/redux/jobSlice.js
store.job.allAppliedJobs = [
  {
    _id: "application_id",
    job: { _id, title, company: { name } },
    status: "pending|accepted|rejected",
    createdAt: "timestamp"
  },
  // ... more applications
]
```

### **How Status Updates Work:**

```
1. Application Created (status: "pending")
   └─ Student applies → applyJob() → status set to "pending"

2. Recruiter Reviews (in /admin/jobs/:id/applicants)
   └─ Recruiter clicks "Accept" or "Reject"
   └─ PUT /api/v1/application/update event
   └─ Status changed to "accepted" or "rejected"

3. Student Sees Update (in /profile)
   └─ Student profile reloads or refreshes
   └─ useGetAppliedJobs() fetches latest data
   └─ Table shows updated status with new color/icon
```

### **Empty State Handling:**

When a student hasn't applied for any jobs:

```
┌─────────────────────────────────┐
│                                 │
│    📭  (Icon)                   │
│  You haven't applied for        │
│     any job yet.                │
│  Browse jobs and apply to       │
│    get started!                 │
│                                 │
└─────────────────────────────────┘
```

**UI Components:**
- Alert icon (`AlertCircle`) - Visual indicator
- Helpful message - Guides student to browse jobs
- Collapses into single row in table

### **Complete Test Scenario:**

#### **Step 1: Create Application**
```
1. Login as student
2. Go to /jobs
3. Click on "Senior React Developer" job
4. Click "Apply Now" button
```

#### **Step 2: Check Profile**
```
1. Click "Profile" in navbar
2. Scroll to "Applied Jobs" section
3. See table with ONE entry:
   - Date: "2025-02-24"
   - Job Role: "Senior React Developer"
   - Company: "TechCorp Solutions"
   - Status: ⏳ PENDING (Yellow badge)
```

#### **Step 3: Recruiter Updates Status**
```
1. Logout, login as recruiter
2. Go to /admin/jobs
3. Click "Applicants" on the job
4. Find your test student
5. Change status from "Pending" to "Accepted"
```

#### **Step 4: Student Sees Update**
```
1. Logout, login as student again
2. Go to /profile
3. Scroll to "Applied Jobs"
4. Same job now shows:
   - Status: ✅ ACCEPTED (Green badge)
5. Can click to view job details
```

### **Mobile View Considerations:**

The Applied Jobs table is responsive:
- **Desktop:** All columns visible side-by-side
- **Tablet:** May stack or truncate long company names
- **Mobile:** Consider scrolling or collapsing columns

### **Troubleshooting Applied Jobs:**

**Issue: "Applied Jobs" table is empty but I know I applied**
- Cause: `useGetAppliedJobs()` hook not called or data not loaded
- Solution: Refresh page (F5) to re-fetch data

**Issue: Status not updating after recruiter accepts**
- Cause: Frontend cache or Redux state not refreshed
- Solution: Navigate away and back to Profile, or refresh page

**Issue: Old applications showing as "pending" indefinitely**
- Cause: Backend status update failed silently
- Solution: Check Network tab in DevTools for errors on status update endpoint

**Issue: Cannot see resume link in application**
- Cause: Student didn't upload resume or link expired
- Solution: Student should update profile and upload resume

### **To modify applied jobs display:**
1. Edit `frontend/src/components/AppliedJobTable.jsx` - Change table layout
2. Edit `frontend/src/components/Profile.jsx` - Change profile structure
3. Edit `frontend/src/hooks/useGetAppliedJobs.jsx` - Change API call or frequency

**To modify backend response:**
1. Edit `backend/controllers/application.controller.js` → `getAppliedJobs()` - Change data structure
2. Edit `backend/routes/application.route.js` - Change endpoint or auth

**To add new status:**
1. Edit `backend/models/application.model.js` - Add to enum: `['pending', 'accepted', 'rejected', 'newStatus']`
2. Edit `frontend/src/components/AppliedJobTable.jsx` - Add case in `getStatusColor()` and `getStatusIcon()`

---

## 👨‍💼 User Profile Display - Photo & Information

### **Profile Photo Display:**

The student profile now properly displays the user's profile photo uploaded during registration or updated in the profile settings.

#### **Profile Photo Location:**
- **Shown in:** Profile page (`/profile`)
- **Size:** 96x96px (h-24 w-24 in Tailwind)
- **Fallback:** If no photo uploaded, shows user's first initial in a badge
- **Where it comes from:** `user?.profile?.profilePhoto` from Redux store

#### **How Profile Photo Works:**

**1. Upload During Registration:**
```
User Registration (/signup) 
    ↓ 
Upload Profile Photo (optional)
    ↓ 
Multer middleware processes image
    ↓ 
Upload to Cloudinary
    ↓ 
Save URL in MongoDB: user.profile.profilePhoto = "cloudinary_url"
```

**2. Display on Profile Page:**
```
Student goes to /profile
    ↓ 
Profile.jsx loads
    ↓ 
Redux provides user data from store
    ↓ 
Avatar component renders:
    - Primary: AvatarImage src={user?.profile?.profilePhoto}
    - Fallback: AvatarFallback shows first letter
    ↓ 
Display 96x96px rounded avatar
```

**3. Update Photo in Profile Settings:**
```
Click "Edit Profile" button
    ↓ 
UpdateProfileDialog opens
    ↓ 
Upload new photo
    ↓ 
POST /api/v1/user/profile/update with file
    ↓ 
Cloudinary uploads new photo
    ↓ 
MongoDB: user.profile.profilePhoto = "new_cloudinary_url"
    ↓ 
Redux state updates with new photo URL
    ↓ 
Avatar displays updated photo
```

#### **Profile Photo Code References:**

**Frontend Display (Profile.jsx):**
```jsx
<Avatar className="h-24 w-24">
  <AvatarImage 
    src={user?.profile?.profilePhoto} 
    alt={user?.fullname} 
  />
  <AvatarFallback className="text-xl font-bold">
    {user?.fullname?.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>
```

**Backend Storage (user.model.js):**
```javascript
profile: {
  profilePhoto: {
    type: String,
    default: ""
  }
}
```

### **Complete Profile Information Displayed:**

When student opens `/profile`, they see:

| Information | Source | Editable |
|-------------|--------|----------|
| **Profile Photo** | `user.profile.profilePhoto` | Yes (Edit Profile) |
| **Full Name** | `user.fullname` | Yes (Edit Profile) |
| **Bio** | `user.profile.bio` | Yes (Edit Profile) |
| **Email** | `user.email` | Yes (Edit Profile) |
| **Phone** | `user.phoneNumber` | Yes (Edit Profile) |
| **Skills** | `user.profile.skills[]` | Yes (Edit Profile) |
| **Resume** | `user.profile.resume` | Yes (Edit Profile) |
| **Applied Jobs** | From Application collection | No (view only) |

### **Profile Photo - Debug Checklist:**

**If profile photo not showing:**

1. **Check if photo was uploaded:**
   - Open Browser DevTools → Application tab
   - Check Redux store: `store.auth.user.profile.profilePhoto`
   - Should contain Cloudinary URL (starts with `https://res.cloudinary.com/`)

2. **Check Cloudinary configuration:**
   - Verify `.env` has correct Cloudinary credentials
   - Test upload by creating a new user

3. **Check display code:**
   - Open Profile.jsx
   - Verify AvatarImage src is `{user?.profile?.profilePhoto}`
   - Not hardcoded to different URL

4. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Clear localStorage if needed

5. **Fallback appears when:**
   - No profile photo uploaded (`profilePhoto = ""`)
   - Image URL is broken/expired
   - Shows first letter of user's name

### **Edit Profile - Update Photo:**

**Location:** `/profile` → Click "✏️ Edit" button → UpdateProfileDialog pops up

**Steps to update photo:**
1. Click "Edit Profile" button (✏️ icon top right)
2. Dialog opens with current user info
3. Upload new profile photo
4. Fill other fields (bio, skills, resume)
5. Click "Update" button
6. Success message appears
7. Profile page refreshes with new photo

**Backend Endpoint:**
- `POST /api/v1/user/profile/update`
- File uploaded as `profilePhoto` in multipart form
- Cloudinary processes and returns URL
- Stored in MongoDB as `user.profile.profilePhoto`

### **Where Profile Photo Also Appears:**

1. **Navbar Avatar** - Top right, shows photo in dropdown menu
2. **Applicants Table** - Recruiters see student's photo when reviewing applications
3. **Job Applicants View** - Recruiter sees all student photos in applicants list

---

## 🔧 Company Setup - Multer File Upload Fix

### **The Error (Fixed)**

**Error Message:**
```
express/lib/router/layer.js:95:5
express/lib/router/route.js:149:13
multer/lib/make-middleware.js:47:7
```

### **What Was Wrong:**

The company setup feature had **4 critical issues** with file uploads and error handling:

#### **Issue 1: No Error Handling for Missing Files**
```javascript
// ❌ BEFORE - Crashes when no file uploaded
const file = req.file;
const fileUri = getDataUri(file);  // file is undefined!
const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
```
- When user submits form without a logo file, `req.file` is `undefined`
- `getDataUri(undefined)` throws error
- Multer middleware fails with no error response
- Express router crashes

#### **Issue 2: No Error Response in Catch Blocks**
```javascript
// ❌ BEFORE - Catch blocks didn't send responses
} catch (error) {
    console.log(error);
    // No response sent - client hangs!
}
```
- When errors occurred, neither the middleware nor Express knew what to do
- Multer middleware error chain broke

#### **Issue 3: Missing Multer Error Handler**
```javascript
// ❌ BEFORE - No error handler for Multer specific errors
export const singleUpload = multer({storage}).single("file");
// If file upload fails, no error response sent
```

#### **Issue 4: getCompany Route Inconsistency**
```javascript
// ❌ BEFORE - Route was public but controller needed req.id
router.route("/get").get(getCompany);  // No authentication

// In controller
const userId = req.id;  // req.id undefined for public route!
```

### **The Fixes Applied:**

#### **Fix 1: Conditional File Handling**
```javascript
// ✅ AFTER - Check if file exists before processing
if (file) {
    try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        updateData.logo = cloudResponse.secure_url;
    } catch (uploadError) {
        return res.status(400).json({
            message: "Error uploading logo. Please try again.",
            success: false
        });
    }
}
// If no file provided, just update other fields
```

#### **Fix 2: Error Responses in All Catch Blocks**
```javascript
// ✅ AFTER - Every catch block returns error response
} catch (error) {
    console.log(error);
    return res.status(500).json({
        message: "Failed to update company information.",
        success: false
    });
}
```

#### **Fix 3: Multer Error Handler Middleware**
```javascript
// ✅ AFTER - Added dedicated error handler
export const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                message: "File size too large. Max 5MB allowed.",
                success: false
            });
        }
    }
    if (err) {
        return res.status(400).json({
            message: "File upload error: " + err.message,
            success: false
        });
    }
    next();
};
```

#### **Fix 4: Add Authentication to getCompany**
```javascript
// ✅ BEFORE - Route was public, no access to req.id
router.route("/get").get(getCompany);

// ✅ AFTER - Route requires authentication
router.route("/get").get(isAuthenticated, getCompany);

// ✅ Company by id remains public (anyone can view company details)
router.route("/get/:id").get(getCompanyById);
```

#### **Fix 5: Use Error Handler Middleware in Routes**
```javascript
// ✅ AFTER - Added handleMulterError after file upload middleware
router.route("/update/:id").put(
    isAuthenticated, 
    singleUpload,           // Upload file
    handleMulterError,      // Handle any file errors
    updateCompany           // Controller function
);
```

### **How Company Setup Works Now:**

#### **Step 1: Recruiter Navigates to Company Setup**
```
/admin/companies → Click company → /admin/company/:id
```

#### **Step 2: Form Submission (CompanySetup.jsx)**
```javascript
const formData = new FormData();
formData.append("name", input.name);
formData.append("description", input.description);
formData.append("website", input.website);
formData.append("location", input.location);

// Optional: only add if user selected a file
if (input.file) {
    formData.append("file", input.file);  // Field name MUST be "file"
}

// Send PUT request with file
axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
});
```

#### **Step 3: Backend Processing**
```
Request arrives at /api/v1/company/update/:id (PUT)
    ↓
isAuthenticated middleware → Verifies JWT token, sets req.id
    ↓
singleUpload middleware → Extracts file from "file" field
    ↓
handleMulterError middleware → Catches any file upload errors
    ↓
updateCompany controller:
    - Gets data from req.body (name, description, etc.)
    - Gets file from req.file (if provided)
    - IF file exists → Upload to Cloudinary
    - Update company in MongoDB
    - Send success response
    ↓
Response sent back to frontend
```

#### **Step 4: Frontend Handles Response**
```javascript
if (res.data.success) {
    toast.success("Company updated!");
    navigate("/admin/companies");  // Redirect back
} else {
    toast.error(res.data.message);  // Show error
}
```

### **File Upload Field Requirements:**

**IMPORTANT: Field name MUST be "file"**
```javascript
// ✅ CORRECT
formData.append("file", fileObject);  // Multer looks for "file"

// ❌ WRONG (causes Multer errors)
formData.append("logo", fileObject);  // Multer looks for "file"
formData.append("image", fileObject); // Multer looks for "file"
```

**Why?** Because Multer middleware is configured as:
```javascript
multer({storage}).single("file")  // Expects field named "file"
```

### **Company Setup - Error Scenarios:**

| Scenario | Before Fix | After Fix |
|----------|-----------|-----------|
| No file uploaded | Crash | Works - updates text fields only |
| File too large | Multer error, no response | Returns 400 with message |
| Cloudinary upload fails | Generic error, no message | Returns 400 "Error uploading logo" |
| Database update fails | Hangs | Returns 500 with message |
| Invalid company ID | Hangs | Returns 404 "Company not found" |
| Missing authentication | Works (bug) | Returns 401 "Unauthorized" |

### **Testing Company Setup Fix:**

#### **Test 1: Update Without File**
1. Go to `/admin/company/:id`
2. Change name/description/website/location
3. Leave file input empty
4. Click Update
5. ✅ Should update successfully without error

#### **Test 2: Update With File**
1. Go to `/admin/company/:id`
2. Change name
3. Select a PNG/JPG file (< 5MB)
4. Click Update
5. ✅ Should upload to Cloudinary and update

#### **Test 3: Large File**
1. Go to `/admin/company/:id`
2. Select a file larger than Multer limit
3. Click Update
4. ✅ Should show "File size too large" error

#### **Test 4: Check Network Tab**
1. Open Browser DevTools → Network tab
2. Go to `/admin/company/:id`
3. Update a field and submit
4. Look for PUT request to `/api/v1/company/update/:id`
5. Check response has `success: true` and `company` object
6. ✅ All requests should complete with responses

#### **Test 5: Check Recruited Company Get**
1. Login as recruiter
2. Open Network tab
3. Go to `/admin/companies`
4. Look for GET request to `/api/v1/company/get`
5. ✅ Should return companies where userId matches recruiter

### **Company Setup - Debug Checklist:**

**If company setup page shows error:**
1. ✅ Check Network tab - is PUT request being sent?
2. ✅ Verify response has status code (200/400/500)
3. ✅ Check if error message appears in response
4. ✅ Check backend console for error logs

**If file upload fails:**
1. ✅ Verify file field name is "file" in FormData
2. ✅ Check Content-Type header is "multipart/form-data"
3. ✅ Verify file size < Multer limit
4. ✅ Check Cloudinary credentials in .env

**If company not updating:**
1. ✅ Verify PUT request includes isAuthenticated (sends token)
2. ✅ Check token is valid (logged in as recruiter)
3. ✅ Verify company ID in URL is correct
4. ✅ Check database has that company ID

---

## 🎨 Navbar - Profile & Applied Jobs Section

The navbar displays a comprehensive profile popover when students click their avatar, showing profile info and applied jobs count.

### **Navbar Profile Popover - What It Shows:**

When a logged-in user clicks their avatar in the top-right corner, a popover menu appears with:

#### **For Students:**
```
┌─────────────────────────────────┐
│ 👤 Avatar                       │
│ Full Name                       │
│ Bio Subtitle                    │
│ email@example.com               │
├─────────────────────────────────┤
│ 👤 View Profile                 │
│ 💼 Applied Jobs          [3]    │ ← Shows count
├─────────────────────────────────┤
│ 🚪 Logout                       │
└─────────────────────────────────┘
```

#### **For Recruiters:**
```
┌─────────────────────────────────┐
│ 👤 Avatar                       │
│ Full Name                       │
│ Bio Subtitle                    │
│ email@example.com               │
├─────────────────────────────────┤
│ 🚪 Logout                       │
└─────────────────────────────────┘
```
(Recruiters don't see applied jobs section)

### **Components in the Popover:**

#### **1. User Avatar & Profile Card**
- **Avatar:** 64x64px with user's profile photo
- **Fallback:** First letter of user's name in purple background
- **Name:** User's full name (bold)
- **Bio:** User's bio/subtitle (smaller text)
- **Email:** User's email address (grey text)

#### **2. Applied Jobs Counter (Students Only)**
- **Icon:** 💼 Briefcase icon
- **Text:** "Applied Jobs"
- **Badge:** Shows count of applications (e.g., "3")
- **Color:** Purple background (#6A38C2)
- **Clickable:** Navigates to `/profile` to see full applied jobs table

#### **3. Logout Button**
- **Icon:** 🚪 Logout icon
- **Color:** Red text with hover effect
- **Action:** Clears user session and redirects to home
- **Full Width:** Spans entire popover for easy clicking

### **Navbar Profile Feature - Code Structure:**

**Frontend Files:**
```
frontend/src/components/shared/Navbar.jsx
├── Imports useGetAppliedJobs hook
├── Imports AvatarFallback component
├── Imports Badge component
├── Imports Briefcase icon
└── Displays student-specific options (View Profile, Applied Jobs)
```

**Data Sources:**
```javascript
// From Redux store
user = {
  fullname,
  email,
  profile: { bio, profilePhoto }
}

allAppliedJobs = [
  { _id, job: { title, company }, status, createdAt },
  // ... more applications
]
```

### **Applied Jobs Count Badge - How It Works:**

#### **Display Logic:**
```jsx
{allAppliedJobs?.length > 0 && (
  <Badge className="bg-[#6A38C2]">
    {allAppliedJobs.length}
  </Badge>
)}
```

#### **When Badge Shows:**
- ✅ Student has applied for at least 1 job → Shows count
- ❌ Student has no applications → Badge hidden

#### **User Journey:**
1. Student applies for job → Application count increases
2. Student clicks avatar → Sees updated count badge
3. Student clicks "Applied Jobs" → Redirects to profile with full details
4. Student sees all applications with statuses (pending/accepted/rejected)

### **Profile Avatar in Navbar - Features:**

**Smaller Size on Navbar:**
- 40x40px (h-10 w-10) to fit in navbar
- Shows user's uploaded profile photo
- Falls back to first letter if no photo

**Larger Size in Popover:**
- 64x64px when popover opens
- Better visibility for profile info
- Professional appearance

**Avatar Fallback:**
- If user hasn't uploaded photo: Shows first letter
- Background: Purple (#6A38C2)
- Text: White, bold
- Example: "J" for John

### **Navigation from Navbar Profile:**

**Clicking "View Profile":**
- Navigates to `/profile`
- Shows full profile page with all details
- Shows applied jobs table below profile info

**Clicking "Applied Jobs" Badge:**
- Navigates to `/profile`
- Same as "View Profile" - shows full profile & applied jobs table
- Badge serves as quick navigation

**Clicking Logout:**
- Calls `GET /api/v1/user/logout`
- Clears Redux auth state
- Clears token from cookies
- Redirects to home page

### **Responsive Behavior:**

| Device | Navbar | Avatar | Menu |
|--------|--------|--------|------|
| Desktop | Full display | 40x40px | Full popover |
| Tablet | Links may compress | 40x40px | Adjusted width |
| Mobile | Side menu | 40x40px | Adjusted width |

### **Navbar Profile - Debug Checklist:**

**If avatar not showing profile photo:**
1. Check Redux: `store.auth.user.profile.profilePhoto`
2. Verify Cloudinary URL is valid
3. Clear browser cache (hard refresh)

**If applied jobs count not showing:**
1. Verify student role: `user.role === 'student'`
2. Check why `useGetAppliedJobs` hook not running
3. Verify Redux: `store.job.allAppliedJobs` has data
4. Check Network tab for API errors

**If popover not opening:**
1. Verify Popover component imported from `ui/popover`
2. Check browser console for JavaScript errors
3. Verify `PopoverTrigger` and `PopoverContent` are children

**If logout button not working:**
1. Check Network tab for logout API call
2. Verify token in cookies before logging out
3. Check Redux dispatch of `setUser(null)`

### **Testing Navbar Profile Feature:**

#### **Test 1: View Profile Card**
1. Login as student
2. Click avatar (top-right)
3. Popover appears with profile info ✅
4. See name, bio, email
5. See avatar/fallback correctly

#### **Test 2: Applied Jobs Count**
1. Student hasn't applied yet → No badge shown
2. Student applies for 1 job → Badge shows "1"
3. Student applies for 2 more jobs → Badge shows "3"
4. Count updates in real-time or after page refresh

#### **Test 3: Navigation**
1. Click "View Profile" → Goes to `/profile` page
2. Click "Applied Jobs" → Goes to `/profile` page
3. Both show the same profile + applied jobs table

#### **Test 4: Logout**
1. Click "Logout" button
2. Success toast message
3. Redirected to home page
4. User data cleared from Redux
5. Navbar shows Login/Signup buttons (user logged out)

#### **Test 5: Mobile Responsive**
1. Shrink browser to mobile width
2. Navbar adapts to smaller screen
3. Avatar still clickable
4. Popover still displays full content
5. All buttons still work




