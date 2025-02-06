'use server';

import { prisma } from '../db';

const readCommentWithRelationsAndRelationCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const response = await prisma.comment.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: {
          replies: true,
          reactions: true,
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

  const { reactions, ...commentWithoutReactions } = response;
  const userReaction = reactions[0] ?? null;

  return {
    ...commentWithoutReactions,
    userReaction,
  };
};

export default readCommentWithRelationsAndRelationCountsAndUserReaction;
