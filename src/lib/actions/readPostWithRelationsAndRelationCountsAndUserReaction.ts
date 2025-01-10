'use server';

import { prisma } from '../db';

const readPostWithRelationsAndRelationCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      originalPost: {
        include: { user: true },
      },
      _count: {
        select: {
          shares: true,
          comments: true,
          reactions: true,
          views: true,
        },
      },
      reactions: {
        where: { clerkUserId },
        select: { type: true },
      },
    },
  });

  if (post === null) {
    return null;
  }

  const { reactions, ...updatedPost } = post;
  const userReaction = reactions?.[0]?.type || null;

  return {
    ...updatedPost,
    userReaction,
  };
};

export default readPostWithRelationsAndRelationCountsAndUserReaction;
