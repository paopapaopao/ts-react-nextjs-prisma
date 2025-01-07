import { Prisma } from '@prisma/client';

import { readCommentWithUserAndReplyCountAndReactionCountsAndUserReaction } from '../actions';

type CommentWithUserAndReplyCountAndReactionCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readCommentWithUserAndReplyCountAndReactionCountsAndUserReaction
  >;

export default CommentWithUserAndReplyCountAndReactionCountsAndUserReaction;
