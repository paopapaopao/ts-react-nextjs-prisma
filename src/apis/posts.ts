import { revalidatePath } from 'next/cache';
import { Prisma, type Post } from '@prisma/client';
import { prisma } from '@/lib';

const createPost = async (
  payload: Prisma.PostUncheckedCreateInput
): Promise<Post | null> => {
  const { body, title } = payload;
  let response: Post | null = null;

  try {
    response = await prisma.post.create({
      data: {
        body,
        title,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.error(error);
  }

  return response;
};

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

export { createPost, readPost, readPosts };
