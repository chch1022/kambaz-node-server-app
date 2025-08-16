import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import { quizScoresModel } from "./QuizScores/model.js";

export function findQuizzesForCourse(courseId) {
  return model.find({ course: courseId });
}

export async function findQuizzesForUserInCourse(userID, courseID) {
  return quizScoresModel.find({ userID, courseID })
}

export function addQuiz(quiz) {
  return model.create(quiz)
}

export function updateQuiz(quizId, quizUpdates) {
  const { _id, ...updates } = quizUpdates
  console.log(updates)
  return model.updateOne({ _id: quizId }, { $set: updates })
}

export function deleteQuiz(quizId) {
  return model.deleteOne({ _id: quizId })
}

export function takeQuiz(quiz) {
  console.log("TAKE QUIZ DAO")
  return quizScoresModel.create(quiz)
}