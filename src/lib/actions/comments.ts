'use server';

import { type Comment, Prisma } from '@prisma/client';
import { prisma } from '../db';

// TODO
const readCommentWithUserAndReplyCount = async (id: number) => {
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

const readComments = async (
  options: Prisma.CommentFindManyArgs
): Promise<Comment[]> => {
  let response: Comment[] = [];

  try {
    response = await prisma.comment.findMany(options);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export { readComments, readCommentWithUserAndReplyCount };
