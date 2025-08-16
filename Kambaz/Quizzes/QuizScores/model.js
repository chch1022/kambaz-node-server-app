import mongoose from "mongoose";
import { questionSchema, questionScoreSchema, quizScoresSchema } from "./schema.js";
export const questionModel = mongoose.model("QuestionModel", questionSchema);
export const questionScoreModel = mongoose.model("QuestionScoreModel", questionScoreSchema);
export const quizScoresModel = mongoose.model("QuizScoresModel", quizScoresSchema);
