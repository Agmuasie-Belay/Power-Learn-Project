import { Post, User } from "../models/index.js";

// List all posts
export const getAllPosts = async (req, res) => {
  const posts = await Post.findAll({ include: User });
  res.json(posts);
};

export const getPostById = async (req, res) => {
  const post = await Post.findByPk(req.params.id, { include: User});
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
};

export const createPost = async (req, res) => {
  const { title, content } = req.body;
  const post = await Post.create({ title, content, userId: req.user.id });
  res.json(post);
};

export const updatePost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  const { title, content } = req.body;
  await post.update({ title, content });
  res.json(post);
};

export const deletePost = async (req, res) => {
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.userId !== req.user.id) return res.status(403).json({ error: "Forbidden" });

  await post.destroy();
  res.json({ message: "Post deleted" });
};
