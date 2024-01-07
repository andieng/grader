import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class StudentMapping extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'classes',
        key: 'class_id'
      },
      field: 'class_id'
    },
    studentId: {
      type: DataTypes.TEXT,
      allowNull: false,
      primaryKey: true,
      field: 'student_id'
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'full_name'
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
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      unique: "student_mapping_user_id_key",
      field: 'user_id'
    }
  }, {
    sequelize,
    tableName: 'student_mapping',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "student_mapping_pkey",
        unique: true,
        fields: [
          { name: "class_id" },
          { name: "student_id" },
        ]
      },
      {
        name: "student_mapping_user_id_key",
        unique: true,
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
  }
}
