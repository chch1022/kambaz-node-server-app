import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments, users } = Database;
  const user = users.find(u => u._id === userId);
  
  // If user is faculty, show all courses (or courses they created)
  if (user && user.role === "FACULTY") {
    return courses; // Show all courses for faculty
    // Or if you want to show only courses they created:
    // return courses.filter(course => course.author === userId);
  }
  
  // For students, show only enrolled courses
  const enrolledCourses = courses.filter((course) =>
    enrollments.some((enrollment) => enrollment.user === userId && enrollment.course === course._id));
  return enrolledCourses;
}

export function createCourse(course) {
  const newCourse = { ...course, _id: uuidv4() };
  Database.courses = [...Database.courses, newCourse];
  return newCourse;
}

export function deleteCourse(courseId) {
  const { courses, enrollments } = Database;
  Database.courses = courses.filter((course) => course._id !== courseId);
  Database.enrollments = enrollments.filter(
    (enrollment) => enrollment.course !== courseId
  );
}

export function updateCourse(courseId, courseUpdates) {
  const { courses } = Database;
  const course = courses.find((course) => course._id === courseId);
  if (course) {
    Object.assign(course, courseUpdates);
    return course;
  }
  return null;
}