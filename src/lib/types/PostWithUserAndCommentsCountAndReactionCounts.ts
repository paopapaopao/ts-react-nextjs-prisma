import { Prisma } from '@prisma/client';
import { readPostWithUserAndCommentsCountAndReactionCounts } from '../actions';

type PostWithUserAndCommentsCountAndReactionCounts = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentsCountAndReactionCounts
>;

export default PostWithUserAndCommentsCountAndReactionCounts;
