import express from "express";
import { requiresAuth } from "express-openid-connect";
import { login, logout } from "../controllers/authController";

const authRouter = express.Router();

authRouter.get("/login", login);
authRouter.get("/logout", requiresAuth(), logout);

export default authRouter;
