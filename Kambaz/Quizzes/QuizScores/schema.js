import mongoose, { Schema } from "mongoose";


export const questionScoreSchema = new Schema({
  questionID: {
    type: String,
    ref: 'QuestionModel',
    required: true
  },
  score: {
    type: Number,
    required: true
  }
}, { collection: "questionScores" });

export const questionSchema = new Schema({
  _id: String,
  title: String,
  description: String,
  correctOption: Number,
  type: {
    type: String,
    enum: ["MULTIPLE-CHOICE", "TRUE-FALSE", "FILL-IN"],
    default: "MULTIPLE-CHOICE",
  },
  points: Number,
  answers: [String]
})

export const quizScoresSchema = new mongoose.Schema(
  {
    _id: String,
    quizID: { type: String, ref: "QuizModel", required: true },
    userID: { type: String, ref: "UserModel", required: true },
    questions: [questionScoreSchema],
    points: { type: Schema.Types.Number, required: true }
  },
  { collection: "quizScores" }
);