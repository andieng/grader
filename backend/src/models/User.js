import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class User extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: "users_user_id_key",
      field: 'user_id'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "users_email_key"
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "https:\/\/firebasestorage.googleapis.com\/v0\/b\/grader-be3d5.appspot.com\/o\/avatar.png?alt=media&token=2df39de2-1989-41ef-8d30-983511171cfd"
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'updated_at'
    },
    studentId: {
      type: DataTypes.TEXT,
      allowNull: true,
      unique: "users_student_id_key",
      field: 'student_id'
    },
    isBanned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      field: 'is_banned'
    }
  }, {
    sequelize,
    tableName: 'users',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "users_email_key",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "users_student_id_key",
        unique: true,
        fields: [
          { name: "student_id" },
        ]
      },
      {
        name: "users_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
