import Database from "../Database/index.js";
import model from "./model.js"; 
import { v4 as uuidv4 } from "uuid";

export function findModulesForCourse(courseId) {
 return model.find({ course: courseId });
}

export function createModule(module) {
  const newModule = { ...module, _id: uuidv4() };
  Database.modules = [...Database.modules, newModule];
  return newModule;
}
export function deleteModule(moduleId) {
 const { modules } = Database;
 Database.modules = modules.filter((module) => module._id !== moduleId);
}
export function updateModule(moduleId, moduleUpdates) {
  return model.updateOne({ _id: moduleId }, moduleUpdates);
}

