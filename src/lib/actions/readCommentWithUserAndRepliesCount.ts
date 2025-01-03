'use server';

import { prisma } from '../db';

// TODO
const readCommentWithUserAndRepliesCount = async (id: number) => {
  const response = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { replies: true },
      },
    },
  });

  return response;
};

export default readCommentWithUserAndRepliesCount;
