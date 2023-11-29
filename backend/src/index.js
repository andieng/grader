import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { auth } from "express-openid-connect";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import auth0Config from "./config/auth0";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(auth0Config));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.json({ message: `Hello ${req.oidc.user.name}` });
  } else {
    res.json({ message: `Log out` });
  }
});

// Custom error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  const status = res.statusCode || 500;
  console.error(err);
  res.status(status).json({
    error: err.message,
  });
});

export default app;
