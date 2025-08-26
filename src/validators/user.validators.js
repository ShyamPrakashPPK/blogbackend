import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  email: z.string().email().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8)
});
