import { DataTypes } from "sequelize";
export default function (sequelize) {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password:{
        type:DataTypes.STRING,
        allowNull:false
      }
    },
    { timestamps: true }
  );

  User.associate = (models) => {
    User.hasMany(models.Post, { foreignKey: "userId" });
  };
  return User;
}
