import { User } from "../models";

const getProfile = async (req, res) => {
  const user = await User.findOne({
    where: { email: req.email },
  });

  if (!user) {
    res.status(400);
    throw new Error(ERROR_USER_NOT_EXIST);
  }

  return res.json(user);
};

export { getProfile };
