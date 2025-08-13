import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    // Enroll user in course
    const enrollUser = (req, res) => {
        const { userId, courseId } = req.body;

        // Check if already enrolled
        const existingEnrollment = dao.findEnrollmentByUserAndCourse(userId, courseId);
        if (existingEnrollment) {
            return res.status(400).json({ message: "User already enrolled in this course" });
        }

        const newEnrollment = dao.enrollUserInCourse(userId, courseId);
        res.status(201).json(newEnrollment);
    };

    // Unenroll user from course
    const unenrollUser = (req, res) => {
        const { userId, courseId } = req.body;
        const deletedEnrollment = dao.deleteEnrollmentByUserAndCourse(userId, courseId);

        if (deletedEnrollment) {
            res.json({ message: "Successfully unenrolled" });
        } else {
            res.status(404).json({ message: "Enrollment not found" });
        }
    };

    // Get all enrollments for a user
    const getUserEnrollments = (req, res) => {
        const { userId } = req.params;
        const enrollments = dao.findEnrollmentsByUserId(userId);
        res.json(enrollments);
    };

    // Get all enrollments
    const getAllEnrollments = (req, res) => {
        const enrollments = dao.findAllEnrollments();
        res.json(enrollments);
    };

    const enrollUserInCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
        res.send(status);
    };
    const unenrollUserFromCourse = async (req, res) => {
        let { uid, cid } = req.params;
        if (uid === "current") {
            const currentUser = req.session["currentUser"];
            uid = currentUser._id;
        }
        const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
        res.send(status);
    };
    app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
    app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);


    // Define routes
    app.post("/api/enrollments", enrollUser);                    // Enroll in course
    app.delete("/api/enrollments", unenrollUser);                // Unenroll from course  
    app.get("/api/enrollments/user/:userId", getUserEnrollments); // Get user's enrollments
    app.get("/api/enrollments", getAllEnrollments);             // Get all enrollments
}