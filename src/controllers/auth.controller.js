import { User } from '../models/User.js';
import { signToken } from '../utils/jwt.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const avatar = Math.floor(Math.random() * 3) + 1; 
    const user = await User.create({ name, email, password });
    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role ,  avatar: user.avatar },
      token
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken({ sub: user._id.toString(), role: user.role });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (e) {
    next(e);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } });
  } catch (e) {
    next(e);
  }
};
