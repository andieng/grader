import express from "express";
import {
  createClass,
  getClasses,
  getClassDetails,
  addMemberToClass,
  inviteMember,
  getClassMembers,
  addAssignment,
  upsertGradesByJson,
  upsertGradesByFile,
  upsertStudentMapping,
  mapStudent,
  getAssignments,
} from "../controllers/classController";
import { isVerified } from "../middlewares/checkAuth";
import { saveUserInfo } from "../middlewares/saveData";

const classRouter = express.Router();

classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/create", createClass);

classRouter.get("/:classId/details", getClassDetails);
classRouter.get("/:classId/members", getClassMembers);
classRouter.post("/:classId/members", addMemberToClass);
classRouter.post("/:classId/invitations", inviteMember);

classRouter.post("/:classId/student-mapping", upsertStudentMapping);
classRouter.post("/:classId/student-mapping/:studentId", mapStudent);

// TODO: require teacher role in assignments routes
classRouter.get("/:classId/assignments", getAssignments);
classRouter.post("/:classId/assignments", addAssignment);

classRouter.post(
  "/:classId/assignments/:assignmentId/grades/upload",
  upsertGradesByFile
);
classRouter.post(
  "/:classId/assignments/:assignmentId/grades",
  upsertGradesByJson
);

export default classRouter;
