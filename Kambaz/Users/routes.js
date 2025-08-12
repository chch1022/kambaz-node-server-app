import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
    const createUser = (req, res) => { };
    const deleteUser = (req, res) => { };
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
          const users = await dao.findUsersByRole(role);
          res.json(users);
          return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
          }
      
    
        const users = await dao.findAllUsers();
        res.json(users);
      };
    
    const findUserById = (req, res) => { };
    const updateUser = (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        dao.updateUser(userId, userUpdates);
        const currentUser = dao.findUserById(userId);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
    };



    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
          res.status(400).json({ message: "Username already taken" });
          return;
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;
        res.json(currentUser);
      };
    

    const signin = async (req, res) => {
        const { username, password } = req.body;
        const currentUser = await dao.findUserByCredentials(username, password);
        if (currentUser) {
          req.session["currentUser"] = currentUser;
          res.json(currentUser);
        } else {
          res.status(401).json({ message: "Unable to login. Try again later." });
        }
      };
    

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };


    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return;
        }
        res.json(currentUser);
    };

    // const findCoursesForEnrolledUser = (req, res) => {
    //     console.log('=== COURSE DEBUG ===');
    //     let { userId } = req.params;
    //     if (userId === "current") {
    //         const currentUser = req.session["currentUser"];
    //         console.log('Current user:', currentUser);
    //         if (!currentUser) {
    //             res.sendStatus(401);
    //             return;
    //         }
    //         userId = currentUser._id;
    //     }

    //     console.log('Calling courseDao.findCoursesForEnrolledUser with userId:', userId);
    //     const courses = courseDao.findCoursesForEnrolledUser(userId);
    //     console.log('DAO returned:', courses);
    //     console.log('Type of courses:', typeof courses);
    //     console.log('Is Promise?', courses instanceof Promise);

    //     res.json(courses);
    // };


    const findCoursesForEnrolledUser = (req, res) => {
        console.log('=== COURSE DEBUG ===');
        console.log('Session ID:', req.sessionID);
        console.log('Session exists:', !!req.session);
        console.log('Full session:', req.session);
        console.log('Current user in session:', req.session["currentUser"]);
        console.log('Cookies received:', req.headers.cookie);

        let { userId } = req.params;
        console.log('Requested userId param:', userId);

        if (userId === "current") {
            console.log('Using current user from session...');
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                console.log('❌ No current user found in session - sending 401');
                res.sendStatus(401);
                return;
            }
            console.log('Found current user:', currentUser);
            console.log('Using user ID:', currentUser._id);
            userId = currentUser._id;
        }

        console.log('Calling courseDao with userId:', userId);
        const courses = courseDao.findCoursesForEnrolledUser(userId);
        console.log('DAO returned courses:', courses);
        res.json(courses);
    };


    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = courseDao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.get("/api/users/current/courses", findCoursesForEnrolledUser);
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);
}
