import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction } from '../actions';

type PostWithUserAndCommentsCountAndReactionsCounts = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentsCountAndReactionsCountsAndUserReaction
>;

export default PostWithUserAndCommentsCountAndReactionsCounts;
