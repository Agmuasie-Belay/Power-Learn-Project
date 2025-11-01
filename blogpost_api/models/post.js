import { DataTypes } from "sequelize";
export default function (sequelize) {
  const Post = sequelize.define(
    "Post",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      }
    },
    { timestamps: true }
  );

  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: "userId" });
  };
  return Post;
}
