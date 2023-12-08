import express from "express";
import {
  getProfile,
  createClass,
  getClasses,
  getClassDetails,
} from "../controllers/userController";
import { isUser } from "../middlewares/checkRole";

const userRouter = express.Router();

userRouter.use(isUser);
userRouter.get("/", getProfile);
// userRouter.post("/create", createClass);
// userRouter.get("/classes", getClasses);

export default userRouter;
