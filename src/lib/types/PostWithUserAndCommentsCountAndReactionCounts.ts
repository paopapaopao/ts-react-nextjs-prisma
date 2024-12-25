import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentCountAndReactionCounts } from '../actions';

type PostWithUserAndCommentsCountAndReactionCounts = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentCountAndReactionCounts
>;

export default PostWithUserAndCommentsCountAndReactionCounts;
