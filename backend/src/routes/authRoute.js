import express from "express";
import passport from "passport";
import { signup, login, logout } from "../controllers/authController";
import checkAuthentication from "../middlewares/checkAuthentication";

const authRouter = express.Router();

authRouter.use(checkAuthentication);

authRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
  })
);

authRouter.post("/signup", signup);
authRouter.post("/logout", logout);

export default authRouter;
