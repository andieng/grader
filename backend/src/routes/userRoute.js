import express from "express";
import { getProfile } from "../controllers/userController";
import { isUser } from "../middlewares/checkAuth";

const userRouter = express.Router();

userRouter.use(isUser);
userRouter.get("/", getProfile);

export default userRouter;
