import { z } from 'zod';
import { postSchema } from '@/lib/schemas';

type PostSchema = z.infer<typeof postSchema>;

export default PostSchema;
