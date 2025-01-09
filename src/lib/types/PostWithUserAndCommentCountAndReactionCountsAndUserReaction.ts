import { Prisma } from '@prisma/client';

import { readPostWithRelationsAndRelationCountsAndUserReaction } from '../actions';

type PostWithUserAndCommentCountAndReactionCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readPostWithRelationsAndRelationCountsAndUserReaction
  >;

export default PostWithUserAndCommentCountAndReactionCountsAndUserReaction;
