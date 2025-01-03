import { Prisma } from '@prisma/client';

import { readCommentWithUserAndRepliesCount } from '../actions';

type CommentWithUserAndRepliesCount = Prisma.PromiseReturnType<
  typeof readCommentWithUserAndRepliesCount
>;

export default CommentWithUserAndRepliesCount;
