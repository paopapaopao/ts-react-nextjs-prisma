'use server';

import { type Post, Prisma } from '@prisma/client';
import { prisma } from '../db';

const createPost = async (
  payload: Prisma.PostUncheckedCreateInput
): Promise<Post | null> => {
  const { body, title, userId } = payload;
  let response: Post | null = null;

  try {
    response = await prisma.post.create({
      data: {
        body,
        title,
        userId,
      },
    });
  } catch (error: unknown) {
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
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

// TODO
const readPostWithComments = async (id: number) => {
  const response = await prisma.post.findUnique({
    where: { id },
    include: {
      comments: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  return response;
};

const readPosts = async (options: Prisma.PostFindManyArgs): Promise<Post[]> => {
  let response: Post[] = [];

  try {
    response = await prisma.post.findMany(options);
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

const updatePost = async (
  payload: Prisma.PostUncheckedUpdateInput
): Promise<Post | null> => {
  const { id, body, title } = payload;
  let response: Post | null = null;

  try {
    response = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        body,
        title,
      },
    });
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

const deletePost = async (id: number): Promise<Post | null> => {
  let response: Post | null = null;

  try {
    response = await prisma.post.delete({
      where: { id },
    });
  } catch (error: unknown) {
    console.error(error);
  }

  return response;
};

export {
  createPost,
  deletePost,
  readPost,
  readPosts,
  readPostWithComments,
  updatePost,
};
