import { z } from 'zod';

const postShape = {
  id: z.number().int().positive().finite().optional(),
  body: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character long' })
    .max(1000, { message: 'Must be at most 1000 characters long' }),
  title: z
    .string()
    .trim()
    .min(1, { message: 'Must be at least 1 character long' })
    .max(100, { message: 'Must be at most 100 characters long' }),
  userId: z.number().int().positive().finite(),
  clerkUserId: z.string().optional(),
};

const postSchema = z.object(postShape);

export default postSchema;
