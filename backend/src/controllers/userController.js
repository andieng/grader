import { User } from "../models";

const getProfile = async (req, res) => {
  const user = await User.findOne({ where: { email: req.oidc.user.email } });
  return res.json(user);
};

export { getProfile };
