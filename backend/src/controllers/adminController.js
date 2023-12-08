import { CLAIMS_EMAIL } from "../constants";
import { User } from "../models";

const getProfile = async (req, res) => {
  const email = req.auth.payload[CLAIMS_EMAIL];
  const user = await User.findOne({
    where: { email },
  });

  if (!user) {
    res.status(400);
    throw new Error(ERROR_USER_NOT_EXIST);
  }

  return res.json({ user });
};

export { getProfile };
