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
app.use(
  cors({
    credentials: true,
    origin: [
      "http://localhost:5173",                              
      "https://chenchen-summer-2025.netlify.app",          
      process.env.NETLIFY_URL                              
    ].filter(Boolean), 
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  // sessionOptions.cookie = {
  //   sameSite: "none",
  //   secure: true,

 //
}
app.use(session(sessionOptions));
app.use(express.json());

app.get("/api/debug/session", (req, res) => {
  res.json({
    hasSession: !!req.session,
    sessionId: req.sessionID,
    currentUser: req.session?.currentUser || null,
    cookies: req.headers.cookie
  });
});

UserRoutes(app);
CourseRoutes(app);
AssignmentRoutes(app);
ModuleRoutes(app);
EnrollmentRoutes(app);
Lab5(app);
Hello(app);

app.listen(process.env.PORT || 4000);
