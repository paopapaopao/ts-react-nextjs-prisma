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
      originalPost: true,
      _count: {
        select: {
          shares: true,
          comments: true,
          reactions: true,
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

  const userReaction = post.reactions[0].type || null;
  const { reactions, ...updatedPost } = post;

  return { ...updatedPost, userReaction };
};

export default readPostWithRelationsAndRelationCountsAndUserReaction;
