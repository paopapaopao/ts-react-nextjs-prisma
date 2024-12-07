'use server';

import { type Comment, Prisma } from '@prisma/client';
import { prisma } from '../db';

// TODO
const readCommentWithUser = async (id: number) => {
  const response = await prisma.comment.findUnique({
    where: { id },
    include: { user: true },
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

const deleteComment = async (id: number): Promise<Comment | null> => {
  const args: Prisma.CommentDeleteArgs = {
    where: { id },
  };

  let response: Comment | null = null;

  try {
    response = await prisma.comment.delete(args);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export { deleteComment, readComments, readCommentWithUser };
