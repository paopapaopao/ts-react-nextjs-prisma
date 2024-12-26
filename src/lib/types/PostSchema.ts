import { z } from 'zod';

import { postSchema } from '../schemas';

type PostSchema = z.infer<typeof postSchema>;

export default PostSchema;
