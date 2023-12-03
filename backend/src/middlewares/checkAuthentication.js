import jwt from "jsonwebtoken";
import { CLAIMS_EMAIL, ERROR_NOT_AUTHENTICATED } from "../constants";
import { getPublicKey, getToken } from "../helpers/authHelper";
import { User } from "../models";

const checkAuthentication = async (req, res, next) => {
  const token = getToken(req.headers.authorization);
  if (!token) {
    res.status(401);
    throw new Error(ERROR_NOT_AUTHENTICATED);
  }
  const publicKey = await getPublicKey(token);

  const decoded = jwt.verify(token, publicKey, {
    algorithms: "RS256",
  });

  const user = await User.findOne({
    where: { email: decoded[CLAIMS_EMAIL] },
  });

  return res.json({ user });
};

export default checkAuthentication;
