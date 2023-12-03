import jwt from "jsonwebtoken";
import { CLAIMS_EMAIL, ERROR_NOT_AUTHENTICATED } from "../constants";
import { getPublicKey, getToken } from "../helpers/authHelper";

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

  req.email = decoded[CLAIMS_EMAIL];
  next();
};

export default checkAuthentication;
