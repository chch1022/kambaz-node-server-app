import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  _id: { type: String, default: "" },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  type: {
    type: String,
    enum: ["MULTIPLE-CHOICE", "TRUE-FALSE", "FILL-IN"],
    default: "MULTIPLE-CHOICE",
  },
  points: { type: Number, default: 0 },
  answers: { type: [String], default: [] },
  choices: { type: [String], default: [] },
});

const quizSchema = new mongoose.Schema(
  {
    _id: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    assignTo: { type: String, default: "" },
    type: { type: String, default: "" },
    assignmentGroup: { type: String, default: "" },
    shuttleAnswer: { type: Boolean, default: false },
    timeLimit: { type: Number, default: 0 },
    multipleAttempts: { type: Boolean, default: false },
    showCorrectAnswer: { type: Boolean, default: false },
    accessCode: { type: String, default: "" },
    oneQuestion: { type: Boolean, default: false },
    webcamRequired: { type: Boolean, default: false },
    lockQuestions: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    from: { type: Date, default: Date.now },
    to: { type: Date, default: Date.now },
    due: { type: Date, default: Date.now },
    points: { type: Number, default: 100 },
    questions: { type: [questionSchema], default: [] },
    course: { type: String, ref: "CourseModel", required: true, default: "" },
  },
  { collection: "quizzes" }
);

export default quizSchema;
