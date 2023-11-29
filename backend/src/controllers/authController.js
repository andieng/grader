import { ERROR_BAD_REQUEST, MSG_LOG_OUT_SUCCESSFULLY } from "../constants";

const login = async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect("/");
  }

  res.oidc.login({
    returnTo: "/",
    authorizationParams: {
      redirect_uri: process.env.CALLBACK_URI,
    },
  });
};

const logout = (req, res) => {
  res.oidc.logout({
    returnTo: "/",
  });
};

export { login, logout };
