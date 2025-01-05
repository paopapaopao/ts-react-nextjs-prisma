import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction } from '../actions';

type PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction =
  Prisma.PromiseReturnType<
    typeof readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction
  >;

export default PostWithUserAndCommentsCountAndReactionsCountsAndUserReaction;
