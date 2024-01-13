import _sequelize from "sequelize";
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
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,
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
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'classes',
          key: 'class_id'
        },
        field: 'class_id'
      }
    }, {
      sequelize,
      tableName: 'grades',
      schema: 'public',
      hasTrigger: true,
      timestamps: false,
      indexes: [
      {
        assignmentId: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          field: "assignment_id",
        },
        studentId: {
          type: DataTypes.TEXT,
          allowNull: false,
          primaryKey: true,
          field: "student_id",
        },
        gradeValue: {
          type: DataTypes.DECIMAL,
          allowNull: true,
          field: "grade_value",
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
        classId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "classes",
            key: "class_id",
          },
          field: "class_id",
        },
      },
      {
        sequelize,
        tableName: "grades",
        schema: "public",
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: "grades_pkey",
            unique: true,
            fields: [{ name: "assignment_id" }, { name: "student_id" }],
          },
        ],
      }
    );
  }
}
