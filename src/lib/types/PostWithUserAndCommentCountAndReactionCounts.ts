import { Prisma } from '@prisma/client';

import { readPostWithUserAndCommentCountAndReactionCounts } from '../actions';

type PostWithUserAndCommentCountAndReactionCounts = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentCountAndReactionCounts
>;

export default PostWithUserAndCommentCountAndReactionCounts;
