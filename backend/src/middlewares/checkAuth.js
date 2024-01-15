import {
  CLAIM_EMAIL,
  CLAIM_EMAIL_VERIFIED,
  CLAIM_ROLES,
  ERROR_EMAIL_MUST_BE_VERIFIED,
  ERROR_NOT_AUTHORIZED,
  ERROR_THIS_ACCOUNT_HAS_BEEN_BANNED,
} from "../constants";

export const isAdmin = async (req, res, next) => {
  if (req.auth.payload[CLAIM_ROLES].includes("admin")) {
    req.email = req.auth.payload[CLAIM_EMAIL];
    return next();
  }
  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

export const isUser = async (req, res, next) => {
  if (req.auth.payload[CLAIM_ROLES].includes("admin")) {
    res.status(403);
    throw new Error(ERROR_NOT_AUTHORIZED);
  }
  req.email = req.auth.payload[CLAIM_EMAIL];
  return next();
};

export const isVerified = async (req, res, next) => {
  if (!req.auth.payload[CLAIM_EMAIL_VERIFIED]) {
    res.status(403);
    throw new Error(ERROR_EMAIL_MUST_BE_VERIFIED);
  }
  return next();
};

export const isBanned = async (req, res, next) => {
  if (req.user.isBanned) {
    res.status(401);
    throw new Error(ERROR_THIS_ACCOUNT_HAS_BEEN_BANNED);
  }
  return next();
};
