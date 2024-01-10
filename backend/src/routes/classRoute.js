import express from "express";
import { isVerified } from "../middlewares/checkAuth";
import { saveUserInfo, saveAssignment } from "../middlewares/saveData";
import {
  createClass,
  getClasses,
  getClassDetails,
  addMemberToClass,
  inviteMember,
  getClassMembers,
  upsertStudentMapping,
  joinClassByClassCode,
  checkClassRole,
  checkTeacherRole,
  mapStudent,
  getStudentMappingList,
} from "../controllers/classController";
import {
  addAssignment,
  getAssignmentList,
  updateAssignmentList,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController";
import {
  upsertGradesByJson,
  upsertGradesByFile,
  getClassGrades,
} from "../controllers/gradeController";
import {
  addGradeReview,
  addGradeReviewComment,
  getGradeReview,
  getGradeReviewList,
  updateGradeReview,
} from "../controllers/gradeReviewController";

const classRouter = express.Router();

// Class routes
classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/", createClass);
classRouter.post("/join", joinClassByClassCode);
classRouter.get("/:classId", getClassDetails);

// Class member routes
classRouter.get("/:classId/members", getClassMembers);
classRouter.post("/:classId/members", addMemberToClass);

// Invitation routes
classRouter.post("/:classId/invitations", inviteMember);

// Student mapping routes
classRouter.get(
  "/:classId/student-mapping",
  checkTeacherRole,
  getStudentMappingList
);
classRouter.post(
  "/:classId/student-mapping",
  checkTeacherRole,
  upsertStudentMapping
);
classRouter.post("/:classId/student-mapping/:studentId", mapStudent);

// Assignment routes
classRouter.get("/:classId/assignments", checkClassRole, getAssignmentList);
classRouter.post("/:classId/assignments", checkTeacherRole, addAssignment);
classRouter.put(
  "/:classId/assignments",
  checkTeacherRole,
  updateAssignmentList
);
classRouter.use(
  "/:classId/assignments/:assignmentId",
  checkTeacherRole,
  saveAssignment
);
classRouter.put("/:classId/assignments/:assignmentId", updateAssignment);
classRouter.delete("/:classId/assignments/:assignmentId", deleteAssignment);

// Grade routes
classRouter.get("/:classId/grades", getClassGrades);
classRouter.post(
  "/:classId/grades/upload",
  checkTeacherRole,
  upsertGradesByFile
);
classRouter.post("/:classId/grades", checkTeacherRole, upsertGradesByJson);

// Grade review routes
classRouter.get("/:classId/grade-reviews", checkClassRole, getGradeReviewList);
classRouter.post("/:classId/grade-reviews", checkClassRole, addGradeReview);
classRouter.get(
  "/:classId/grade-reviews/:gradeReviewId",
  checkClassRole,
  getGradeReview
);
classRouter.put(
  "/:classId/grade-reviews/:gradeReviewId",
  checkTeacherRole,
  updateGradeReview
);

// Grade review comment routes
classRouter.post(
  "/:classId/grade-reviews/:gradeReviewId/grade-review-comments",
  checkClassRole,
  addGradeReviewComment
);

export default classRouter;
