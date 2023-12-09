import {
  CLAIMS_EMAIL,
  CLAIMS_EMAIL_VERIFIED,
  CLAIMS_ROLES,
  ERROR_EMAIL_MUST_BE_VERIFIED,
  ERROR_NOT_AUTHORIZED,
  ERROR_USER_NOT_EXIST,
} from "../constants";
import { User } from "../models";

const isAdmin = async (req, res, next) => {
  if (req.auth.payload[CLAIMS_ROLES].includes("admin")) {
    req.email = req.auth.payload[CLAIMS_EMAIL];
    return next();
  }
  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

const isUser = async (req, res, next) => {
  if (req.auth.payload[CLAIMS_ROLES].includes("admin")) {
    res.status(403);
    throw new Error(ERROR_NOT_AUTHORIZED);
  }
  req.email = req.auth.payload[CLAIMS_EMAIL];
  return next();
};

const isVerified = async (req, res, next) => {
  if (!req.auth.payload[CLAIMS_EMAIL_VERIFIED]) {
    res.status(403);
    throw new Error(ERROR_EMAIL_MUST_BE_VERIFIED);
  }

  return next();
};

const saveUserInfo = async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.auth.payload[CLAIMS_EMAIL] },
  });
  if (!user) {
    res.status(500);
    throw new Error(ERROR_USER_NOT_EXIST);
  }
  req.user = user;
  if (req.auth.payload[CLAIMS_ROLES].includes("admin")) {
    req.user.role = "admin";
  } else {
    req.user.role = "user";
  }

  return next();
};

export { isAdmin, isUser, isVerified, saveUserInfo };