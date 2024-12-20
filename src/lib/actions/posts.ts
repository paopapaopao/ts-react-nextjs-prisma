'use server';

import { type Post, Prisma } from '@prisma/client';
import { prisma } from '../db';

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
const readPostWithUserAndCommentsCount = async (id: number) => {
  const response = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
  });

  return response;
};

// TODO
const readPostWithUserAndCommentsCountAndReactionCounts = async (
  id: number
) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: { comments: true },
      },
    },
  });

  const reactionCounts = await prisma.reaction.groupBy({
    where: { postId: id },
    by: ['postId', 'type'],
    _count: { type: true },
  });

  const counts = reactionCounts.reduce(
    (accumulator, reaction) => {
      if (reaction.postId === post?.id) {
        accumulator[reaction.type] = reaction._count.type;
      }

      return accumulator;
    },
    { LIKE: 0, DISLIKE: 0 }
  );

  return {
    ...post,
    reactionCounts: counts,
  };
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

export {
  readPost,
  readPosts,
  readPostWithUserAndCommentsCount,
  readPostWithUserAndCommentsCountAndReactionCounts,
};
