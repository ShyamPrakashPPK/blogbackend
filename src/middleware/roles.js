// middleware/roles.ts
export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' });
  next();
};

export const allowSelfOrAdmin = (paramKey = 'id') => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
  const targetId = req.params?.[paramKey] || req.body?.id;
  const isSelf = targetId && targetId.toString() === req.user.id;
  const isAdmin = req.user.role === 'admin';
  if (!isSelf && !isAdmin) return res.status(403).json({ message: 'Forbidden' });
  next();
};
