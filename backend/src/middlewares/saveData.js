import { User } from "../models";
import { CLAIM_EMAIL, CLAIM_ROLES, ERROR_USER_NOT_EXIST } from "../constants";

export const saveUserInfo = async (req, res, next) => {
  const user = await User.findOne({
    where: { email: req.auth.payload[CLAIM_EMAIL] },
  });
  if (!user) {
    res.status(500);
    throw new Error(ERROR_USER_NOT_EXIST);
  }
  req.user = user;
  if (req.auth.payload[CLAIM_ROLES].includes("admin")) {
    req.user.role = "admin";
  } else {
    req.user.role = "user";
  }

  return next();
};
