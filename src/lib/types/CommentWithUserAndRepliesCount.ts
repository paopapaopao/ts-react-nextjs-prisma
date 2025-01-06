import { Prisma } from '@prisma/client';

import { readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction } from '../actions';

type CommentWithUserAndRepliesCount = Prisma.PromiseReturnType<
  typeof readCommentWithUserAndRepliesCountAndReactionsCountsAndUserReaction
>;

export default CommentWithUserAndRepliesCount;
