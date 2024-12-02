import { Prisma } from '@prisma/client';
import { prisma } from '../db';

const readCommentWithUser = async (id: number) => {
  const response = await prisma.comment.findUnique({
    where: { id },
    include: { user: true },
  });

  return response;
};

type CommentWithUser = Prisma.PromiseReturnType<typeof readCommentWithUser>;

export default CommentWithUser;
