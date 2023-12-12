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
    gradePublicationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'grade_publications',
        key: 'grade_publication_id'
      },
      field: 'grade_publication_id'
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    studentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'student_id'
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'teacher_id'
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
