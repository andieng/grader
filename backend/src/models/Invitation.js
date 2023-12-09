import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Invitation extends Model {
  static init(sequelize, DataTypes) {
  return super.init({
    token: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
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
    email: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'invitations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "invitations_pkey",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}
