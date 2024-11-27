import { z } from 'zod';
import { commentSchema } from '@/lib/schemas';

type CommentSchema = z.infer<typeof commentSchema>;

export default CommentSchema;
