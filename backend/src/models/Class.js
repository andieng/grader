import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Class extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    classId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'class_id'
    },
    className: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'class_name'
    },
    classPicture: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "https:\/\/firebasestorage.googleapis.com\/v0\/b\/grader-be3d5.appspot.com\/o\/class_picture.jpg?alt=media&token=d2e9d3ac-0d38-4e2c-a39c-c3dcc24dab3b",
      field: 'class_picture'
    },
    classInviteStudentLink: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'class_invite_student_link'
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
    }
  }, {
    sequelize,
    tableName: 'classes',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "classes_pkey",
        unique: true,
        fields: [
          { name: "class_id" },
        ]
      },
    ]
  });
  }
}
