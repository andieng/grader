import express from "express";
import { requiresAuth } from "express-openid-connect";
import { getProfile } from "../controllers/userController";
import checkVerified from "../middlewares/checkVerified";

const userRouter = express.Router();

userRouter.use(requiresAuth(), checkVerified);
userRouter.get("/", getProfile);

export default userRouter;
