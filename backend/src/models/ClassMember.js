import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class ClassMember extends Model {
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
    memberId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id'
      },
      field: 'member_id'
    },
    role: {
      type: DataTypes.STRING(255),
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
    tableName: 'class_members',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "class_members_pkey",
        unique: true,
        fields: [
          { name: "class_id" },
          { name: "member_id" },
        ]
      },
    ]
  });
  }
}
