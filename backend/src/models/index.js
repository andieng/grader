import { Sequelize, DataTypes } from "sequelize";
import pg from "pg";
import initUser from "./userModel";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
  dialectModule: pg,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Sequelize connected");
  })
  .catch((err) => {
    console.error(err);
  });

const User = initUser(sequelize, DataTypes);

export { sequelize, User };
