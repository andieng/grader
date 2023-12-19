import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Assignment extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'assignment_id'
    },
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'class_id'
      },
      field: 'class_id'
    },
    assignmentName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'assignment_name'
    },
    assignmentGradeScale: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'assignment_grade_scale'
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
    tableName: 'assignments',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "assignments_pkey",
        unique: true,
        fields: [
          { name: "assignment_id" },
        ]
      },
    ]
  });
  }
}
