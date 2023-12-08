import express from "express";
import { getProfile } from "../controllers/adminController";
import { isAdmin } from "../middlewares/checkRole";

const adminRouter = express.Router();

adminRouter.use(isAdmin);
adminRouter.get("/", getProfile);

export default adminRouter;
