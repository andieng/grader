import { ERROR_EMAIL_MUST_BE_VERIFIED } from "../constants";

const checkVerified = (req, res, next) => {
  if (req.oidc.user?.email_verified) {
    return next();
  } else {
    res.status(403);
    throw new Error(ERROR_EMAIL_MUST_BE_VERIFIED);
  }
};

export default checkVerified;
