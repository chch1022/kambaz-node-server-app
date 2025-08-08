import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const newUser = dao.createUser(req.body);
        res.status(201).json(newUser);
    };

    const deleteUser = (req, res) => {
        const { userId } = req.params;
        const user = dao.findUserById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        dao.deleteUser(userId);
        res.sendStatus(204);
    };

    const findAllUsers = (req, res) => {
        const users = dao.findAllUsers();
        res.json(users);
    };

    const findUserById = (req, res) => {
        const { userId } = req.params;
        const user = dao.findUserById(userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    };

    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signup = (req, res) => {
        const user = dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json({ message: "Username already in use" });
            return;
        }
        const currentUser = dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };

    const signin = (req, res) => {
    console.log("=== SIGNIN REQUEST ===");
    console.log("Request headers:", req.headers);
    console.log("Session before:", req.session);
    
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    
    if (currentUser) {
        req.session["currentUser"] = currentUser;
        
        // Force session save
        req.session.save((err) => {
            if (err) {
                console.log("Session save error:", err);
                return res.status(500).json({ message: "Session error" });
            }
            
            console.log("Session after save:", req.session);
            console.log("Session ID:", req.sessionID);
            console.log("Response headers will include:", res.getHeaders());
            
            res.json(currentUser);
        });
    } else {
        res.status(401).json({ message: "Unable to login. Try again later." });
    }
};

    const profile = (req, res) => {
        console.log("=== PROFILE REQUEST ===");
        console.log("Session ID:", req.sessionID);
        console.log("Session data:", JSON.stringify(req.session, null, 2));
        console.log("Cookies received:", req.headers.cookie);
        console.log("Current user in session:", req.session["currentUser"]);
        console.log("========================");

        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };


    const findCurrentUserCourses = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }

        console.log("Current user ID:", currentUser._id);
        console.log("Looking for courses for user:", currentUser._id);

        const courses = courseDao.findCoursesForEnrolledUser(currentUser._id);
        console.log("Found courses:", courses);

        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const newCourse = courseDao.createCourse(req.body);
        res.json(newCourse);
    };

    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);

    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/users/current/courses", findCurrentUserCourses);
    app.post("/api/users/current/courses", createCourse);
}                      