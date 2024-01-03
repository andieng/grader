import "express-async-errors";
import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import { auth } from "express-oauth2-jwt-bearer";
import userRouter from "./routes/userRoute";
import adminRouter from "./routes/adminRoute";
import classRouter from "./routes/classRoute";

const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Routes
app.use("/api", jwtCheck);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/classes", classRouter);

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
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
