import SequelizeAuto from "sequelize-auto";
import pg from "pg";
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
