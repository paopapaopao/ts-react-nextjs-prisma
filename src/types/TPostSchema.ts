import { z } from 'zod';
import { postSchema } from '@/schemas';

type TPostSchema = z.infer<typeof postSchema>;

export default TPostSchema;
