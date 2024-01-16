import express from "express";
import { isAdmin, isBanned, isVerified } from "../middlewares/checkAuth";
import { saveUserInfo } from "../middlewares/saveData";
import {
  getProfile,
  getAccounts,
  updateAccount,
} from "../controllers/adminController";

const adminRouter = express.Router();

adminRouter.use(isVerified, isAdmin, saveUserInfo, isBanned);
adminRouter.get("/", getProfile);
adminRouter.get("/accounts", getAccounts);
adminRouter.put("/accounts/:id", updateAccount);

export default adminRouter;
