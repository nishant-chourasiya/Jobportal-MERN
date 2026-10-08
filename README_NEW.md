# Job Portal - Full Stack MERN Application

A complete full-stack job portal where **recruiters post jobs & manage companies**, while **students browse, apply, and track applications**.

> **📚 This project has separate documentation for better organization:**
> - **[BACKEND_README.md](BACKEND_README.md)** - API, database, authentication, endpoints, debugging
> - **[FRONTEND_README.md](FRONTEND_README.md)** - React components, Redux, hooks, features, UI
> - **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Complete testing procedures & scenarios

---

## 🚀 Quick Start

### **1. Start Backend**
```bash
cd backend
npm install
# Create .env with MONGO_URI, JWT_SECRET_KEY, CLOUDINARY credentials
npm start
```
Backend: `http://localhost:3000`

### **2. Start Frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

**See full setup in [BACKEND_README.md](BACKEND_README.md#-backend-setup) and [FRONTEND_README.md](FRONTEND_README.md#-frontend-setup)**

---

## 📋 Project Structure

```
jobportal-yt/
├── backend/              # Node.js + Express + MongoDB
│   ├── controllers/      # API business logic
│   ├── middlewares/      # Auth & file upload
│   ├── models/           # Database schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # DB & Cloudinary config
│   ├── index.js          # Server entry
│   └── package.json
│
└── frontend/             # React + Vite + Redux
    ├── src/
    │   ├── components/   # React components
    │   ├── hooks/        # Custom API hooks
    │   ├── redux/        # State management
    │   └── utils/        # Constants
    ├── vite.config.js
    └── package.json
```

---

## ✨ Key Features

### **Student Features** 👨‍🎓
- Register & setup profile
- Browse & search jobs
- View job details
- Apply for jobs (one-time per job)
- Track application status
- Upload resume/profile photo

### **Recruiter Features** 👨‍💼
- Create company profile
- Upload company logo
- Post job listings
- View & manage applicants
- Accept/reject applications
- Update company info

### **General** 🔒
- Secure JWT authentication
- Image upload to Cloudinary
- Responsive design (Tailwind)
- Real-time notifications
- Protected routes
- Data persistence

---

## 🐛 Bugs Fixed (10 Total)

| # | Bug | Component | Status |
|---|-----|-----------|--------|
| 1 | Invalid CSS `w-20%` | Jobs.jsx | ✅ Fixed |
| 2 | Missing `searchedQuery` dependency | useGetAllJobs | ✅ Fixed |
| 3 | Missing `user` dependency | ProtectedRoute | ✅ Fixed |
| 4 | Wrong variable reference | user.controller | ✅ Fixed |
| 5 | Missing error response | isAuthenticated.js | ✅ Fixed |
| 6 | experienceLevel type mismatch | job.model | ✅ Fixed |
| 7 | Missing error responses | Controllers | ✅ Fixed |
| 8 | Wrong route permissions | company.route | ✅ Fixed |
| 9 | Token not persisting | Redux store | ✅ Fixed |
| 10 | Multer error handling | mutler.js | ✅ Fixed |

**See [BACKEND_README.md](BACKEND_README.md#-common-backend-issues--solutions) for detailed explanations**

---

## 🛠️ Tech Stack

**Backend**
- Node.js, Express
- MongoDB, Mongoose
- JWT, bcryptjs
- Multer, Cloudinary

**Frontend**
- React 18, Vite
- Redux Toolkit
- React Router
- Tailwind CSS, Radix UI
- Axios, Sonner

---

## 📡 API Overview

### **User Endpoints**
```
POST   /api/v1/user/register          # Sign up
POST   /api/v1/user/login             # Log in
GET    /api/v1/user/logout            # Log out
PUT    /api/v1/user/profile/update    # Update profile
```

### **Job Endpoints**
```
GET    /api/v1/job/get                # Get all jobs
GET    /api/v1/job/get/:id            # Get job details
POST   /api/v1/job/post               # Post job (recruiter)
GET    /api/v1/job/getadminjobs       # Get recruiter's jobs
```

### **Application Endpoints**
```
POST   /api/v1/application/apply/:jobId          # Apply for job
GET    /api/v1/application/get                   # Get my applications
GET    /api/v1/application/applicants/:jobId    # Get job applicants (recruiter)
POST   /api/v1/application/status/:appId/update # Update status (recruiter)
```

### **Company Endpoints**
```
POST   /api/v1/company/register       # Create company
GET    /api/v1/company/get            # Get my companies (recruiter)
GET    /api/v1/company/get/:id        # Get company details
PUT    /api/v1/company/update/:id     # Update company (with logo)
```

**See [BACKEND_README.md - API Endpoints](BACKEND_README.md#-api-endpoints) for complete details**

---

## 🔄 Data Flow

```
React Component
    ↓
useSelector (Redux)
    ↓
useGetAllJobs Hook
    ↓
Axios Request (with JWT token)
    ↓
Express API
    ↓
isAuthenticated Middleware
    ↓
Controller Logic
    ↓
MongoDB Database
    ↓
JSON Response
    ↓
dispatch(setJobs) → Redux Store
    ↓
Component Re-renders
```

---

## 📚 Detailed Documentation

### **Backend**
See [BACKEND_README.md](BACKEND_README.md) for:
- Complete setup & installation
- Database models explained
- JWT authentication system
- Full API reference
- Middleware explanations
- File upload configuration
- Error solutions
- Testing with cURL/Postman
- Deployment checklist

### **Frontend**
See [FRONTEND_README.md](FRONTEND_README.md) for:
- Project structure
- Component hierarchy
- Redux state management
- Custom hooks guide
- API integration
- Feature implementations
- UI components
- Testing procedures
- Common issues & fixes

### **Testing**
See [TESTING_GUIDE.md](TESTING_GUIDE.md) for:
- Step-by-step test procedures
- API request examples
- User workflows
- Feature testing
- Debugging tips
- Error verification

---

## 🔐 Authentication Flow

```
User enters credentials
    ↓
POST /api/v1/user/login
    ↓
Backend validates & hashes password
    ↓
JWT token created & set in httpOnly cookie
    ↓
User data returned → Redux store updated
    ↓
Redux persist saves to localStorage
    ↓
On page refresh: localStorage restored → Ready to use
    ↓
All requests include token automatically (withCredentials: true)
```

---

## 🧪 Test Features

### **As Student:**
1. Signup with role "student"
2. Browse jobs at `/browse`
3. Search jobs (e.g., "React")
4. Click job → View details
5. Click "Apply Now"
6. Go to `/profile` → See applications
7. See applied jobs count in navbar badge

### **As Recruiter:**
1. Signup with role "recruiter"
2. Create company at `/admin/companies`
3. Upload company logo
4. Post job at `/admin/jobs`
5. Go to `/admin/applicants` → See applicants
6. Accept/Reject applications

**See [TESTING_GUIDE.md](TESTING_GUIDE.md) for complete test scenarios**

---

## 💾 Database Models

### **User**
- fullname, email, phoneNumber, password
- role (student/recruiter)
- profile (bio, skills, resume, profilePhoto)
- company (for recruiters)
- applications (for students)

### **Job**
- title, description, requirements, salary
- location, jobType, experienceLevel
- position (openings), company, created_by
- applications array

### **Application**
- job, applicant, status (pending/accepted/rejected)
- createdAt timestamp

### **Company**
- name, description, website, location
- logo (Cloudinary URL), userId (recruiter)

**See [BACKEND_README.md - Database Models](BACKEND_README.md#-database-models) for full details**

---

## 🚀 Deployment

### **Backend**
- Railway/Render/Firebase (Node.js)
- MongoDB Atlas (Database)
- Cloudinary (Image storage)

### **Frontend**
- Netlify/Vercel (React hosting)
- Update `VITE_API_URL` to production backend

**See [BACKEND_README.md - Deployment](BACKEND_README.md#-deployment-checklist)**

---

## 🎯 Key Implementation Details

### **1. Duplicate Application Prevention**
```javascript
// Backend checks if student already applied
const existing = await Application.findOne({
  job: jobId,
  applicant: userId
});
if (existing) return error;
```

### **2. File Upload (Cloudinary)**
```javascript
// Multer stores in memory → Cloudinary → Returns URL
// Supports: profile photos, resumes, company logos
```

### **3. Token Persistence**
```javascript
// Redux persist saves auth state to localStorage
// On refresh: restored from localStorage
// Axios includes token in all requests
```

### **4. Protected Routes**
```javascript
// ProtectedRoute component checks user.role
// Only recruiters can access /admin/* routes
```

### **5. Redux Slices**
```javascript
// authSlice - User authentication
// jobSlice - Jobs state
// companySlice - Companies state
// applicationSlice - Applications state
```

---

## ❓ Troubleshooting

**"Cannot connect to backend"**
- Backend running on port 3000?
- Check `FRONTEND_README.md - Common Issues`

**"Token verification failed"**
- JWT_SECRET_KEY correct?
- See `BACKEND_README.md - Common Issues`

**"File upload error"**
- Cloudinary credentials set?
- File field name is "file"?
- See `BACKEND_README.md - Multer Section`

**"Jobs not showing"**
- useGetAllJobs hook called?
- Check Network tab for API response
- See `FRONTEND_README.md - Common Issues`

**More help?**
- Check detailed README files above
- Review [TESTING_GUIDE.md](TESTING_GUIDE.md)
- Check browser DevTools (Network & Console)

---

## 📞 Developer Resources

- **Backend Details:** [BACKEND_README.md](BACKEND_README.md)
- **Frontend Details:** [FRONTEND_README.md](FRONTEND_README.md)
- **Testing Guide:** [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **API Examples:** [BACKEND_README.md - Testing Endpoints](BACKEND_README.md#-testing-backend-endpoints)
- **Component Guide:** [FRONTEND_README.md - Components](FRONTEND_README.md#-component-documentation)

---

## 📝 License

Educational project
