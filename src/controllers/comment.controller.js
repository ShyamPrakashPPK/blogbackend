import { Comment } from '../models/Comment.js';
import { getPagination } from '../utils/pagination.js';

export const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;
    const comment = await Comment.create({ post: postId, content, author: req.user.id });
    const populated = await comment.populate('author', 'name email role');
    res.status(201).json({ comment: populated });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ message: 'You have already commented on this post' });
    next(e);
  }
};

export const listComments = async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const q = {};
    if (req.query.post) q.post = req.query.post;
    const [items, total] = await Promise.all([
      Comment.find(q).populate('author', 'name email role').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Comment.countDocuments(q),
    ]);
    res.json({ comments: items, page, limit, total });
  } catch (e) { next(e); }
};

export const deleteComment = async (req, res, next) => {
  try {
    const c = await Comment.findById(req.params.id);
    if (!c) return res.status(404).json({ message: 'Comment not found' });
    if (req.user.role !== 'admin' && c.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await c.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
};