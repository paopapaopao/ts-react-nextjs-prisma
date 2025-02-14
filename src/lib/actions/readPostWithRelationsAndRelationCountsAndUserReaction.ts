'use server';

import { prisma } from '../db';

const readPostWithRelationsAndRelationCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const response = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      originalPost: {
        include: { user: true },
      },
      _count: {
        select: {
          shares: true,
          comments: {
            where: { parentCommentId: null },
          },
          reactions: true,
          views: true,
        },
      },
      reactions: {
        where: { clerkUserId },
      },
    },
  });

  if (response === null) {
    return null;
  }

  const { reactions, ...responseWithoutReactions } = response;
  const userReaction = reactions[0] ?? null;

  return {
    ...responseWithoutReactions,
    userReaction,
  };
};

export default readPostWithRelationsAndRelationCountsAndUserReaction;
