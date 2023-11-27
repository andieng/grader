const checkVerified = (req, res, next) => {
  if (req.user.emailVerified) {
    return next(null, req.user);
  } else {
    return res.redirect("/verify");
  }
};

export default checkVerified;
