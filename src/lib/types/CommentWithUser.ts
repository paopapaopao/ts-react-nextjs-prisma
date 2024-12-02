import { Prisma } from '@prisma/client';
import { readCommentWithUser } from '../actions';

type CommentWithUser = Prisma.PromiseReturnType<typeof readCommentWithUser>;

export default CommentWithUser;
