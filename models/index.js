import sequelize from "../config/db.js";
import UserModel from "./user.js";
import PostModel from "./post.js";
import { DataTypes } from "sequelize";

const User = UserModel(sequelize, DataTypes);
const Post = PostModel(sequelize, DataTypes);

const models = { User, Post };
Object.values(models).forEach((model) => {
  if (model.associate) model.associate(models);
});

export { sequelize, User, Post };
