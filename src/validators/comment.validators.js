import { z } from "zod";

export const createCommentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(2000),
});

export const listCommentsSchema = z.object({
  post: z.string().optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});