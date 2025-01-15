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
          comments: {
            where: { parentCommentId: null },
          },
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

  const { reactions, ...postWithoutReactions } = post;
  const userReaction = reactions?.[0]?.type ?? null;

  return {
    ...postWithoutReactions,
    userReaction,
  };
};

export default readPostWithRelationsAndRelationCountsAndUserReaction;
