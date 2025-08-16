import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";


export default function CourseRoutes(app) {

    const findAllCourses = async (req, res) => {
        const courses = await dao.findAllCourses();
        res.send(courses);
    }
    app.get("/api/courses", findAllCourses);

    const createCourse = async (req, res) => {
        const course = await dao.createCourse(req.body);
        res.json(course);
    }
    app.post("/api/courses", createCourse);


    const deleteCourse = async (req, res) => {
        const { courseId } = req.params;
        const status = await dao.deleteCourse(courseId);
        res.send(status);
    }
    app.delete("/api/courses/:courseId", deleteCourse);



    const updateCourse = async (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = await dao.updateCourse(courseId, courseUpdates);
        res.send(status);
    }
    app.put("/api/courses/:courseId", updateCourse);

    const findModulesForCourse = async (req, res) => {
        const { courseId } = req.params;
        const modules = await modulesDao.findModulesForCourse(courseId);
        res.json(modules);
    }
    app.get("/api/courses/:courseId/modules", findModulesForCourse);

    app.post("/api/courses/:courseId/modules", (req, res) => {
        const { courseId } = req.params;
        const module = {
            ...req.body,
            course: courseId,
        };
        const newModule = modulesDao.createModule(module);
        res.send(newModule);
    });

    app.post("/api/courses", async (req, res) => {
        const course = await dao.createCourse(req.body);
        const currentUser = req.session["currentUser"];
        if (currentUser) {
          await enrollmentsDao.enrollUserInCourse(currentUser._id, course._id);
        }
        res.json(course);
      });

      const findUsersForCourse = async (req, res) => {
        const { courseId } = req.params;
        const users = await enrollmentsDao.findUsersForCourse(courseId);
        res.json(users);
    };

    app.get("/api/courses/:courseId/users", findUsersForCourse);

    
}