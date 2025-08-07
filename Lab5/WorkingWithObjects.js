// Create the assignment object
const assignment = {
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
};

// Create the module object
const module = {
    id: "CS5610",
    name: "Web Development",
    description: "Full-stack web development with modern frameworks and technologies",
    course: "Computer Science"
};

export default function WorkingWithObjects(app) {
    // ASSIGNMENT ROUTES FUNCTIONS
    const getAssignment = (req, res) => { res.json(assignment); };
    const getAssignmentTitle = (req, res) => { res.json(assignment.title); };
    const setAssignmentTitle = (req, res) => {
        const { newTitle } = req.params;
        assignment.title = newTitle;
        res.json(assignment);
    };

    const getAssignmentScore = (req, res) => { res.json(assignment.score); };
    const setAssignmentScore = (req, res) => {
        const { newScore } = req.params;
        assignment.score = parseInt(newScore);
        res.json(assignment);
    };

    const getAssignmentCompleted = (req, res) => { res.json(assignment.completed); };
    const setAssignmentCompleted = (req, res) => {
        const { newCompleted } = req.params;
        assignment.completed = newCompleted === "true";
        res.json(assignment);
    };

    // MODULE ROUTES FUNCTIONS
    const getModule = (req, res) => { res.json(module); };
    const getModuleName = (req, res) => { res.json(module.name); };
    const setModuleName = (req, res) => {
        const { newName } = req.params;
        module.name = newName;
        res.json(module);
    };

    const getModuleDescription = (req, res) => { res.json(module.description); };
    const setModuleDescription = (req, res) => {
        const { newDescription } = req.params;
        module.description = newDescription;
        res.json(module);
    };

    // REGISTER ALL ASSIGNMENT ROUTES
    app.get("/lab5/assignment", getAssignment);
    app.get("/lab5/assignment/title", getAssignmentTitle); 
    app.get("/lab5/assignment/title/:newTitle", setAssignmentTitle);
    app.get("/lab5/assignment/score", getAssignmentScore);
    app.get("/lab5/assignment/score/:newScore", setAssignmentScore);
    app.get("/lab5/assignment/completed", getAssignmentCompleted);
    app.get("/lab5/assignment/completed/:newCompleted", setAssignmentCompleted);

    // REGISTER ALL MODULE ROUTES
    app.get("/lab5/module", getModule);
    app.get("/lab5/module/name", getModuleName);
    app.get("/lab5/module/name/:newName", setModuleName);
    app.get("/lab5/module/description", getModuleDescription);
    app.get("/lab5/module/description/:newDescription", setModuleDescription);
}