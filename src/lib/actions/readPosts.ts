'use server';

import { type Post, Prisma } from '@prisma/client';

import { prisma } from '../db';

const readPosts = async (options: Prisma.PostFindManyArgs): Promise<Post[]> => {
  let response: Post[] = [];

  try {
    response = await prisma.post.findMany(options);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export default readPosts;
