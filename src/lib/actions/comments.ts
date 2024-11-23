'use server';

import { type Comment, Prisma } from '@prisma/client';
import { prisma } from '../db';

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

export { readComments };
