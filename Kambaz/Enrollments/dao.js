import db from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

let { enrollments } = db;

export const createEnrollment = (enrollment) => {
  const newEnrollment = { ...enrollment, _id: uuidv4() };
  enrollments = [...enrollments, newEnrollment];
  return newEnrollment;
};

export const findAllEnrollments = () => enrollments;

export const findEnrollmentById = (enrollmentId) => 
  enrollments.find((enrollment) => enrollment._id === enrollmentId);

export const findEnrollmentsByUserId = (userId) => 
  enrollments.filter((enrollment) => enrollment.userId === userId);

export const findEnrollmentByUserAndCourse = (userId, courseId) =>
  enrollments.find((enrollment) => 
    enrollment.userId === userId && enrollment.courseId === courseId
  );

export const updateEnrollment = (enrollmentId, enrollment) => 
  (enrollments = enrollments.map((e) => (e._id === enrollmentId ? enrollment : e)));

export const deleteEnrollment = (enrollmentId) => 
  (enrollments = enrollments.filter((e) => e._id !== enrollmentId));

export const deleteEnrollmentByUserAndCourse = (userId, courseId) => {
  const enrollment = findEnrollmentByUserAndCourse(userId, courseId);
  if (enrollment) {
    enrollments = enrollments.filter((e) => e._id !== enrollment._id);
    return enrollment;
  }
  return null;
};

export const deleteEnrollmentsByUserId = (userId) => {
  const userEnrollments = findEnrollmentsByUserId(userId);
  enrollments = enrollments.filter((e) => e.userId !== userId);
  return userEnrollments;
};