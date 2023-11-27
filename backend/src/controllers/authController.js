import bcrypt from "bcrypt";
import {
  ERROR_INVALID_INPUT,
  ERROR_WRONG_CREDENTIALS,
  ERROR_BAD_REQUEST,
} from "../constants";
import { User } from "../models";
import { genAccessToken, genRefreshToken } from "../helpers/authHelper";

const signup = async (req, res) => {};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  console.log(user, password, await bcrypt.compare(password, user.password));
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error(ERROR_WRONG_CREDENTIALS);
  }

  const refreshToken = genRefreshToken({ id: user.id });
  await user.update({ refreshToken });

  return res.json({
    accessToken: genAccessToken({ id: user.id }),
    refreshToken: refreshToken,
  });
};

// const login = async (req, res) => {
//   const { email, password } = req.body;
//   const data = {
//     grant_type: "password",
//     username: email,
//     password,
//     client_id: process.env.AUTH0_CLIENT_ID,
//     client_secret: process.env.AUTH0_CLIENT_SECRET,
//   };
//   const oauthRes = await axios.post(
//     `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
//     data,
//     {
//       headers: {
//         "content-type": "application/x-www-form-urlencoded",
//       },
//     }
//   );
//   console.log(oauthRes.data);
//   // auth0Client.client.userInfo(oauthRes.data.access_token, function (err, user) {
//   //   console.log(user);
//   // });
//   const userRes = await axios.get(
//     `https://${process.env.AUTH0_DOMAIN}/userinfo`,
//     {
//       params: {
//         access_token: oauthRes.data.access_token,
//       },
//     }
//   );
//   console.log(userRes.data);

//   return res.json({ hi: "hi" });
// };

const logout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      throw new Error(ERROR_BAD_REQUEST);
    }
    return res.redirect("/");
  });
};

const validateSignupInput = (req, res, next) => {
  if (
    req.body?.fullName &&
    req.body?.email &&
    req.body?.password &&
    req.body?.tel
  ) {
    return next();
  }
  res.status(400);
  throw new Error(ERROR_INVALID_INPUT);
};

const validateLoginInput = (req, res, next) => {
  if (req.body?.email && req.body?.password) {
    return next();
  }
  res.status(400);
  throw new Error(ERROR_INVALID_INPUT);
};

export { signup, login, validateLoginInput, validateSignupInput, logout };
