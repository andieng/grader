import { CLAIMS_ROLES, ERROR_NOT_AUTHORIZED } from "../constants";

const isAdmin = async (req, res, next) => {
  if (req.auth.payload[CLAIMS_ROLES].includes("admin")) {
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
  return next();
};

export { isAdmin, isUser };
