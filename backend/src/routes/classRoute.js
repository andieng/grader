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
import { saveUserInfo } from "../middlewares/saveData";

const classRouter = express.Router();

classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/create", createClass);

classRouter.get("/:classId/details", getClassDetails);
classRouter.get("/:classId/members", getClassMembers);
classRouter.post("/:classId/members", addMemberToClass);
classRouter.post("/:classId/invitations", inviteMember);

export default classRouter;
