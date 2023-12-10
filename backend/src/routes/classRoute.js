import express from "express";
import {
  createClass,
  getClasses,
  getClassDetails,
  addMemberToClass,
  inviteMember,
  getClassMembers,
  saveClass,
} from "../controllers/classController";
import { isVerified, saveUserInfo } from "../middlewares/checkAuth";

const classRouter = express.Router();

classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/create", createClass);

classRouter.use("/:classId", saveClass);
classRouter.get("/:classId", getClassDetails);
classRouter.get("/:classId/members", getClassMembers);
classRouter.post("/:classId/members", addMemberToClass);
classRouter.post("/:classId/invitations", inviteMember);

export default classRouter;
