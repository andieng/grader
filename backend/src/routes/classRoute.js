import express from "express";
import {
  createClass,
  getClasses,
  getClassDetails,
  addMemberToClass,
  inviteMember,
  getClassMembers,
} from "../controllers/classController";
import { isVerified } from "../middlewares/checkAuth";
import { saveUserInfo, saveClassMember } from "../middlewares/saveData";

const classRouter = express.Router();

classRouter.use(isVerified);
classRouter.get("/", saveUserInfo, getClasses);
classRouter.post("/create", saveUserInfo, createClass);

classRouter.get("/:classId", saveUserInfo, saveClassMember, getClassDetails);
classRouter.get("/:classId/members", saveUserInfo, getClassMembers);
classRouter.post("/:classId/members", saveUserInfo, addMemberToClass);
classRouter.post(
  "/:classId/invitations",
  saveUserInfo,
  saveClassMember,
  inviteMember
);

export default classRouter;
