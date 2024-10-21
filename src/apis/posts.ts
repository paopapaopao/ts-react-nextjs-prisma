import { Prisma, type Post } from '@prisma/client';
import { prisma } from '@/lib';

const readPost = async (
  options: Prisma.PostFindUniqueArgs
): Promise<Post | null> => {
  let response: Post | null = null;

  try {
    response = await prisma.post.findUnique(options);
  } catch (error) {
    console.error(error);
  }

  return response;
};

const readPosts = async (options: Prisma.PostFindManyArgs): Promise<Post[]> => {
  let response: Post[] = [];

  try {
    response = await prisma.post.findMany(options);
  } catch (error) {
    console.error(error);
  }

  return response;
};

export { readPost, readPosts };
