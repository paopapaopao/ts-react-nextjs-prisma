import { z } from 'zod';

const viewSchema = z.object({
  userId: z.number().int().positive().finite(),
  postId: z.number().int().positive().finite(),
});

export default viewSchema;
