import { Prisma } from '@prisma/client';

import { readCommentWithRelationsAndRelationCountsAndUserReaction } from '../actions';

type CommentWithUserAndReplyCountAndReactionCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readCommentWithRelationsAndRelationCountsAndUserReaction
  >;

export default CommentWithUserAndReplyCountAndReactionCountsAndUserReaction;
