import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Grade extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    assignmentId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'assignments',
        key: 'assignment_id'
      },
      field: 'assignment_id'
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'student_id'
    },
    gradeValue: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'grade_value'
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
    tableName: 'grades',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "grades_pkey",
        unique: true,
        fields: [
          { name: "assignment_id" },
          { name: "student_id" },
        ]
      },
    ]
  });
  }
}
