import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentCountAndReactionCountsAndUserReaction } from '../actions';

type PostWithUserAndCommentCountAndReactionCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readPostWithUserAndCommentCountAndReactionCountsAndUserReaction
  >;

export default PostWithUserAndCommentCountAndReactionCountsAndUserReaction;
