import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class GradeReviewComment extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    gradeReviewCommentId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      references: {
        model: 'grade_reviews',
        key: 'grade_review_id'
      },
      field: 'grade_review_comment_id'
    },
    gradeReviewId: {
      type: DataTypes.UUID,
      allowNull: true,
      field: 'grade_review_id'
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'user_id'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
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
    tableName: 'grade_review_comments',
    schema: 'public',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "grade_review_comments_pkey",
        unique: true,
        fields: [
          { name: "grade_review_comment_id" },
        ]
      },
    ]
  });
  }
}
