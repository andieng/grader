import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import authRouter from "./routes/authRoute";
import userRouter from "./routes/userRoute";
import passportConfig from "./config/passport";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
passportConfig(passport);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.get("/", async (req, res) => {
  res.json({ msg: "Hello world!" });
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
