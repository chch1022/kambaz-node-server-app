import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    // Get all assignments
    const findAllAssignments = (req, res) => {
        const assignments = dao.findAllAssignments();
        res.json(assignments);
    };

    // Get assignments for a specific course
    const findAssignmentsForCourse = (req, res) => {
        const { courseId } = req.params;
        const assignments = dao.findAssignmentsForCourse(courseId);
        res.json(assignments);
    };

    // Get assignment by ID
    const findAssignmentById = (req, res) => {
        const { assignmentId } = req.params;
        const assignment = dao.findAssignmentById(assignmentId);
        if (assignment) {
            res.json(assignment);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    };

    // Create new assignment
    const createAssignment = (req, res) => {
        const newAssignment = dao.createAssignment(req.body);
        res.status(201).json(newAssignment);
    };

    // Update assignment
    const updateAssignment = (req, res) => {
        const { assignmentId } = req.params;
        const assignmentUpdates = req.body;
        const updatedAssignment = dao.updateAssignment(assignmentId, assignmentUpdates);
        if (updatedAssignment) {
            res.json(updatedAssignment);
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    };

    // Delete assignment
    const deleteAssignment = (req, res) => {
        const { assignmentId } = req.params;
        const assignment = dao.findAssignmentById(assignmentId);
        if (assignment) {
            dao.deleteAssignment(assignmentId);
            res.sendStatus(204); // No content
        } else {
            res.status(404).json({ message: "Assignment not found" });
        }
    };

    // Route definitions
    app.get("/api/assignments", findAllAssignments);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}