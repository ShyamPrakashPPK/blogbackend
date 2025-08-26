// middleware/auth.ts
import { verifyToken } from '../utils/jwt.js';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const decoded = verifyToken(token); // expects { sub, role, iat, exp }
    if (!decoded?.sub) return res.status(401).json({ message: 'Unauthorized' });

    // Optional: hit DB to ensure user still exists / not disabled
    const user = await User.findById(decoded.sub).select('_id role');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = { id: user._id.toString(), role: user.role };
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
