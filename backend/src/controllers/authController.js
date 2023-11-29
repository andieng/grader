import { ERROR_BAD_REQUEST, MSG_LOG_OUT_SUCCESSFULLY } from "../constants";

const login = async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.json({ message: `Already logged in as ${req.oidc.user.email}` });
  }

  res.oidc.login({
    returnTo: "/",
    authorizationParams: {
      redirect_uri: process.env.CALLBACK_URI,
    },
  });
};

const logout = (req, res) => {
  res.oidc.logout(function (err) {
    if (err) {
      throw new Error(ERROR_BAD_REQUEST);
    }
    return res.json({ message: MSG_LOG_OUT_SUCCESSFULLY });
  });
};

export { login, logout };
