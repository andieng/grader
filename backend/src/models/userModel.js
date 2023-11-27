const initUser = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        field: "email_verified",
        default: false,
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        default: "user",
      },
      name: {
        type: DataTypes.STRING,
      },
      tel: {
        type: DataTypes.STRING,
      },
      nickname: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.TEXT,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      timestamps: false,
    }
  );

  return User;
};

export default initUser;
