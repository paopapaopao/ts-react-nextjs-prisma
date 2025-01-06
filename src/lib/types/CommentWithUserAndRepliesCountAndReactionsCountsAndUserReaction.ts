import { Prisma } from '@prisma/client';

import { readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction } from '../actions';

type CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction
  >;

export default CommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction;
