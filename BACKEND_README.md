# Backend - Job Portal API

Complete documentation for Node.js/Express backend with MongoDB database.

---

## 📋 Backend Structure

```
backend/
├── controllers/
│   ├── user.controller.js           # User signup, login, profile, logout
│   ├── job.controller.js            # Post jobs, get jobs, filter jobs
│   ├── application.controller.js    # Apply for job, get applications, update status
│   └── company.controller.js        # Register company, update company, get companies
│
├── middlewares/
│   ├── isAuthenticated.js           # JWT token verification
│   ├── mutler.js                    # File upload configuration
│   └── handleMulterError.js         # Multer error handling
│
├── models/
│   ├── user.model.js                # User schema (students & recruiters)
│   ├── job.model.js                 # Job listings schema
│   ├── application.model.js         # Job applications schema
│   └── company.model.js             # Company profile schema
│
├── routes/
│   ├── user.route.js                # /api/v1/user/* endpoints
│   ├── job.route.js                 # /api/v1/job/* endpoints
│   ├── application.route.js         # /api/v1/application/* endpoints
│   └── company.route.js             # /api/v1/company/* endpoints
│
├── utils/
│   ├── db.js                        # MongoDB connection
│   ├── cloudinary.js                # Cloudinary image upload config
│   └── datauri.js                   # Convert file buffer to URI
│
├── index.js                         # Express server entry point
├── package.json                     # Dependencies
└── .env                             # Environment variables
```

---

## 🚀 Backend Setup

### **1. Install Dependencies**
```bash
cd backend
npm install
```

### **2. Create .env File**
```env
# Database
MONGO_URI=mongodb://localhost:27017/jobportal
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobportal

# JWT
JWT_SECRET_KEY=your_secret_key_here

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Port
PORT=3000
```

### **3. Start Backend Server**
```bash
npm start
```
or for development with auto-reload:
```bash
npm install -g nodemon
nodemon index.js
```

Server runs on: `http://localhost:3000`

---

## 🗄️ Database Models

### **User Model**
```javascript
{
  _id: ObjectId,
  fullname: String (required),
  email: String (unique, required),
  phoneNumber: String,
  password: String (hashed, required),
  role: String (enum: 'student', 'recruiter'),
  profile: {
    bio: String,
    skills: [String],
    resume: String (Cloudinary URL),
    resumeOriginalName: String,
    profilePhoto: String (Cloudinary URL)
  },
  company: ObjectId (ref: Company, for recruiters),
  applications: [ObjectId] (ref: Application),
  createdAt: Date,
  updatedAt: Date
}
```

**Key Fields:**
- `role`: Determines if user is student (can apply) or recruiter (can post jobs)
- `password`: Hashed with bcryptjs (never stored plain text)
- `profile.resume`: Cloudinary URL for CV/resume file
- `profile.profilePhoto`: Cloudinary URL for profile picture
- `company`: Links recruiter to their company

### **Job Model**
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  requirements: [String],
  salary: Number,
  location: String,
  jobType: String (enum: 'Full Time', 'Part Time', 'Contract', 'Temporary'),
  experienceLevel: String (enum: 'Beginner', 'Intermediate', 'Expert'),
  position: Number (number of opening positions),
  company: ObjectId (ref: Company, required),
  created_by: ObjectId (ref: User, recruiter who posted),
  applications: [ObjectId] (ref: Application),
  createdAt: Date,
  updatedAt: Date
}
```

**Key Fields:**
- `experienceLevel`: String type (not Number) - fixed in update
- `requirements`: Array of strings (split by commas from input)
- `company`: Reference to company posting the job
- `created_by`: Recruiter who created the job
- `applications`: Array of application IDs for this job

### **Application Model**
```javascript
{
  _id: ObjectId,
  job: ObjectId (ref: Job, required),
  applicant: ObjectId (ref: User, student who applied),
  status: String (enum: 'pending', 'accepted', 'rejected', default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

**Key Fields:**
- `status`: Can only be one application per student per job
- `applicant`: References the student applying
- `job`: References the job being applied to

### **Company Model**
```javascript
{
  _id: ObjectId,
  name: String (required, unique),
  description: String,
  website: String,
  location: String,
  logo: String (Cloudinary URL),
  userId: ObjectId (ref: User, recruiter who created),
  createdAt: Date,
  updatedAt: Date
}
```

**Key Fields:**
- `name`: Unique company name
- `userId`: Recruiter who owns/manages this company
- `logo`: Cloudinary URL for company logo

---

## 🔐 Authentication Flow

### **JWT Token System**

```
User Registration/Login
       ↓
Password hashed with bcryptjs
       ↓
JWT Token created: jwt.sign({ userId, email }, SECRET_KEY, { expiresIn: '1d' })
       ↓
Token stored in httpOnly cookie (secure from XSS attacks)
       ↓
Every request includes cookie with token
       ↓
isAuthenticated middleware verifies token
       ↓
req.id set to userId for use in controllers
```

### **isAuthenticated Middleware**

**Location:** `backend/middlewares/isAuthenticated.js`

```javascript
export default isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.id = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Token verification failed",
            success: false
        });
    }
}
```

**What it does:**
1. Extracts token from cookies
2. Verifies token with JWT_SECRET_KEY
3. Extracts userId from token
4. Sets req.id for controller access
5. Allows request to proceed to next middleware/controller

**Protected Routes:** Any route with `isAuthenticated` middleware will reject requests without valid token.

---

## 📡 API Endpoints

### **User Endpoints**

#### **1. Register New User**
```
POST /api/v1/user/register
Content-Type: multipart/form-data (if uploading file)

Body:
{
  fullname: "John Doe",
  email: "john@example.com",
  phoneNumber: "9876543210",
  password: "secure123",
  role: "student" | "recruiter",
  file: <profile photo file> (optional)
}

Response (201):
{
  message: "Account created successfully",
  success: true,
  user: { _id, fullname, email, role, ... }
}
```

#### **2. Login User**
```
POST /api/v1/user/login
Content-Type: application/json

Body:
{
  email: "john@example.com",
  password: "secure123"
}

Response (200):
{
  message: "Login successful",
  success: true,
  user: { _id, fullname, email, role, ... }
}

Sets httpOnly cookie: token=<jwt_token>
```

#### **3. Get User Profile**
```
GET /api/v1/user/profile
Authorization: Bearer <token> (in cookie)

Response (200):
{
  message: "User found",
  success: true,
  user: { _id, fullname, email, profile: { bio, skills, resume, profilePhoto }, ... }
}
```

#### **4. Update User Profile**
```
PUT /api/v1/user/profile/update
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
{
  fullname: "Jane Doe",
  email: "jane@example.com",
  phoneNumber: "9876543210",
  bio: "Experienced developer",
  skills: "JavaScript,React,Node.js",
  file: <resume or profile photo> (optional)
}

Response (200):
{
  message: "Profile updated successfully",
  success: true,
  user: { updated data }
}
```

#### **5. Logout User**
```
GET /api/v1/user/logout
Authorization: Bearer <token>

Response (200):
{
  message: "Logged out successfully",
  success: true
}

Clears httpOnly cookie
```

---

### **Job Endpoints**

#### **1. Post New Job** (Recruiter Only)
```
POST /api/v1/job/post
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  title: "Software Engineer",
  description: "Build amazing features",
  requirements: "JavaScript,React,Node.js",  // comma-separated
  salary: 80000,
  location: "New York",
  jobType: "Full Time",
  experience: "Intermediate",  // Maps to experienceLevel
  position: 5,
  companyId: "company_id_here"
}

Response (201):
{
  message: "New job created successfully",
  success: true,
  job: { _id, title, company, created_by, ... }
}
```

#### **2. Get All Jobs** (Public)
```
GET /api/v1/job/get?keyword=javascript
Authorization: Not required

Query Parameters:
- keyword: Search in title or description (optional)

Response (200):
{
  success: true,
  jobs: [
    { _id, title, company, salary, location, ... },
    ...
  ]
}
```

#### **3. Get Job by ID** (Public)
```
GET /api/v1/job/get/:id
Authorization: Not required

Response (200):
{
  success: true,
  job: { _id, title, description, company, applications, ... }
}
```

#### **4. Get Admin Jobs** (Recruiter Only)
```
GET /api/v1/job/getadminjobs
Authorization: Bearer <token>

Response (200):
{
  success: true,
  jobs: [
    { Job posted by this recruiter }
  ]
}
```

---

### **Application Endpoints**

#### **1. Apply for Job** (Student Only)
```
POST /api/v1/application/apply/:jobId
Authorization: Bearer <token>

Response (201):
{
  message: "Applied successfully",
  success: true,
  application: { _id, job, applicant, status: "pending" }
}

Note: Prevents duplicate applications (same student can't apply twice)
```

#### **2. Get Applied Jobs** (Student Only)
```
GET /api/v1/application/get?status=pending
Authorization: Bearer <token>

Query Parameters:
- status: Filter by 'pending', 'accepted', or 'rejected' (optional)

Response (200):
{
  success: true,
  applications: [
    { _id, job: { title, company, ... }, status, createdAt }
  ]
}
```

#### **3. Get Job Applicants** (Recruiter Only)
```
GET /api/v1/application/applicants/:jobId
Authorization: Bearer <token>

Response (200):
{
  success: true,
  application: [
    { applicant: { fullname, profile: { profilePhoto } }, status, createdAt }
  ]
}
```

#### **4. Update Application Status** (Recruiter Only)
```
POST /api/v1/application/status/:applicationId/update
Authorization: Bearer <token>

Body:
{
  status: "accepted" | "rejected"
}

Response (200):
{
  message: "Status updated",
  success: true
}
```

---

### **Company Endpoints**

#### **1. Register Company** (Recruiter Only)
```
POST /api/v1/company/register
Authorization: Bearer <token>

Body:
{
  companyName: "Tech Corp"
}

Response (201):
{
  message: "Company registered successfully",
  success: true,
  company: { _id, name, userId }
}
```

#### **2. Get All Companies** (Recruiter - Own Companies)
```
GET /api/v1/company/get
Authorization: Bearer <token>

Response (200):
{
  success: true,
  companies: [
    { Companies owned by this recruiter }
  ]
}
```

#### **3. Get Company by ID** (Public)
```
GET /api/v1/company/get/:id
Authorization: Not required

Response (200):
{
  success: true,
  company: { _id, name, description, website, logo, ... }
}
```

#### **4. Update Company** (Logo Upload)
```
PUT /api/v1/company/update/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
{
  name: "Tech Corp Updated",
  description: "Leading tech company",
  website: "techcorp.com",
  location: "San Francisco",
  file: <logo image> (optional)
}

Response (200):
{
  message: "Company information updated",
  success: true,
  company: { updated company data }
}
```

---

## 🔧 Middleware Explanation

### **isAuthenticated Middleware**

**Purpose:** Verify JWT token and protect routes

**Usage:**
```javascript
router.route("/update/:id").put(isAuthenticated, updateCompany);
//                               ↑ Only authenticated users can access
```

**What happens:**
1. ✅ Valid token → Continues to next middleware/controller
2. ❌ No token → 401 error
3. ❌ Invalid token → 401 error

---

### **Multer - File Upload Middleware**

**Location:** `backend/middlewares/mutler.js`

**Configuration:**
```javascript
const storage = multer.memoryStorage();  // Store file in memory (RAM)
export const singleUpload = multer({storage}).single("file");
```

**Why Memory Storage:**
- Stores file in RAM instead of disk
- Immediately upload to Cloudinary
- Automatic cleanup after upload
- Better for cloud deployment

**Usage:**
```javascript
router.route("/update/:id").put(
  isAuthenticated,
  singleUpload,       // Extract "file" field from request
  handleMulterError,  // Catch any file errors
  updateCompany
);
```

**Field Name Requirement:**
```javascript
// ✅ CORRECT - Field name MUST be "file"
formData.append("file", fileObject);

// ❌ WRONG - Will not work
formData.append("logo", fileObject);
formData.append("image", fileObject);
```

---

### **Multer Error Handler**

**Location:** `backend/middlewares/mutler.js`

```javascript
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

**Catches Errors:**
- File too large
- Invalid file type
- Multiple files uploaded when only one allowed
- Disk read/write errors

---

## 🔍 API Response Format

**All API responses follow this format:**

### **Success Response**
```javascript
{
  success: true,
  message: "Operation successful",
  data: { /* response data */ }
  // OR
  user: { /* user object */ },
  job: { /* job object */ },
  etc.
}
```

**HTTP Status Codes:**
- `200` - Success (GET, PUT)
- `201` - Created (POST)

### **Error Response**
```javascript
{
  success: false,
  message: "Error description"
}
```

**HTTP Status Codes:**
- `400` - Bad request (missing fields, invalid data)
- `401` - Unauthorized (missing token, invalid token)
- `404` - Not found (resource doesn't exist)
- `500` - Server error

---

## 🐛 Common Backend Issues & Solutions

### **Issue 1: "Token verification failed"**
**Cause:** JWT_SECRET_KEY mismatch or token expired

**Solution:**
```bash
# Check .env has correct JWT_SECRET_KEY
echo $JWT_SECRET_KEY

# Token expires after 1 day, user needs to login again
# Check response has token in cookies
```

### **Issue 2: "File upload error: ENOENT"**
**Cause:** Cloudinary credentials missing or invalid

**Solution:**
```bash
# Verify .env has all Cloudinary variables
CLOUDINARY_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

# Restart server after changing .env
```

### **Issue 3: "Cannot read property 'id' of undefined"**
**Cause:** Middleware chain broken, req.id not set

**Solution:**
```javascript
// Ensure isAuthenticated is BEFORE controller
router.route("/update/:id").put(isAuthenticated, updateCompany);
//                               ↑ Must be first!
```

### **Issue 4: Multer error - No response sent**
**Cause:** Missing handleMulterError middleware

**Solution:**
```javascript
router.route("/update/:id").put(
  isAuthenticated,
  singleUpload,
  handleMulterError,  // ← Add this!
  updateCompany
);
```

### **Issue 5: "Duplicate key error" on company name**
**Cause:** Company names must be unique

**Solution:**
```javascript
// Check if company name already exists before creating
let existingCompany = await Company.findOne({ name: companyName });
if (existingCompany) {
  return res.status(400).json({
    message: "Company already exists",
    success: false
  });
}
```

---

## 🧪 Testing Backend Endpoints

### **Using cURL**

#### **Test User Registration**
```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe",
    "email": "john@example.com",
    "password": "secure123",
    "phoneNumber": "9876543210",
    "role": "student"
  }'
```

#### **Test User Login**
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "secure123"
  }' \
  -c cookies.txt
```

#### **Test Protected Route (with token from login)**
```bash
curl -X GET http://localhost:3000/api/v1/user/profile \
  -b cookies.txt
```

### **Using Postman**

1. **Create request:** POST `http://localhost:3000/api/v1/user/register`
2. **Body:** Select "raw" → "JSON"
3. **Add credentials:** User data
4. **Send:** Click Send
5. **Check response:** Should return user object

---

## 📊 Database Queries

### **Find User by Email**
```javascript
const user = await User.findOne({ email: "john@example.com" });
```

### **Get All Jobs Posted by Recruiter**
```javascript
const jobs = await Job.find({ created_by: recruiterId });
```

### **Get Job with Company Details Populated**
```javascript
const job = await Job.findById(jobId).populate('company');
```

### **Get All Applications for a Job**
```javascript
const apps = await Application.find({ job: jobId })
  .populate('applicant', 'fullname email profile');
```

### **Check if Student Already Applied**
```javascript
const existing = await Application.findOne({
  job: jobId,
  applicant: studentId
});

if (existing) {
  // Already applied!
}
```

---

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Change JWT_SECRET_KEY to strong random string
- [ ] Change Multer storage to disk storage (not memory)
- [ ] Set Cloudinary in secure mode
- [ ] Enable HTTPS for production URL
- [ ] Update CORS to allow production frontend URL
- [ ] Update MONGO_URI to production database
- [ ] Set httpOnly cookie secure: true (for HTTPS)
- [ ] Remove console.log statements or replace with logger
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Test all endpoints with production database
