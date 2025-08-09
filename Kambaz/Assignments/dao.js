import Database from "../Database/index.js";
import { v4 as uuidv4 } from "uuid";

// Get all assignments
export function findAllAssignments() {
  return Database.assignments;
}

// Get assignments for a specific course
export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  return assignments.filter((assignment) => assignment.course === courseId);
}

// Get assignments by type for a specific course
export function findAssignmentsByType(courseId, type) {
  const { assignments } = Database;
  return assignments.filter((assignment) => 
    assignment.course === courseId && assignment.type === type
  );
}

// Get upcoming assignments for a course (due date is in the future)
export function findUpcomingAssignments(courseId) {
  const { assignments } = Database;
  const now = new Date();
  return assignments.filter((assignment) => {
    if (assignment.course !== courseId) return false;
    
    // Handle various date formats in your data
    let dueDate;
    if (assignment.dueDate.includes('at')) {
      // Format like "May 13 at 11:59pm"
      dueDate = new Date(assignment.dueDate);
    } else {
      // Format like "May 15"
      dueDate = new Date(assignment.dueDate + " 11:59pm");
    }
    
    return dueDate > now;
  });
}

// Get assignments due within a specified number of days
export function findAssignmentsDueSoon(courseId, days = 7) {
  const { assignments } = Database;
  const now = new Date();
  const future = new Date();
  future.setDate(now.getDate() + days);
  
  return assignments.filter((assignment) => {
    if (assignment.course !== courseId) return false;
    
    let dueDate;
    if (assignment.dueDate.includes('at')) {
      dueDate = new Date(assignment.dueDate);
    } else {
      dueDate = new Date(assignment.dueDate + " 11:59pm");
    }
    
    return dueDate > now && dueDate <= future;
  });
}

// Get assignment by ID
export function findAssignmentById(assignmentId) {
  const { assignments } = Database;
  return assignments.find((assignment) => assignment._id === assignmentId);
}

// Create a new assignment
export function createAssignment(assignment) {
  const newAssignment = { 
    ...assignment, 
    _id: uuidv4(),
    // Set default available date if not provided
    availableDate: assignment.availableDate || new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
  };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

// Delete an assignment
export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
  return true;
}

// Update an assignment
export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find((assignment) => assignment._id === assignmentId);
  if (assignment) {
    Object.assign(assignment, assignmentUpdates);
    return assignment;
  }
  return null;
}

// Get assignments by course and sort by due date
export function findAssignmentsForCourseSorted(courseId, sortOrder = 'asc') {
  const assignments = findAssignmentsForCourse(courseId);
  return assignments.sort((a, b) => {
    const dateA = new Date(a.dueDate.includes('at') ? a.dueDate : a.dueDate + " 11:59pm");
    const dateB = new Date(b.dueDate.includes('at') ? b.dueDate : b.dueDate + " 11:59pm");
    
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });
}

// Get assignment statistics for a course
export function getAssignmentStats(courseId) {
  const assignments = findAssignmentsForCourse(courseId);
  const stats = {
    total: assignments.length,
    byType: {},
    totalPoints: 0,
    upcoming: 0
  };
  
  const now = new Date();
  
  assignments.forEach(assignment => {
    // Count by type
    stats.byType[assignment.type] = (stats.byType[assignment.type] || 0) + 1;
    
    // Sum total points
    stats.totalPoints += assignment.points;
    
    // Count upcoming assignments
    const dueDate = new Date(assignment.dueDate.includes('at') ? assignment.dueDate : assignment.dueDate + " 11:59pm");
    if (dueDate > now) {
      stats.upcoming++;
    }
  });
  
  return stats;
}