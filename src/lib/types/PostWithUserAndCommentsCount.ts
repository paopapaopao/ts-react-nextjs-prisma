import { Prisma } from '@prisma/client';
import { readPostWithUserAndCommentsCount } from '../actions';

type PostWithUserAndCommentsCount = Prisma.PromiseReturnType<
  typeof readPostWithUserAndCommentsCount
>;

export default PostWithUserAndCommentsCount;
