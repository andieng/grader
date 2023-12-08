import { CLAIMS_ROLES, ERROR_NOT_AUTHORIZED } from "../constants";

const isAdmin = async (req, res, next) => {
  const roles = req.auth.payload[CLAIMS_ROLES];
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] === "admin") return next();
  }

  res.status(403);
  throw new Error(ERROR_NOT_AUTHORIZED);
};

const isUser = async (req, res, next) => {
  const roles = req.auth.payload[CLAIMS_ROLES];
  console.log(roles);
  for (let i = 0; i < roles.length; i++) {
    if (roles[i] === "admin") {
      console.log("isadmin");
      res.status(403);
      throw new Error(ERROR_NOT_AUTHORIZED);
    }
  }

  return next();
};

export { isAdmin, isUser };
