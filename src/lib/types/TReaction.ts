import { type Reaction } from '@prisma/client';

type TReaction = {
  data: { reaction: Reaction | null } | null;
  errors: { [key: string]: string[] } | null;
};

export default TReaction;
