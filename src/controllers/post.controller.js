import { Post } from '../models/Post.js';
import { getPagination } from '../utils/pagination.js';

export const createPost = async (req, res, next) => {
  try {
    console.log(req.body,"req.body");
    const post = await Post.create({ ...req.body, author: req.user.id });
    console.log(post,"post");
    res.status(201).json({ post });
  } catch (e) {
    next(e);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const hasLiked = (post.likedBy || []).some((id) => id.toString() === userId);
    if (hasLiked) {
      post.likedBy = post.likedBy.filter((id) => id.toString() !== userId);
      post.likes = Math.max(0, (post.likes || 0) - 1);
      await post.save();
      return res.json({ post: { _id: post._id, likes: post.likes }, liked: false, likes: post.likes });
    } else {
      post.likedBy.push(userId);
      post.likes = (post.likes || 0) + 1;
      await post.save();
      return res.json({ post: { _id: post._id, likes: post.likes }, liked: true, likes: post.likes });
    }
  } catch (e) {
    next(e);
  }
};


export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (e) {
    next(e);
  }
};

export const listPosts = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const q = {};
    if (req.query.q) {
      q.$text = { $search: req.query.q };
    }
    if (req.query.author) {
      q.author = req.query.author;
    }
    const [items, total] = await Promise.all([
      Post.find(q).populate('author', 'name email role avatar').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Post.countDocuments(q)
    ]);
    res.json({ posts: items, page, limit, total });
  } catch (e) {
    next(e);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email role avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ post });
  } catch (e) {
    next(e);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const existing = await Post.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role !== 'admin' && existing.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    existing.title = req.body.title ?? existing.title;
    existing.content = req.body.content ?? existing.content;
    existing.badge = req.body.badge ?? existing.badge;
    existing.thumbnailUrl = req.body.thumbnailUrl ?? existing.thumbnailUrl;
    if (typeof req.body.likes === 'number') existing.likes = req.body.likes;
    await existing.save();
    res.json({ post: existing });
  } catch (e) {
    next(e);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const existing = await Post.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Post not found' });
    if (req.user.role !== 'admin' && existing.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await existing.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (e) {
    next(e);
  }
};
