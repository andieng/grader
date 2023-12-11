import { User, Class, ClassMember } from "../models";
import {
  CLAIM_EMAIL,
  CLAIM_ROLES,
  ERROR_CLASS_NOT_FOUND,
  ERROR_USER_NOT_EXIST,
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

export const saveClassMember = async (req, res, next) => {
  const { classId } = req.params;

  const findClassMember = await ClassMember.findOne({
    where: {
      memberId: req.user.id,
      classId,
    },
    include: {
      model: Class,
      as: "class",
      required: true,
    },
  });
  console.log(findClassMember);

  if (!findClassMember) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  req.classMember = findClassMember;
  return next();
};
