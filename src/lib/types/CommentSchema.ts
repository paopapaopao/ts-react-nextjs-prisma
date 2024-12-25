import { z } from 'zod';

import { commentSchema } from '../schemas';

type CommentSchema = z.infer<typeof commentSchema>;

export default CommentSchema;
