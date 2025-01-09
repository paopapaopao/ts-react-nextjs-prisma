import { Prisma } from '@prisma/client';

import { readCommentWithRelationsAndRelationCountsAndUserReaction } from '../actions';

type CommentWithRelationsAndRelationCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readCommentWithRelationsAndRelationCountsAndUserReaction
  >;

export default CommentWithRelationsAndRelationCountsAndUserReaction;
