import bcrypt from "bcrypt";
import {
  ERROR_REQUIRE_ALL_FIELDS,
  ERROR_FULLNAME_NOT_EMPTY,
  ERROR_EMAIL_NOT_EMPTY,
  ERROR_PASSWORD_NOT_EMPTY,
  ERROR_TEL_NOT_EMPTY,
  SALT_ROUNDS,
} from "../constants";
import { User } from "../models";

const getProfile = async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "email", "role", "tel", "name"],
  });
  return res.json(user);
};

const validateProfile = (req, res, next) => {
  const profile = req.body;

  if (
    !profile.hasOwnProperty("fullName") ||
    !profile.hasOwnProperty("email") ||
    !profile.hasOwnProperty("tel") ||
    !profile.hasOwnProperty("sex") ||
    !profile.hasOwnProperty("address")
  ) {
    res.status(400);
    throw new Error(ERROR_REQUIRE_ALL_FIELDS);
  }

  if (!profile.fullName) {
    res.status(400);
    throw new Error(ERROR_FULLNAME_NOT_EMPTY);
  }

  if (!profile.email) {
    res.status(400);
    throw new Error(ERROR_EMAIL_NOT_EMPTY);
  }

  if (!profile.tel) {
    res.status(400);
    throw new Error(ERROR_TEL_NOT_EMPTY);
  }

  next();
};

const editProfile = async (req, res) => {
  const profile = req.body;
  const user = await User.findByPk(req.user.id);

  await user.update({
    email: profile.email,
    fullName: profile.fullName,
    tel: profile.tel,
    sex: profile.sex,
    address: profile.address,
  });

  return res.json({
    email: user.email,
    fullName: user.fullName,
    tel: user.tel,
    sex: user.sex,
    address: user.address,
  });
};

export { getProfile, editProfile, validateProfile };
