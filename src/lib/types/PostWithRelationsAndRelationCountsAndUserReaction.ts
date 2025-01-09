import { Prisma } from '@prisma/client';

import { readPostWithRelationsAndRelationCountsAndUserReaction } from '../actions';

type PostWithRelationsAndRelationCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readPostWithRelationsAndRelationCountsAndUserReaction
  >;

export default PostWithRelationsAndRelationCountsAndUserReaction;
