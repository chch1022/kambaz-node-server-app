import "dotenv/config";
import session from "express-session";
import express from 'express'
import Hello from "./Hello.js"
import Lab5 from './Lab5/index.js'
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";


const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};
// if (process.env.NODE_ENV !== "development") {
//   sessionOptions.proxy = true;
//   sessionOptions.cookie = {
//     sameSite: "none",
//     secure: true,
//    // domain: process.env.NODE_SERVER_DOMAIN,
//   };
// }

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, 
  };
} else {
  // Development settings
  sessionOptions.cookie = {
    sameSite: "lax",
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
}

const app = express();
app.use(session(sessionOptions));
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.NETLIFY_URL || "http://localhost:5173",
      "https://chenchen-summer-2025.netlify.app"
    ],
  })
);
app.use(express.json());

UserRoutes(app);
CourseRoutes(app);
EnrollmentRoutes(app);
ModuleRoutes(app);
AssignmentRoutes(app);
Lab5(app)
Hello(app)
app.listen(process.env.PORT || 4000)