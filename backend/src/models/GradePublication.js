import _sequelize from "sequelize";
const { Model, Sequelize } = _sequelize;

export default class GradePublication extends Model {
  static init(sequelize, DataTypes) {
    return super.init(
      {
        gradePublicationId: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          field: "grade_publication_id",
        },
        assignmentId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "assignments",
            key: "assignment_id",
          },
          field: "assignment_id",
        },
        classId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "classes",
            key: "class_id",
          },
          field: "class_id",
        },
        teacherUserId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: "users",
            key: "id",
          },
          field: "teacher_user_id",
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn("now"),
          field: "created_at",
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.Sequelize.fn("now"),
          field: "updated_at",
        },
      },
      {
        sequelize,
        tableName: "grade_publications",
        schema: "public",
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: "grade_publications_pkey",
            unique: true,
            fields: [{ name: "grade_publication_id" }],
          },
        ],
      }
    );
  }
}
