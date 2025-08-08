import "dotenv/config";
import express from 'express';
import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import cors from "cors";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import AssignmentRoutes from "./Kambaz/Assignments/routes.js";
import session from "express-session";
import ModuleRoutes from "./Kambaz/Modules/routes.js";
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";

const app = express();

// CORS MUST come first
app.use(cors({
  credentials: true,
  origin: [
    "http://localhost:5173",
    "https://chenchen-summer-2025.netlify.app"
  ]
}));

// JSON parsing MUST come before session
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || "kambaz-secret-key-12345",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,        // Set to false for testing
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// Debug route
app.get("/api/debug/session", (req, res) => {
  res.json({
    hasSession: !!req.session,
    sessionId: req.sessionID,
    currentUser: req.session?.currentUser || null,
    cookies: req.headers.cookie
  });
});

// Routes
UserRoutes(app);
CourseRoutes(app);
AssignmentRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);