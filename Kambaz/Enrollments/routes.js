import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
    const enrollUser = (req, res) => {
        const { userId, courseId } = req.body;
        dao.enrollUserInCourse(userId, courseId);
        res.sendStatus(200);
    };

    app.post("/api/enrollments", enrollUser);
}