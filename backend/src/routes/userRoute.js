import express from "express";
import passport from "passport";
import {
  editProfile,
  getProfile,
  validateProfile,
} from "../controllers/userController";
import checkVerified from "../middlewares/checkVerified";

const userRouter = express.Router();

userRouter.use(
  passport.authenticate("jwt", {
    session: false,
    failureRedirect: "/login",
  }),
  checkVerified
);

userRouter.get("/profile", getProfile);
userRouter.put("/profile/edit", validateProfile, editProfile);

export default userRouter;
