import { Prisma } from '@prisma/client';
import { readPostWithComments } from '../actions';

type PostWithComments = Prisma.PromiseReturnType<typeof readPostWithComments>;

export default PostWithComments;
