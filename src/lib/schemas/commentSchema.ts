import { z } from 'zod';

const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character long' })
    .max(1000, { message: 'Must be at most 1000 characters long' }),
  userId: z.number().int().positive().finite(),
  clerkUserId: z.string().nullable(),
  postId: z.number().int().positive().finite(),
  parentCommentId: z.number().int().positive().finite().nullable(),
});

export default commentSchema;
