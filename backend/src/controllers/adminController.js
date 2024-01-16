import {
  ERROR_INPUT_DATA_NOT_FOUND,
  ERROR_THIS_ACCOUNT_CANT_BE_BANNED,
  ERROR_USER_NOT_FOUND,
} from "../constants";
import { User } from "../models";
import {
  assignAdminRole,
  getAccessToken,
  removeAdminRole,
} from "../services/auth0";

export const getProfile = async (req, res) => {
  const email = req.email;
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    res.status(400);
    throw new Error(ERROR_USER_NOT_EXIST);
  }

  return res.json({ user });
};

export const getAccounts = async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
};

export const updateAccount = async (req, res) => {
  const { id } = req.params;
  const { studentId, role, isBanned } = req.body;

  if (!studentId && !role && (isBanned === null || isBanned === undefined)) {
    res.status(400);
    throw new Error(ERROR_INPUT_DATA_NOT_FOUND);
  }

  const user = await User.findByPk(id);
  if (!user) {
    res.status(404);
    throw new Error(ERROR_USER_NOT_FOUND);
  }

  if (studentId) {
    await user.update({
      studentId,
    });
  }
  if (isBanned) {
    if (id === req.user.id && req.user.email === process.env.ADMIN_USERNAME) {
      res.status(400);
      throw new Error(ERROR_THIS_ACCOUNT_CANT_BE_BANNED);
    }
    await user.update({ isBanned });
  }
  if (role) {
    if (role === "admin") {
      const accessToken = await getAccessToken();
      await assignAdminRole(user.userId, accessToken);
    } else if (role === "user") {
      const accessToken = await getAccessToken();
      await removeAdminRole(user.userId, accessToken);
    } else {
      res.status(400);
      throw new Error(ERROR_INVALID_ROLE);
    }
  }

  return res.json({ ...user, role: req.user.role });
};
