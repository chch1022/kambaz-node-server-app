import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

export function findAllCourses() {
  return Database.courses;
}

export function findCoursesForEnrolledUser(userId) {
  const { courses, enrollments } = Database;
  
  console.log("Finding courses for userId:", userId);
  console.log("Available enrollments:", enrollments);
  console.log("Available courses:", courses.map(c => ({id: c._id, name: c.name})));
  
  const enrolledCourses = courses.filter((course) => {
    const isEnrolled = enrollments.some((enrollment) => {
      const match = enrollment.user === userId && enrollment.course === course._id;
      console.log(`Checking enrollment: user ${enrollment.user} === ${userId} && course ${enrollment.course} === ${course._id} = ${match}`);
      return match;
    });
    return isEnrolled;
  });
  
  console.log("Enrolled courses found:", enrolledCourses);
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