import express from "express";
import { getProfile } from "../controllers/adminController";
import { isAdmin, isVerified } from "../middlewares/checkAuth";

const adminRouter = express.Router();

adminRouter.use(isAdmin, isVerified);
adminRouter.get("/", getProfile);

export default adminRouter;
