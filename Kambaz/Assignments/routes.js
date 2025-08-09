import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
    // Get all assignments
    const findAllAssignments = (req, res) => {
        try {
            const assignments = dao.findAllAssignments();
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Get assignments for a specific course with optional filtering
    const findAssignmentsForCourse = (req, res) => {
        try {
            const { courseId } = req.params;
            const { type, upcoming } = req.query;
            
            let assignments = dao.findAssignmentsForCourse(courseId);
            
            // Filter by type if provided
            if (type) {
                assignments = assignments.filter(a => a.type === type.toUpperCase());
            }
            
            // Filter for upcoming assignments if requested
            if (upcoming === 'true') {
                const now = new Date();
                assignments = assignments.filter(a => new Date(a.dueDate) > now);
            }
            
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Get assignments by type for a course
    const findAssignmentsByType = (req, res) => {
        try {
            const { courseId, type } = req.params;
            const assignments = dao.findAssignmentsByType(courseId, type.toUpperCase());
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Get upcoming assignments for a course
    const findUpcomingAssignments = (req, res) => {
        try {
            const { courseId } = req.params;
            const assignments = dao.findUpcomingAssignments(courseId);
            res.json(assignments);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Get assignment by ID
    const findAssignmentById = (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignment = dao.findAssignmentById(assignmentId);
            if (assignment) {
                res.json(assignment);
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Create new assignment
    const createAssignment = (req, res) => {
        try {
            const { courseId } = req.params;
            const { title, description, points, dueDate, availableDate, type } = req.body;
            
            // Validate required fields
            if (!title || !description || !points || !dueDate || !type) {
                return res.status(400).json({ 
                    message: "Missing required fields: title, description, points, dueDate, type" 
                });
            }
            
            // Validate type
            const validTypes = ['ASSIGNMENTS', 'QUIZZES', 'EXAMS', 'PROJECT'];
            if (!validTypes.includes(type.toUpperCase())) {
                return res.status(400).json({ 
                    message: "Invalid type. Must be one of: " + validTypes.join(', ')
                });
            }
            
            // Validate points is a number
            if (isNaN(points) || points < 0) {
                return res.status(400).json({ 
                    message: "Points must be a positive number" 
                });
            }
            
            const newAssignment = dao.createAssignment({ 
                ...req.body, 
                course: courseId,
                type: type.toUpperCase(),
                points: Number(points)
            });
            res.status(201).json(newAssignment);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Update assignment
    const updateAssignment = (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignmentUpdates = req.body;
            
            // Validate type if provided
            if (assignmentUpdates.type) {
                const validTypes = ['ASSIGNMENTS', 'QUIZZES', 'EXAMS', 'PROJECT'];
                if (!validTypes.includes(assignmentUpdates.type.toUpperCase())) {
                    return res.status(400).json({ 
                        message: "Invalid type. Must be one of: " + validTypes.join(', ')
                    });
                }
                assignmentUpdates.type = assignmentUpdates.type.toUpperCase();
            }
            
            // Validate points if provided
            if (assignmentUpdates.points !== undefined) {
                if (isNaN(assignmentUpdates.points) || assignmentUpdates.points < 0) {
                    return res.status(400).json({ 
                        message: "Points must be a positive number" 
                    });
                }
                assignmentUpdates.points = Number(assignmentUpdates.points);
            }
            
            const updatedAssignment = dao.updateAssignment(assignmentId, assignmentUpdates);
            if (updatedAssignment) {
                res.json(updatedAssignment);
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Delete assignment
    const deleteAssignment = (req, res) => {
        try {
            const { assignmentId } = req.params;
            const assignment = dao.findAssignmentById(assignmentId);
            if (assignment) {
                dao.deleteAssignment(assignmentId);
                res.sendStatus(204); // No content
            } else {
                res.status(404).json({ message: "Assignment not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    };

    // Route definitions
    app.get("/api/assignments", findAllAssignments);
    app.get("/api/courses/:courseId/assignments", findAssignmentsForCourse);
    app.get("/api/courses/:courseId/assignments/type/:type", findAssignmentsByType);
    app.get("/api/courses/:courseId/assignments/upcoming", findUpcomingAssignments);
    app.get("/api/assignments/:assignmentId", findAssignmentById);
    app.post("/api/courses/:courseId/assignments", createAssignment);
    app.put("/api/assignments/:assignmentId", updateAssignment);
    app.delete("/api/assignments/:assignmentId", deleteAssignment);
}