'use server';

import { prisma } from '../db';

const readCommentWithRelationsAndRelationCountsAndUserReaction = async (
  id: number,
  clerkUserId: string | null
) => {
  const comment = await prisma.comment.findUnique({
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

  if (comment === null) {
    return null;
  }

  const { reactions, ...commentWithoutReactions } = comment;
  const userReaction = reactions?.[0] ?? null;

  return {
    ...commentWithoutReactions,
    userReaction,
  };
};

export default readCommentWithRelationsAndRelationCountsAndUserReaction;
