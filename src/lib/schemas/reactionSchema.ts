import { z } from 'zod';
import { ReactionType } from '@prisma/client';

const reactionSchema = z.object({
  type: z.nativeEnum(ReactionType),
  userId: z.number().int().positive().finite(),
  clerkUserId: z.string().nullable(),
  postId: z.number().int().positive().finite().nullable(),
  commentId: z.number().int().positive().finite().nullable(),
});

export default reactionSchema;
