import { z } from 'zod';

import { reactionSchema } from '../schemas';

type ReactionSchema = z.infer<typeof reactionSchema>;

export default ReactionSchema;
