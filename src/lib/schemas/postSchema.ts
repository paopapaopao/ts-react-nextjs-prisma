import { z } from 'zod';

const postSchema = z.object({
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
});

export default postSchema;
