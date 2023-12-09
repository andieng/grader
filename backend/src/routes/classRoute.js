import express from "express";
import {
  createClass,
  getClasses,
  getClassDetails,
  addMemberToClass,
  inviteMember,
} from "../controllers/classController";
import { isVerified, saveUserInfo } from "../middlewares/checkAuth";

const classRouter = express.Router();

classRouter.use(isVerified, saveUserInfo);
classRouter.get("/", getClasses);
classRouter.post("/create", createClass);

classRouter.get("/:classId", getClassDetails);
classRouter.post("/:classId/members", addMemberToClass);
classRouter.post("/:classId/invitations", inviteMember);

export default classRouter;
