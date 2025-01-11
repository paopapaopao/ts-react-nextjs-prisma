import { z } from 'zod';

import { viewSchema } from '../schemas';

type ViewSchema = z.infer<typeof viewSchema>;

export default ViewSchema;
