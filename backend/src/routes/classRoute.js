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
  checkTeacherRole,
  mapStudent,
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

const classRouter = express.Router();

classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/", createClass);
classRouter.post("/join", joinClassByClassCode);

classRouter.get("/:classId/details", getClassDetails);
classRouter.get("/:classId/members", getClassMembers);
classRouter.post("/:classId/members", addMemberToClass);
classRouter.post("/:classId/invitations", inviteMember);

classRouter.post(
  "/:classId/student-mapping",
  checkTeacherRole,
  upsertStudentMapping
);
classRouter.post("/:classId/student-mapping/:studentId", mapStudent);

classRouter.use("/:classId/assignments", checkTeacherRole);
classRouter.get("/:classId/assignments", getAssignmentList);
classRouter.post("/:classId/assignments", addAssignment);
classRouter.put("/:classId/assignments", updateAssignmentList);

classRouter.use("/:classId/assignments/:assignmentId", saveAssignment);
classRouter.put("/:classId/assignments/:assignmentId", updateAssignment);
classRouter.delete("/:classId/assignments/:assignmentId", deleteAssignment);

classRouter.get("/:classId/grades", checkTeacherRole, getClassGrades);
classRouter.post(
  "/:classId/grades/upload",
  checkTeacherRole,
  upsertGradesByFile
);
classRouter.post("/:classId/grades", checkTeacherRole, upsertGradesByJson);

export default classRouter;
