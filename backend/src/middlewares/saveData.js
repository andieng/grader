import { User, Class } from "../models";

export const saveUserInfo = async (req, res, next) => {
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

export const saveClass = async (req, res, next) => {
  const { classId } = req.params;

  const findClass = await Class.findByPk(classId);
  if (!findClass) {
    res.status(400);
    throw new Error(ERROR_CLASS_NOT_FOUND);
  }

  req.class = findClass;
  return next();
};
