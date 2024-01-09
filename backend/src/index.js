// import "express-async-errors";
// import "dotenv/config";
// import express from "express";
// import fileUpload from "express-fileupload";
// import cors from "cors";
// import { auth } from "express-oauth2-jwt-bearer";
// import userRouter from "./routes/userRoute";
// import adminRouter from "./routes/adminRoute";
// import classRouter from "./routes/classRoute";

// const jwtCheck = auth({
//   audience: process.env.AUTH0_AUDIENCE,
//   issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
// });

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(fileUpload());

// // Routes
// app.use("/api", jwtCheck);
// app.use("/api/user", userRouter);
// app.use("/api/admin", adminRouter);
// app.use("/api/classes", classRouter);

// app.get("/", (req, res) => {
//   res.json({ msg: "Hello World!" });
// });

// // Custom error handler
// app.use((err, req, res, next) => {
//   if (res.headersSent) {
//     return next(err);
//   }
//   const status = res.statusCode || 500;
//   console.error(err);
//   res.status(status).json({
//     error: err.message,
//     status,
//   });
// });

// export default app;

import SequelizeAuto from "sequelize-auto";
import pg from "pg";
import "dotenv/config";

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD } = process.env;
const auto = new SequelizeAuto(PGDATABASE, PGUSER, PGPASSWORD, {
  host: PGHOST,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  dialectModule: pg,
  directory: "./src/models",
  port: "5432",
  caseModel: "p",
  caseFile: "p",
  caseProp: "c",
  ssl: true,
  singularize: true,
  additional: {
    timestamps: false,
  },
  lang: "esm",
});

auto.run().then((data) => {
  console.log(data.tables); // table and field list
});
