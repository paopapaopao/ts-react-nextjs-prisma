import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentsCountAndReactionsCounts } from '../actions';

type PostWithUserAndCommentsCountAndReactionsCounts = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentsCountAndReactionsCounts
>;

export default PostWithUserAndCommentsCountAndReactionsCounts;
