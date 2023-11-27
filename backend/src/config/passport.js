import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { User } from "../models";
import { ERROR_WRONG_CREDENTIALS } from "../constants";

export default passport = (passport) => {
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findByPk(id)
      .then(function (user) {
        done(null, user);
      })
      .catch(function (err) {
        console.error(err);
      });
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      function (email, password, done) {
        User.findOne({
          where: {
            email,
          },
        })
          .then(function (user) {
            bcrypt.compare(password, user.password, function (err, result) {
              if (err) {
                return done(err);
              }
              if (!result) {
                return done(null, false, { message: ERROR_WRONG_CREDENTIALS });
              }
              return done(null, {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
              });
            });
          })
          .catch(function (err) {
            return done(err);
          });
      }
    )
  );
};
