import { z } from 'zod';

import {
  commentSchema,
  postSchema,
  reactionSchema,
  viewSchema,
} from '@/lib/schemas';

export type CommentSchema = z.infer<typeof commentSchema>;
export type PostSchema = z.infer<typeof postSchema>;
export type ReactionSchema = z.infer<typeof reactionSchema>;
export type ViewSchema = z.infer<typeof viewSchema>;
