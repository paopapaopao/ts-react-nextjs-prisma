'use server';

import { type Comment, Prisma } from '@prisma/client';
import { prisma } from '../db';

const createComment = async (
  payload: Prisma.CommentUncheckedCreateInput
): Promise<Comment | null> => {
  const { body, postId } = payload;
  let response: Comment | null = null;

  try {
    response = await prisma.comment.create({
      data: {
        body,
        postId,
      },
    });
  } catch (error: unknown) {
    console.error(error);
  }

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

export { createComment, readComments };
