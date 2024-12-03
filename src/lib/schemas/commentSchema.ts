import { z } from 'zod';

const commentShape = {
  id: z.number().int().positive().finite().optional(),
  body: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character long' })
    .max(1000, { message: 'Must be at most 1000 characters long' }),
  postId: z.number().int().positive().finite(),
  userId: z.number().int().positive().finite(),
  clerkUserId: z.string().optional(),
};

const commentSchema = z.object(commentShape);

export default commentSchema;
