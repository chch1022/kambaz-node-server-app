import * as dao from "./dao.js";
import { v4 as uuid } from "uuid";

export default function QuizRoutes(app) {
  const getQuizzesForCourse = async (req, res) => {
    const { cid } = req.params;
    const quizzes = await dao.findQuizzesForCourse(cid);
    res.json(quizzes);
  };

  const createQuiz = async (req, res) => {
    const currentUser = req.session["currentUser"];
    console.log("CREATING QUIZ", req.body, currentUser)
    if (!currentUser) {
      res.status(400).send(req.session);
      return
    }
    const quiz = req.body;
    const status = await dao.addQuiz({ _id: uuid(), ...quiz });
    res.send(status)
  }

  const deleteQuiz = async (req, res) => {
    const { qid } = req.params;
    await dao.deleteQuiz(qid)
    res.send(200)
  }

  const updateQuiz = async (req, res) => {
    const { qid } = req.params;
    const data = await dao.updateQuiz(qid, req.body);

    res.json(data);
  }

  const takeQuiz = async (req, res) => {
    const { qid } = req.params;
    const { questions, points } = req.body;
    const currentUser = req.session["currentUser"];
    console.log("TAKE QUIZ ROUTE", currentUser)
    if (!currentUser || currentUser.role !== "STUDENT") {
      res.status(400).send(req.session);
      return
    }
    const quiz = {
      _id: uuid(),
      quizID: qid,
      userID: currentUser._id,
      questions,
      points
    }
    const result = dao.takeQuiz(quiz);
    res.send(result);
  }

  app.get("/api/quizzes/courses/:cid", getQuizzesForCourse);
  app.post("/api/quizzes", createQuiz);
  app.delete("/api/quizzes/:qid", deleteQuiz)
  app.put("/api/quizzes/:qid", updateQuiz)
  app.post("/api/quizzes/:qid", takeQuiz)
}
