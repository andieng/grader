const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.path === "/login" || req.path === "/signup") {
      return res.redirect("/");
    }
    return next();
  } else {
    if (req.path === "/login" || req.path === "/signup") {
      return next();
    }
    return res.redirect("/login");
  }
};

export default checkAuthentication;
