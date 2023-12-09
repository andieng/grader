import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class GradePublication extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    gradePublicationId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: 'grade_publication_id'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
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
    publisherId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'publisher_id'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('now'),
      field: 'created_at'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'grade_publications',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "grade_publications_pkey",
        unique: true,
        fields: [
          { name: "grade_publication_id" },
        ]
      },
    ]
  });
  }
}
