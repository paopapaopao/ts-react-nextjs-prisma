import { Prisma } from '@prisma/client';
import { readCommentWithUserAndReplyCount } from '../actions';

type CommentWithUser = Prisma.PromiseReturnType<
  typeof readCommentWithUserAndReplyCount
>;

export default CommentWithUser;
