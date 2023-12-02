import "express-async-errors";
import "dotenv/config";
import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoute";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRouter);

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
