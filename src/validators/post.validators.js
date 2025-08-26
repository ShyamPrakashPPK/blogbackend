import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  badge: z.string().optional(),
  thumbnailUrl: z.string().url().optional()
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  badge: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  likes: z.coerce.number().min(0).optional(),
});