import { User, Assignment } from "../models";
import {
  CLAIM_EMAIL,
  CLAIM_ROLES,
  ERROR_USER_NOT_EXIST,
  ERROR_ASSIGNMENT_NOT_FOUND,
} from "../constants";

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

export const saveAssignment = async (req, res, next) => {
  const { assignmentId } = req.params;
  const assignment = await Assignment.findByPk(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error(ERROR_ASSIGNMENT_NOT_FOUND);
  }
  req.assignment = assignment;
  return next();
};
