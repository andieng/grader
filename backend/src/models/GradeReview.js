import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class GradeReview extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    gradeReviewId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'grade_review_id'
    },
    currentGrade: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'current_grade'
    },
    expectedGrade: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      field: 'expected_grade'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    studentUserId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'student_user_id'
    },
    studentExplanation: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'student_explanation'
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
    classId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'classes',
        key: 'class_id'
      },
      field: 'class_id'
    }
  }, {
    sequelize,
    tableName: 'grade_reviews',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "grade_reviews_pkey",
        unique: true,
        fields: [
          { name: "grade_review_id" },
        ]
      },
    ]
  });
  }
}
