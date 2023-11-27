import bcrypt from "bcrypt";
import {
  ERROR_INVALID_INPUT,
  ERROR_WRONG_CREDENTIALS,
  ERROR_BAD_REQUEST,
} from "../constants";
import { User } from "../models";

const signup = async (req, res) => {};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user?.password))) {
    res.status(400);
    throw new Error(ERROR_WRONG_CREDENTIALS);
  }

  const refreshToken = genRefreshToken({ id: user.id });
  await user.update({ refreshToken });

  return res.json({
    accessToken: genAccessToken({ id: user.id }),
    refreshToken: refreshToken,
  });
};

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      throw new Error(ERROR_BAD_REQUEST);
    }
    return res.redirect("/");
  });
};

const validateSignupInput = (req, res, next) => {
  if (
    req.body?.fullName &&
    req.body?.email &&
    req.body?.password &&
    req.body?.tel
  ) {
    return next();
  }
  res.status(400);
  throw new Error(ERROR_INVALID_INPUT);
};

const validateLoginInput = (req, res, next) => {
  if (req.body?.email && req.body?.password) {
    return next();
  }
  res.status(400);
  throw new Error(ERROR_INVALID_INPUT);
};

export { signup, login, validateLoginInput, validateSignupInput, logout };
