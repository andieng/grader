import { User } from "../models";

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
