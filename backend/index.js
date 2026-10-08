// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./utils/db.js";
// import userRoute from "./routes/user.route.js";
// import companyRoute from "./routes/company.route.js";
// import jobRoute from "./routes/job.route.js";
// import applicationRoute from "./routes/application.route.js";

// dotenv.config({});

// const app = express();

// // middleware
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));
// app.use(cookieParser());

// const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// const corsOptions = {
//     origin: FRONTEND_URL,
//     credentials: true
// }

// app.use(cors(corsOptions));//ye mera oldcode hai

// app.set('trust proxy', true);

// const PORT = process.env.PORT || 3000;
// const HOST = process.env.HOST || '0.0.0.0';


// // api's
// // api's
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/company", companyRoute);
// app.use("/api/v1/job", jobRoute);
// app.use("/api/v1/application", applicationRoute);

// // Health check
// app.get("/", (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Job Portal Backend is running successfully"
//     });
// });

// app.listen(PORT, HOST, () => {
//     connectDB();
//     console.log(`Server running at ${HOST}:${PORT}`);
// });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Allowed origins (dev + prod)
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-git-main-nishant-chourasiyas-projects.vercel.app",
  "https://frontend-mocha-alpha-80.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.set("trust proxy", true);

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// ✅ API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// ✅ Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Portal Backend is running successfully"
  });
});

// ✅ Server start
app.listen(PORT, HOST, () => {
  connectDB();
  console.log(`Server running at http://${HOST}:${PORT}`);
});
