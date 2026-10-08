# Frontend - Job Portal React App

Complete documentation for React/Vite frontend with Redux state management.

---

## 📋 Frontend Structure

```
frontend/src/
├── assets/                          # Images, icons, static files
│
├── components/
│   ├── Home.jsx                     # Landing page
│   ├── Jobs.jsx                     # Jobs search & filter page
│   ├── Browse.jsx                   # Browse all jobs
│   ├── Job.jsx                      # Redirect component
│   ├── JobDescription.jsx           # Single job details
│   ├── Profile.jsx                  # Student profile & applied jobs
│   ├── LatestJobs.jsx               # Show latest 6 jobs on home
│   ├── LatestJobCards.jsx           # Reusable job card
│   ├── AppliedJobTable.jsx          # Table of student's applications
│   ├── CategoryCarousel.jsx         # Job category carousel
│   ├── HeroSection.jsx              # Home page hero
│   ├── FilterCard.jsx               # Job filters sidebar
│   │
│   ├── admin/                       # Recruiter/Admin features
│   │   ├── AdminJobs.jsx            # List of recruiter's posted jobs
│   │   ├── AdminJobsTable.jsx       # Table format jobs
│   │   ├── Applicants.jsx           # List of applicants per job
│   │   ├── ApplicantsTable.jsx      # Table of applicants
│   │   ├── Companies.jsx            # Recruiter's companies
│   │   ├── CompaniesTable.jsx       # Companies in table format
│   │   ├── CompanyCreate.jsx        # Create new company
│   │   ├── CompanySetup.jsx         # Edit company details (with logo upload)
│   │   ├── PostJob.jsx              # Create new job posting
│   │   └── ProtectedRoute.jsx       # Route protection for recruiters
│   │
│   ├── auth/
│   │   ├── Login.jsx                # User login form
│   │   └── Signup.jsx               # User registration form
│   │
│   └── shared/
│       ├── Navbar.jsx               # Top navigation with profile dropdown
│       └── Footer.jsx               # Footer component
│
├── hooks/                           # Custom React hooks
│   ├── useGetAllJobs.jsx            # Fetch all jobs with search
│   ├── useGetAllCompanies.jsx       # Fetch all companies
│   ├── useGetAllAdminJobs.jsx       # Fetch recruiter's own jobs
│   ├── useGetAppliedJobs.jsx        # Fetch student's applications
│   └── useGetCompanyById.jsx        # Fetch single company details
│
├── redux/                           # Redux state management
│   ├── store.js                     # Redux store setup with persist
│   ├── authSlice.js                 # User authentication state
│   ├── jobSlice.js                  # Jobs state
│   ├── companySlice.js              # Companies state
│   └── applicationSlice.js          # Applications state
│
├── utils/
│   ├── constant.js                  # API endpoints & constants
│   └── utils.js                     # Helper functions
│
├── lib/
│   └── utils.js                     # Utility function (cn for class names)
│
├── ui/                              # Radix UI components
│   ├── avatar.jsx                   # User avatar component
│   ├── badge.jsx                    # Badge display
│   ├── button.jsx                   # Button component
│   ├── dialog.jsx                   # Modal dialog
│   ├── input.jsx                    # Form input
│   ├── label.jsx                    # Form label
│   ├── popover.jsx                  # Popover menu
│   ├── carousel.jsx                 # Carousel component
│   ├── radio-group.jsx              # Radio button group
│   ├── select.jsx                   # Dropdown select
│   ├── sonner.jsx                   # Toast notifications
│   └── table.jsx                    # Data table
│
├── App.jsx                          # Main app component with routing
├── main.jsx                         # React DOM render
├── App.css                          # Global CSS
├── index.css                        # Tailwind CSS
├── vite.config.js                   # Vite bundler config
├── tailwind.config.js               # Tailwind CSS config
├── postcss.config.js                # PostCSS config
├── jsconfig.json                    # JS config with @ alias
└── package.json                     # Dependencies
```

---

## 🚀 Frontend Setup

### **1. Install Dependencies**
```bash
cd frontend
npm install
```

### **2. Create .env or .env.local**
```env
VITE_API_URL=http://localhost:3000
```

### **3. Start Development Server**
```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

**Note:** Backend must be running on `http://localhost:3000`

### **4. Build for Production**
```bash
npm run build
```

Creates `dist/` folder ready for deployment.

---

## 🎨 Component Tree & Routing

### **Main Routes**

```
App.jsx
├── / (Home Route)
│   ├── Navbar
│   ├── HeroSection
│   ├── LatestJobs
│   └── Footer
│
├── /browse (Browse Jobs)
│   ├── Navbar
│   ├── Jobs (with FilterCard sidebar)
│   └── Footer
│
├── /description/:id (Job Details)
│   ├── Navbar
│   ├── JobDescription
│   └── Footer
│
├── /profile (Student Profile)
│   ├── Navbar
│   ├── Profile
│   ├── AppliedJobTable
│   └── Footer
│
├── /login (Login)
│   └── Login
│
├── /signup (Signup)
│   └── Signup
│
└── /admin/* (Protected Routes - Recruiter Only)
    ├── ProtectedRoute (checks if recruiter)
    │   ├── /admin/dashboard (AdminJobs)
    │   ├── /admin/jobs (AdminJobs)
    │   │   └── Can post new job (PostJob)
    │   ├── /admin/applicants (Applicants)
    │   ├── /admin/companies (Companies)
    │   │   ├── Can create company (CompanyCreate)
    │   │   └── Can edit company (CompanySetup)
    │   └── /admin/job/:id (Edit job? - not yet implemented)
```

---

## 🗂️ Redux State Structure

### **Redux Store**
```
store/
├── auth.user
│   ├── _id
│   ├── fullname
│   ├── email
│   ├── role ('student' | 'recruiter')
│   └── profile
│       ├── bio
│       ├── skills
│       ├── resume
│       └── profilePhoto
│
├── jobs
│   ├── allJobs: [...]
│   ├── singleJob: {...}
│   ├── adminJobs: [...]  // Jobs posted by current recruiter
│   ├── searchedQuery: ""
│   └── allAppliedJobs: [...]  // For students only
│
├── company
│   ├── allCompanies: [...]
│   ├── singleCompany: {...}
│   └── searchCompanyByText: ""
│
└── application
    ├── applications: [...]
```

### **Redux Slices**

#### **authSlice** - User Authentication
```javascript
// Actions
setUser(user)             // Set logged-in user
setLoading(boolean)       // Show/hide loading spinner
setAllAppliedJobs(jobs)   // Set applications for student

// Usage in component
const { user, loading } = useSelector(store => store.auth);
const dispatch = useDispatch();
dispatch(setUser(newUser));
```

#### **jobSlice** - Job Management
```javascript
// Actions
setAllJobs(jobs)          // Set all available jobs
setSingleJob(job)         // Set selected job for viewing
setSearchedQuery(query)    // Set search filter
setAdminJobs(jobs)        // Set recruiter's own jobs
setAllAppliedJobs(jobs)   // Set student's applications

// Usage in component
const { allJobs, singleJob, searchedQuery } = useSelector(store => store.job);
```

#### **companySlice** - Company Management
```javascript
// Actions
setAllCompanies(companies)        // Set all companies
setSingleCompany(company)         // Set single company
setSearchCompanyByText(text)      // Search filter

// Usage in component
const { allCompanies, singleCompany } = useSelector(store => store.company);
```

#### **applicationSlice** - Job Applications
```javascript
// Actions
setApplications(apps)     // Set all applications

// Usage in component
const { applications } = useSelector(store => store.application);
```

---

## 🎣 Custom Hooks

### **useGetAllJobs**

**Purpose:** Fetch all jobs with search filtering

**File:** [frontend/src/hooks/useGetAllJobs.jsx](frontend/src/hooks/useGetAllJobs.jsx)

```javascript
// Usage
const { allJobs, searchedQuery } = useSelector(store => store.job);
useGetAllJobs();  // Fetches all jobs from server

// Hook automatically calls:
// GET /api/v1/job/get?keyword=<searchedQuery>
// Dispatches setAllJobs(jobs) to Redux
```

**Dependency:** `[searchedQuery]` - Refetches when search query changes

### **useGetAllCompanies**

**Purpose:** Fetch all companies

```javascript
useGetAllCompanies();

// Calls:
// GET /api/v1/company/get
// (Only for authenticated recruiters)
```

### **useGetAllAdminJobs**

**Purpose:** Fetch recruiter's own posted jobs

```javascript
useGetAllAdminJobs();

// Calls:
// GET /api/v1/job/getadminjobs
// Returns only jobs created by current recruiter
```

### **useGetAppliedJobs**

**Purpose:** Fetch student's job applications

```javascript
const { allAppliedJobs, loading } = useSelector(store => store.job);
const { user } = useSelector(store => store.auth);

useGetAppliedJobs();

// Calls:
// GET /api/v1/application/get
// Returns array of { job, applicant, status, createdAt }
```

**Only runs for students** (checks user.role)

### **useGetCompanyById**

**Purpose:** Fetch single company details

```javascript
const { id } = useParams();
useGetCompanyById(id);

// Calls:
// GET /api/v1/company/get/:id
// Dispatches setSingleCompany(company)
```

---

## 🔐 Authentication Flow

### **Login Process**

```
User enters email & password
            ↓
POST /api/v1/user/login
            ↓
Backend validates credentials
            ↓
JWT token generated & set in httpOnly cookie
            ↓
User object returned to frontend
            ↓
dispatch(setUser(user))  ← Redux store updated
            ↓
Redux persist saves to localStorage
            ↓
useSelector(store => store.auth.user) now has data
            ↓
ProtectedRoute checks user.role
            ↓
Route to appropriate page (home for student, admin for recruiter)
```

### **Page Refresh - Token Persistence**

```
Page refreshes
            ↓
Redux persist restores from localStorage
            ↓
user object loaded into Redux store
            ↓
Components render with user data available
            ↓
API calls include token automatically (via axios interceptor)
            ↓
withCredentials: true sends cookies with each request
```

**Key File:** [frontend/src/redux/store.js](frontend/src/redux/store.js)

```javascript
persistConfig = {
  key: 'root',
  version: 1,
  storage,
  blacklist: ['application']  // Don't persist applications
}

persistor = persistStore(store)
```

---

## 📡 API Integration

### **Axios Setup**

**File:** Auto-configured in each component using axios

```javascript
const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true  // Include cookies in requests
});
```

### **API Endpoint Constants**

**File:** [frontend/src/utils/constant.js](frontend/src/utils/constant.js)

```javascript
export const USER_API_END_POINT = "http://localhost:3000/api/v1/user";
export const JOB_API_END_POINT = "http://localhost:3000/api/v1/job";
export const APPLICATION_API_END_POINT = "http://localhost:3000/api/v1/application";
export const COMPANY_API_END_POINT = "http://localhost:3000/api/v1/company";
```

### **Making API Calls**

#### **Simple GET Request**
```javascript
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';

const response = await axios.get(`${JOB_API_END_POINT}/get`, {
  withCredentials: true
});

const jobs = response.data.jobs;
```

#### **POST with File Upload**
```javascript
const formData = new FormData();
formData.append("name", "Company Name");
formData.append("file", fileObject);  // Must be "file"

const response = await axios.post(
  `${COMPANY_API_END_POINT}/register`,
  formData,
  {
    headers: { 'Content-Type': 'multipart/form-data' },
    withCredentials: true
  }
);
```

#### **Error Handling**
```javascript
try {
  const response = await axios.post(url, data);
  if (response.data.success) {
    toast.success(response.data.message);
  }
} catch (error) {
  console.log(error);
  toast.error(error.response?.data?.message || "Something went wrong");
}
```

---

## 🎯 Key Features Implementation

### **Feature 1: Job Search & Filter**

```
User types in search box
            ↓
dispatch(setSearchedQuery(text))  ← Redux state updated
            ↓
useGetAllJobs hook dependency [searchedQuery] triggers
            ↓
GET /api/v1/job/get?keyword=<text>
            ↓
Results filtered on backend
            ↓
dispatch(setAllJobs(jobs))
            ↓
Jobs grid re-renders with results
```

**Files Involved:**
- [frontend/src/components/Jobs.jsx](frontend/src/components/Jobs.jsx) - Main search page
- [frontend/src/components/FilterCard.jsx](frontend/src/components/FilterCard.jsx) - Sidebar filters
- [frontend/src/hooks/useGetAllJobs.jsx](frontend/src/hooks/useGetAllJobs.jsx) - Fetch hook

### **Feature 2: Job Application**

```
Student clicks "Apply Now"
            ↓
POST /api/v1/application/apply/:jobId
            ↓
Server checks if already applied
            ↓
If not applied: Creates application with status "pending"
            ↓
If already applied: Returns error "You already applied"
            ↓
Frontend shows toast message
            ↓
useGetAppliedJobs() refetches to show updated count
            ↓
Navbar badge updates with new count
```

**Files Involved:**
- [frontend/src/components/JobDescription.jsx](frontend/src/components/JobDescription.jsx#L45) - Apply button
- [backend/controllers/application.controller.js](../backend/controllers/application.controller.js#L12) - Duplicate prevention

**Duplicate Prevention Logic:**
```javascript
// In backend controller
const existingApplication = await Application.findOne({
  job: jobId,
  applicant: userId
});

if (existingApplication) {
  return res.status(400).json({
    message: "You already applied for this job",
    success: false
  });
}
```

### **Feature 3: Applied Jobs Display**

```
Student goes to /profile
            ↓
useGetAppliedJobs() hook runs
            ↓
GET /api/v1/application/get
            ↓
Server returns all applications for student:
[
  {
    _id, 
    job: { title, company: { logo, name } },
    status: "pending" | "accepted" | "rejected",
    createdAt
  }
]
            ↓
AppliedJobTable component renders table with:
  - Job title & company
  - Status with icon (pending/accepted/rejected)
  - Application date
```

**Files Involved:**
- [frontend/src/components/Profile.jsx](frontend/src/components/Profile.jsx) - Profile page
- [frontend/src/components/AppliedJobTable.jsx](frontend/src/components/AppliedJobTable.jsx) - Table display
- [frontend/src/hooks/useGetAppliedJobs.jsx](frontend/src/hooks/useGetAppliedJobs.jsx) - Fetch hook

**Status Icons:**
- ✅ Accepted: Green checkmark circle
- ⏳ Pending: Clock (waiting)
- ❌ Rejected: Red X circle

### **Feature 4: Navbar Profile Section**

```
User logs in
            ↓
Redux store has user.profile.profilePhoto (Cloudinary URL)
            ↓
Navbar renders 40x40px avatar with user photo
            ↓
On click, popover opens showing:
  - 64x64px avatar
  - User fullname & bio
  - User email
  - "View Profile" link → /profile
  - "Applied Jobs" link with badge → /profile
  - "Logout" button
            ↓
Click logout:
  - POST /api/v1/user/logout
  - Redux cleared (setUser(null))
  - Redirected to home
```

**Files Involved:**
- [frontend/src/components/shared/Navbar.jsx](frontend/src/components/shared/Navbar.jsx) - Navbar component
- UI components: Popover, Avatar, Badge from Radix UI

---

## 🎨 UI Components Used

### **Radix UI Components**

| Component | Location | Usage |
|-----------|----------|-------|
| Avatar | `ui/avatar.jsx` | User profile photos |
| Badge | `ui/badge.jsx` | Applied jobs count, status badges |
| Button | `ui/button.jsx` | All clickable buttons |
| Dialog | `ui/dialog.jsx` | Modals & popups |
| Input | `ui/input.jsx` | Form text inputs |
| Label | `ui/label.jsx` | Form labels |
| Popover | `ui/popover.jsx` | Navbar profile dropdown |
| Radio Group | `ui/radio-group.jsx` | Radio button selections |
| Select | `ui/select.jsx` | Dropdown selections |
| Carousel | `ui/carousel.jsx` | Job category carousel |
| Table | `ui/table.jsx` | Admin jobs & applicants table |
| Sonner | `ui/sonner.jsx` | Toast notifications |

### **Icons Used**

From `lucide-react` package:

```javascript
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  LogOut,
  Plus
} from 'lucide-react';
```

---

## 🔧 Styling

### **Tailwind CSS**

**Main CSS Files:**
- [frontend/src/index.css](frontend/src/index.css) - Tailwind imports
- [frontend/src/App.css](frontend/src/App.css) - Global styles
- [frontend/tailwind.config.js](frontend/tailwind.config.js) - Tailwind config

### **Common Classes Used**

```css
/* Layout */
container mx-auto px-4          /* Max width container with padding */
flex gap-4                       /* Flexbox with 1rem gap */
grid grid-cols-1 md:grid-cols-2  /* Responsive grid */

/* Colors */
bg-purple-600                    /* Purple background (primary color) */
text-gray-700                    /* Gray text */
border border-gray-300           /* Borders */

/* Spacing */
p-4                              /* Padding all sides */
my-8                             /* Margin top/bottom */
mb-4                             /* Margin bottom */

/* Hover Effects */
hover:bg-purple-700              /* Hover background change */
hover:text-purple-600            /* Hover text change */
transition-colors duration-200   /* Smooth color transition */
```

---

## 🧪 Testing Frontend Components

### **Test 1: User Registration**

1. Go to `http://localhost:5173/signup`
2. Fill form:
   - Name: "Test User"
   - Email: "test@email.com"
   - Password: "password123"
   - Role: "student"
3. Click "Signup"
4. ✅ Should redirect to `/` with success message

### **Test 2: Job Search**

1. Go to `http://localhost:5173/browse`
2. Type "React" in search box
3. Click filter or press Enter
4. ✅ Jobs should filter showing only React jobs

### **Test 3: Apply for Job**

1. Login as student
2. Go to `/browse`
3. Click "View Details" on a job
4. Click "Apply Now"
5. ✅ Should show "Applied successfully"
6. Go to `/profile`
7. ✅ Job should appear in "Applied Jobs" table

### **Test 4: Navbar Profile**

1. Login as student
2. Look for avatar in top-right
3. Click avatar → Popover opens
4. ✅ See user info, applied jobs badge, View Profile link
5. Click "Applied Jobs" badge
6. ✅ Should navigate to `/profile`

### **Test 5: Company Setup with Logo**

1. Login as recruiter
2. Go to `/admin/companies`
3. Click edit company
4. Change company name
5. Select a logo image (< 5MB)
6. Click "Update"
7. ✅ Should update with success message
8. ✅ Logo should appear on company page

---

## 🐛 Common Frontend Issues & Solutions

### **Issue 1: "Cannot read property 'user' of undefined"**
**Cause:** Redux store not initialized or app not wrapped in Provider

**Solution:**
```javascript
// In main.jsx
import { Provider } from 'react-redux';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
```

### **Issue 2: API calls returning 401 "Unauthorized"**
**Cause:** Token not being sent with request

**Solution:**
```javascript
// Ensure withCredentials is true
axios.get(url, {
  withCredentials: true  // ← This is critical!
});
```

### **Issue 3: Component not re-rendering after Redux state change**
**Cause:** Not using useSelector to subscribe to Redux updates

**Solution:**
```javascript
// ❌ WRONG - Direct Redux access doesn't trigger re-render
const user = store.getState().auth.user;

// ✅ CORRECT - useSelector triggers re-render on state change
const user = useSelector(store => store.auth.user);
```

### **Issue 4: Jobs not appearing on /browse page**
**Cause:** useGetAllJobs hook not called or API failing

**Solution:**
```javascript
// Component must call hook
useGetAllJobs();

// Check Network tab:
// 1. Is GET /api/v1/job/get being called?
// 2. Is response status 200?
// 3. Does response have jobs array?
```

### **Issue 5: Applied jobs count not updating in navbar**
**Cause:** useGetAppliedJobs hook not being called in navbar

**Solution:**
```javascript
// In Navbar.jsx
const { user } = useSelector(store => store.auth);
const { allAppliedJobs } = useSelector(store => store.job);

// Call hook conditionally for students
if (user?.role === 'student') {
  useGetAppliedJobs();
}

// Display count
{allAppliedJobs?.length > 0 && (
  <Badge>{allAppliedJobs.length}</Badge>
)}
```

---

## 📊 File Upload Handling

### **Profile Photo Upload** (During Signup or Profile Update)

```javascript
const changeFileHandler = (e) => {
  const file = e.target.files?.[0];
  setInput({ ...input, file });
}

const submitHandler = async (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("fullname", input.fullname);
  formData.append("file", input.file);  // ← Must append with key "file"
  
  const response = await axios.put(
    `${USER_API_END_POINT}/profile/update`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true
    }
  );
}
```

### **Company Logo Upload** (Company Setup)

```javascript
// Same pattern but upload in company setup
formData.append("file", input.file);  // Field name MUST be "file"

// Backend receives and uploads to Cloudinary
// Returns logo URL which is stored in MongoDB
```

**Important:** FormData field name MUST be `"file"` - this matches Multer configuration

---

## 🚀 Build & Deployment

### **Build for Production**
```bash
cd frontend
npm run build
```

Creates `dist/` folder with optimized files.

### **Preview Production Build**
```bash
npm run preview
```

### **Environment Variables for Deployment**

```env
# .env.production
VITE_API_URL=https://api.yourdomain.com
```

Change backend URL from localhost to production API URL.

### **Deploy to Netlify/Vercel**

1. Push code to GitHub
2. Connect repo to Netlify/Vercel
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy!

---

## 📚 Component Documentation

### **Home Component**
- Shows hero section
- Displays latest 6 jobs
- Links to job browsing

### **Jobs Component**
- Search page for jobs
- FilterCard sidebar for filtering
- Displays job grid/list

### **JobDescription Component**
- Full job details
- Company information
- "Apply Now" button
- Prevents duplicate applications

### **Profile Component**
- Student profile information
- Shows profile photo
- Display bio and skills
- Renders AppliedJobTable

### **AppliedJobTable Component**
- Table of student's applications
- Status badges (pending/accepted/rejected)
- Application date
- Status icons with colors

### **ProtectedRoute Component**
- Redirects non-recruiters to home
- Only allows access if user.role === 'recruiter'

### **Navbar Component**
- Logo/Home link
- Search box (on Browse page)
- Profile dropdown (when logged in)
- Login/Signup buttons (when not logged in)
- Applied jobs badge with count
- Logout button in dropdown

### **CompanySetup Component**
- Edit company details
- Upload company logo
- Update description, website, location
- Multi-field form with file upload

---

## 🎯 Development Workflow

1. **Start Backend:** `cd backend && npm start`
2. **Start Frontend:** `cd frontend && npm run dev`
3. **Open Browser:** `http://localhost:5173`
4. **Open DevTools:** F12 → Network/Console tabs
5. **Make Changes:** Code hot-reloads in Vite
6. **Test Features:** Fill out forms, check Network requests
7. **Check Redux:** Install Redux DevTools extension (Chrome)
8. **Debug Issues:** Check console errors, Network responses
