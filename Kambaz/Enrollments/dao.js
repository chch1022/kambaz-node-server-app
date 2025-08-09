import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";


export function enrollUserInCourse(userId, courseId) {
  const { enrollments } = Database;
  enrollments.push({ _id: uuidv4(), user: userId, course: courseId });
}

export function findAllEnrollments() {
  return Database.enrollments;
}

export function findEnrollmentsByUserId(userId) {
  const { enrollments } = Database;
  return enrollments.filter(enrollment => enrollment.user === userId);
}

export function findEnrollmentByUserAndCourse(userId, courseId) {
  const { enrollments } = Database;
  return enrollments.find(enrollment => 
    enrollment.user === userId && enrollment.course === courseId
  );
}

export function deleteEnrollmentByUserAndCourse(userId, courseId) {
  const { enrollments } = Database;
  const index = enrollments.findIndex(enrollment => 
    enrollment.user === userId && enrollment.course === courseId
  );
  if (index !== -1) {
    return enrollments.splice(index, 1)[0];
  }
  return null;
}