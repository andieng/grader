import express from "express";
import { isAdmin, isVerified } from "../middlewares/checkAuth";
import { getProfile, getAccounts } from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.use(isAdmin, isVerified);
adminRouter.get("/", getProfile);

adminRouter.get("/accounts", getAccounts);

export default adminRouter;
