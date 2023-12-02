import express from "express";
import { getProfile } from "../controllers/userController";
import checkAuthentication from "../middlewares/checkAuthentication";

const userRouter = express.Router();

userRouter.use(checkAuthentication);
userRouter.get("/", getProfile);

export default userRouter;
