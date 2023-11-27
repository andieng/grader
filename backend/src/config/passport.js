import { User } from "../models";
import passportJWT from "passport-jwt";

export default passport = (passport) => {
  const ExtractJwt = passportJWT.ExtractJwt;
  const JwtStrategy = passportJWT.Strategy;
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  };

  const strategy = new JwtStrategy(jwtOptions, async function (payload, next) {
    const user = await User.findByPk(payload.id);
    if (user) {
      next(null, {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        emailVerified: user.emailVerified,
      });
    } else {
      next(null, false);
    }
  });

  passport.use(strategy);
};
