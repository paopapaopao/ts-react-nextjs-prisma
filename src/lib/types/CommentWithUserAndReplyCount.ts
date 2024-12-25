import { Prisma } from '@prisma/client';
import { readCommentWithUserAndReplyCount } from '../actions';

type CommentWithUserAndReplyCount = Prisma.PromiseReturnType<
  typeof readCommentWithUserAndReplyCount
>;

export default CommentWithUserAndReplyCount;
