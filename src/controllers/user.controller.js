import { User } from '../models/User.js';

export const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (e) {
    next(e);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ message: 'User not found' });
    res.json({ user: u });
  } catch (e) {
    next(e);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { ...(name && { name }), ...(email && { email }) } },
      { new: true }
    ).select('-password');
    res.json({ user: updated });
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(400).json({ message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (e) {
    next(e);
  }
};
